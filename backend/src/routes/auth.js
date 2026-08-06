import express from "express";
import { pool } from "../db/database.js";
import { hashPassword, verifyPassword, generateToken } from "../services/authService.js";
import { verifyGoogleToken } from "../services/googleAuthService.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createOtp, verifyOtp } from "../services/otpService.js";
import { sendSignupOtp, sendPasswordResetOtp, sendWelcomeEmail } from "../services/emailService.js";
import { authLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Normalizes email casing/whitespace everywhere it's used. Without
// this, "User@Gmail.com" and "user@gmail.com" were treated as two
// different accounts (a real bug, not just a style nit) - Postgres's
// UNIQUE constraint on email is case-sensitive by default.
function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

function isValidUsername(username) {
  return /^[a-z0-9_]{3,20}$/.test(username);
}

const MAX_AVATAR_DATA_URL_LENGTH = 700_000; // ~500KB image, comfortably under the 1.5mb JSON body limit

// GET /api/auth/check-username?username=alex_rivera
// Used by the signup wizard's Identity step to show live availability
// feedback as the user types, before they submit the whole form.
router.get("/check-username", async (req, res) => {
  const username = (req.query.username || "").trim().toLowerCase();
  if (!isValidUsername(username)) {
    return res.json({ available: false, reason: "invalid" });
  }
  try {
    const result = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
    res.json({ available: result.rows.length === 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ available: false, reason: "error" });
  }
});

// POST /api/auth/signup  { name, username, email, password, avatarDataUrl, favoriteCategory }
// Creates the account as UNVERIFIED and emails a code. No token is
// issued yet - the frontend must call /verify-signup with the code
// before the account can log in.
router.post("/signup", authLimiter, async (req, res) => {
  const name = (req.body.name || "").trim().slice(0, 100);
  const username = (req.body.username || "").trim().toLowerCase();
  const email = normalizeEmail(req.body.email);
  const { password, avatarDataUrl, favoriteCategory } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!isValidUsername(username)) {
    return res.status(400).json({
      error: "Username must be 3-20 characters: lowercase letters, numbers, and underscores only",
    });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: "A valid email is required" });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }
  if (avatarDataUrl && avatarDataUrl.length > MAX_AVATAR_DATA_URL_LENGTH) {
    return res.status(413).json({ error: "Profile image is too large - please use a smaller photo" });
  }

  try {
    const existingEmail = await pool.query(
      "SELECT id, email_verified FROM users WHERE email = $1",
      [email]
    );
    if (existingEmail.rows.length > 0 && existingEmail.rows[0].email_verified) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const existingUsername = await pool.query(
      "SELECT id FROM users WHERE username = $1 AND email != $2",
      [username, email]
    );
    if (existingUsername.rows.length > 0) {
      return res.status(409).json({ error: "That username is already taken" });
    }

    const passwordHash = await hashPassword(password);

    if (existingEmail.rows.length > 0) {
      // Unverified account from a previous incomplete signup attempt -
      // update it and resend a code rather than erroring.
      await pool.query(
        `UPDATE users
         SET name = $1, username = $2, password_hash = $3, avatar_data = $4, favorite_category = $5
         WHERE email = $6`,
        [name, username, passwordHash, avatarDataUrl || null, favoriteCategory || null, email]
      );
    } else {
      await pool.query(
        `INSERT INTO users (name, username, email, password_hash, avatar_data, favorite_category, email_verified)
         VALUES ($1, $2, $3, $4, $5, $6, false)`,
        [name, username, email, passwordHash, avatarDataUrl || null, favoriteCategory || null]
      );
    }

    const code = await createOtp(email, "signup");
    await sendSignupOtp(email, code, name);

    res.status(201).json({ requiresVerification: true, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// POST /api/auth/verify-signup  { email, code }
// Confirms the OTP, marks the account verified, and logs the user in.
router.post("/verify-signup", authLimiter, async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }

  try {
    const valid = await verifyOtp(email, code, "signup");
    if (!valid) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    const result = await pool.query(
      `UPDATE users SET email_verified = true WHERE email = $1
       RETURNING id, name, username, email, avatar_data AS "avatarData", favorite_category AS "favoriteCategory"`,
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No account found for this email" });
    }

    const user = result.rows[0];
    const token = generateToken(user);

    // Fire-and-forget: a welcome email failing to send shouldn't block
    // the user from actually logging in.
    sendWelcomeEmail(user.email, user.name).catch((err) =>
      console.error("[email] Welcome email failed to send:", err.message)
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Verification failed" });
  }
});

// POST /api/auth/resend-otp  { email, purpose: "signup" | "reset" }
router.post("/resend-otp", authLimiter, async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { purpose } = req.body;
  if (!email || !["signup", "reset"].includes(purpose)) {
    return res.status(400).json({ error: "email and a valid purpose are required" });
  }

  try {
    const result = await pool.query("SELECT name FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      // Don't reveal whether the email exists - respond success either way
      return res.json({ sent: true });
    }

    const code = await createOtp(email, purpose);
    if (purpose === "signup") {
      await sendSignupOtp(email, code, result.rows[0].name);
    } else {
      await sendPasswordResetOtp(email, code);
    }

    res.json({ sent: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not resend code" });
  }
});

// POST /api/auth/login  { email, password }
router.post("/login", authLimiter, async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await pool.query(
      `SELECT id, name, username, email, password_hash, email_verified,
              avatar_data AS "avatarData", favorite_category AS "favoriteCategory"
       FROM users WHERE email = $1`,
      [email]
    );
    const row = result.rows[0];

    if (!row || !row.password_hash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await verifyPassword(password, row.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!row.email_verified) {
      return res.status(403).json({
        error: "Please verify your email before logging in",
        requiresVerification: true,
        email: row.email,
      });
    }

    const user = {
      id: row.id,
      name: row.name,
      username: row.username,
      email: row.email,
      avatarData: row.avatarData,
      favoriteCategory: row.favoriteCategory,
    };
    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// POST /api/auth/forgot-password  { email }
// Always responds success (even if the email doesn't exist) so this
// endpoint can't be used to check which emails have accounts.
router.post("/forgot-password", authLimiter, async (req, res) => {
  const email = normalizeEmail(req.body.email);
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const result = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND password_hash IS NOT NULL",
      [email]
    );

    if (result.rows.length > 0) {
      const code = await createOtp(email, "reset");
      await sendPasswordResetOtp(email, code);
    }

    res.json({ sent: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not process request" });
  }
});

// POST /api/auth/reset-password  { email, code, newPassword }
router.post("/reset-password", authLimiter, async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { code, newPassword } = req.body;

  if (!email || !code || !newPassword || newPassword.length < 6) {
    return res.status(400).json({
      error: "Email, code, and a new password (6+ characters) are required",
    });
  }

  try {
    const valid = await verifyOtp(email, code, "reset");
    if (!valid) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    const passwordHash = await hashPassword(newPassword);
    await pool.query("UPDATE users SET password_hash = $1 WHERE email = $2", [
      passwordHash,
      email,
    ]);

    res.json({ reset: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Password reset failed" });
  }
});

// POST /api/auth/google  { credential }
router.post("/google", authLimiter, async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: "Missing Google credential" });
  }

  try {
    const payload = await verifyGoogleToken(credential);
    const googleEmail = normalizeEmail(payload.email);

    const existing = await pool.query(
      "SELECT id, name, email, email_verified FROM users WHERE google_id = $1 OR email = $2",
      [payload.sub, googleEmail]
    );

    let user;
    let alreadyVerified;

    if (existing.rows.length > 0) {
      user = existing.rows[0];
      alreadyVerified = user.email_verified === true;
      await pool.query("UPDATE users SET google_id = $1 WHERE id = $2", [payload.sub, user.id]);
    } else {
      const result = await pool.query(
        "INSERT INTO users (name, email, google_id, email_verified) VALUES ($1, $2, $3, false) RETURNING id, name, email",
        [payload.name, googleEmail, payload.sub]
      );
      user = result.rows[0];
      alreadyVerified = false;
    }

    // Only a genuinely already-verified account gets an instant login.
    // Anyone newly created (or an old unverified password-signup
    // account authenticating via Google for the first time) goes
    // through the same OTP verification step as regular signup,
    // rather than skipping straight to logged-in - this keeps the
    // verification step consistent no matter how the account started.
    if (alreadyVerified) {
      const token = generateToken(user);
      return res.json({ token, user });
    }

    const code = await createOtp(googleEmail, "signup");
    await sendSignupOtp(googleEmail, code, user.name);

    res.json({ requiresVerification: true, email: googleEmail });
  } catch (err) {
    console.error("Google sign-in error:", err.message);
    res.status(401).json({ error: "Google sign-in failed. " + err.message });
  }
});

// GET /api/auth/me  (requires Authorization header) - NOT rate limited
// like the routes above, since it fires on every normal page load for
// a logged-in user and is already protected by requiring a valid JWT.
// Fetches fresh data from the database rather than just echoing the
// JWT payload, so username/avatar/favoriteCategory are always current
// even if they were set after the token was issued.
router.get("/me", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, username, email, avatar_data AS "avatarData", favorite_category AS "favoriteCategory"
       FROM users WHERE id = $1`,
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load account" });
  }
});

export default router;