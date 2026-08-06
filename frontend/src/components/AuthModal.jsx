import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import OtpInput from "./OtpInput.jsx";
import { resizeImageToDataUrl } from "../utils/imageResize.js";

const MODES = {
  LOGIN: "login",
  SIGNUP: "signup",
  VERIFY_SIGNUP: "verify-signup",
  FORGOT_EMAIL: "forgot-email",
  FORGOT_RESET: "forgot-reset",
};

// The 3-step signup wizard: Identity -> Presence -> Network
const SIGNUP_STEPS = [
  { number: 1, label: "Identity" },
  { number: 2, label: "Presence" },
  { number: 3, label: "Network" },
];

/* ── tiny inline SVG icons ────────────────────────────────────── */
const IconEmail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="3"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/></svg>
);
const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
);
const IconEye = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);
const IconEyeOff = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
);

export default function AuthModal({ onClose }) {
  const {
    login,
    signup,
    checkUsernameAvailable,
    verifySignupOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    loginWithGoogle,
  } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState(MODES.LOGIN);
  const [signupStep, setSignupStep] = useState(1);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const [avatarDataUrl, setAvatarDataUrl] = useState(null);
  const [avatarProcessing, setAvatarProcessing] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [categories, setCategories] = useState([]);
  const [favoriteCategory, setFavoriteCategory] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const googleBtnRef = useRef(null);
  const fileInputRef = useRef(null);
  const usernameDebounceRef = useRef(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (mode !== MODES.LOGIN && !(mode === MODES.SIGNUP && signupStep === 2)) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error(
        "VITE_GOOGLE_CLIENT_ID is missing or empty. Check frontend/.env."
      );
      if (googleBtnRef.current) {
        googleBtnRef.current.innerHTML =
          '<p style="font-size:12px;color:var(--text-faint);text-align:center;">Google sign-in is not configured</p>';
      }
      return;
    }

    let cancelled = false;
    let attempts = 0;

    function tryRender() {
      if (cancelled) return;
      if (!googleBtnRef.current) return;

      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "filled_black",
          size: "large",
          width: 320,
          shape: "pill",
          text: "continue_with",
        });
        return;
      }

      attempts += 1;
      if (attempts < 20) {
        setTimeout(tryRender, 150);
      }
    }

    tryRender();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, signupStep]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    clearTimeout(usernameDebounceRef.current);
    const trimmed = username.trim().toLowerCase();

    if (!trimmed) {
      setUsernameStatus("idle");
      return;
    }
    if (!/^[a-z0-9_]{3,20}$/.test(trimmed)) {
      setUsernameStatus("invalid");
      return;
    }

    setUsernameStatus("checking");
    usernameDebounceRef.current = setTimeout(async () => {
      try {
        const available = await checkUsernameAvailable(trimmed);
        setUsernameStatus(available ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, 400);

    return () => clearTimeout(usernameDebounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  async function handleGoogleResponse(response) {
    setError(null);
    try {
      const data = await loginWithGoogle(response.credential);
      if (data.requiresVerification) {
        setEmail(data.email);
        setCode("");
        setMode(MODES.VERIFY_SIGNUP);
        showToast(`Verification code sent to ${data.email}`, "info");
        return;
      }
      showToast("Signed in with Google", "success");
      onClose();
    } catch (err) {
      setError(err.message);
    }
  }

  function startResendCooldown() {
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function switchToLogin() {
    setError(null);
    setMode(MODES.LOGIN);
  }

  function switchToSignup() {
    setError(null);
    setMode(MODES.SIGNUP);
    setSignupStep(1);
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password, rememberMe);
      showToast("Welcome back", "success");
      onClose();
    } catch (err) {
      if (err.requiresVerification) {
        setError(null);
        setMode(MODES.VERIFY_SIGNUP);
        showToast("Please verify your email to continue", "info");
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAvatarFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/^image\/(png|jpeg|jpg)$/.test(file.type)) {
      setError("Please choose a PNG or JPG image.");
      return;
    }

    setError(null);
    setAvatarProcessing(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file, 480, 0.85);
      setAvatarDataUrl(dataUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setAvatarProcessing(false);
    }
  }

  function handleStep1Next(e) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (usernameStatus === "invalid") {
      setError("Username must be 3-20 characters: lowercase letters, numbers, underscores only.");
      return;
    }
    if (usernameStatus === "taken") {
      setError("That username is already taken.");
      return;
    }
    if (usernameStatus !== "available") {
      setError("Please choose a username.");
      return;
    }

    setSignupStep(2);
  }

  function handleStep2Next(e) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSignupStep(3);
  }

  async function handleStep3Submit(e) {
    e.preventDefault();
    setError(null);

    if (!agreeToTerms) {
      setError("Please agree to the Terms and Privacy Policy to continue.");
      return;
    }

    setSubmitting(true);
    try {
      await signup({
        name,
        username,
        email,
        password,
        avatarDataUrl,
        favoriteCategory: favoriteCategory || null,
      });
      setCode("");
      setMode(MODES.VERIFY_SIGNUP);
      showToast(`Verification code sent to ${email}`, "info");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifySubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = await verifySignupOtp(email, code);
      const firstName = (data.user?.name || name).split(" ")[0] || "there";
      showToast(`Welcome, ${firstName}`, "success");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend(purpose) {
    if (resendCooldown > 0) return;
    setError(null);
    try {
      await resendOtp(email, purpose);
      showToast("Code resent", "success");
      startResendCooldown();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleForgotEmailSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await forgotPassword(email);
      setCode("");
      setMode(MODES.FORGOT_RESET);
      showToast(`If that email has an account, a code was sent`, "info");
      startResendCooldown();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotResetSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(email, code, newPassword);
      showToast("Password reset. Please log in.", "success");
      setMode(MODES.LOGIN);
      setPassword("");
      setCode("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const isWizardModal = mode === MODES.SIGNUP;

  return (
    <div className="compare-overlay" onClick={onClose}>
      <div
        className={`auth-modal ${isWizardModal ? "auth-modal-wide" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Close button ── */}
        <button className="auth-close-btn" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        {/* ── Brand header ── */}
        <div className="auth-brand">
          <span className="auth-brand-logo">DockOrbit</span>
        </div>

        {/* ── Top Mode Switcher Tabs (Login / Signup) ── */}
        {(mode === MODES.LOGIN || mode === MODES.SIGNUP) && (
          <div className="auth-segmented-tabs">
            <button
              type="button"
              className={`auth-segmented-tab ${mode === MODES.LOGIN ? "is-active" : ""}`}
              onClick={switchToLogin}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-segmented-tab ${mode === MODES.SIGNUP ? "is-active" : ""}`}
              onClick={switchToSignup}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* ── Mode-specific title & subtitle ── */}
        <h2 className="auth-title">
          {mode === MODES.LOGIN && "Welcome back"}
          {mode === MODES.SIGNUP && "Create your account"}
          {mode === MODES.VERIFY_SIGNUP && "Verify your email"}
          {mode === MODES.FORGOT_EMAIL && "Reset your password"}
          {mode === MODES.FORGOT_RESET && "Enter reset code & new password"}
        </h2>
        <p className="auth-subtitle">
          {mode === MODES.LOGIN && "Sign in to discover and compare channels"}
          {mode === MODES.SIGNUP && "Join the community of smart viewers"}
          {mode === MODES.VERIFY_SIGNUP && `We sent a 6-digit code to ${email}`}
          {mode === MODES.FORGOT_EMAIL && "We'll send you a code to reset it"}
          {mode === MODES.FORGOT_RESET && `Check ${email} for your verification code`}
        </p>

        {/* ────────────────────── LOGIN ────────────────────── */}
        {mode === MODES.LOGIN && (
          <>
            <div className="google-btn-wrap" ref={googleBtnRef} />

            <div className="auth-divider">
              <span>or continue with email</span>
            </div>

            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <label className="auth-label">
                Email
                <div className="auth-field-wrap">
                  <span className="auth-field-icon"><IconEmail /></span>
                  <input
                    type="email"
                    className="auth-input auth-input-iconed"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </label>
              <label className="auth-label">
                Password
                <div className="auth-field-wrap">
                  <span className="auth-field-icon"><IconLock /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="auth-input auth-input-iconed auth-input-has-toggle"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="auth-toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </label>

              <div className="auth-checkbox-row">
                <label className="neu-checkbox-row">
                  <span className="neu-checkbox-wrap">
                    <input
                      type="checkbox"
                      className="neu-checkbox-input"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="neu-checkbox-box" />
                  </span>
                  Remember me
                </label>
                <button
                  type="button"
                  className="auth-inline-link"
                  onClick={() => {
                    setError(null);
                    setMode(MODES.FORGOT_EMAIL);
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" className="auth-submit" disabled={submitting}>
                {submitting ? "Signing in…" : "Sign in"}
                {!submitting && <IconArrowRight />}
              </button>
            </form>

            <p className="auth-bottom-prompt">
              Don't have an account?{" "}
              <button type="button" onClick={switchToSignup}>Create one free</button>
            </p>
          </>
        )}

        {/* ────────────────────── SIGNUP WIZARD ────────────────────── */}
        {mode === MODES.SIGNUP && (
          <div className="signup-stepper">
            {SIGNUP_STEPS.map((step, i) => (
              <div className="signup-stepper-item" key={step.number}>
                <div
                  className={`signup-stepper-circle ${
                    signupStep === step.number
                      ? "is-current"
                      : signupStep > step.number
                      ? "is-done"
                      : ""
                  }`}
                >
                  {signupStep > step.number ? "✓" : step.number}
                </div>
                <span
                  className={`signup-stepper-label ${
                    signupStep === step.number ? "is-current" : ""
                  }`}
                >
                  {step.label}
                </span>
                {i < SIGNUP_STEPS.length - 1 && <span className="signup-stepper-line" />}
              </div>
            ))}
          </div>
        )}

        {/* ── Signup Step 1: Identity ── */}
        {mode === MODES.SIGNUP && signupStep === 1 && (
          <form className="auth-form signup-step-identity" onSubmit={handleStep1Next}>
            <div className="signup-identity-grid">
              <div className="signup-identity-fields">
                <label className="auth-label">
                  Full Name
                  <div className="auth-field-wrap">
                    <span className="auth-field-icon"><IconUser /></span>
                    <input
                      type="text"
                      className="auth-input auth-input-iconed"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      required
                      autoFocus
                    />
                  </div>
                </label>

                <label className="auth-label">
                  Username
                  <div className="auth-input-with-icon">
                    <span className="auth-input-icon">@</span>
                    <input
                      type="text"
                      className="auth-input auth-input-indented"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      placeholder="alex_rivera"
                      required
                    />
                  </div>
                  {usernameStatus === "checking" && (
                    <span className="username-status">Checking availability…</span>
                  )}
                  {usernameStatus === "available" && (
                    <span className="username-status username-status-ok">✓ Available</span>
                  )}
                  {usernameStatus === "taken" && (
                    <span className="username-status username-status-bad">
                      ✕ Already taken
                    </span>
                  )}
                  {usernameStatus === "invalid" && username && (
                    <span className="username-status username-status-bad">
                      3-20 chars: letters, numbers, underscores
                    </span>
                  )}
                </label>
              </div>

              <div className="signup-avatar-col">
                <span className="signup-avatar-label">Profile Image</span>
                <button
                  type="button"
                  className="signup-avatar-picker"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarProcessing}
                >
                  {avatarDataUrl ? (
                    <img src={avatarDataUrl} alt="Profile preview" className="signup-avatar-img" />
                  ) : (
                    <span className="signup-avatar-placeholder">
                      <span className="signup-avatar-icon">📷</span>
                      {avatarProcessing ? "Processing…" : "Upload PNG/JPG"}
                    </span>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleAvatarFileChange}
                  style={{ display: "none" }}
                />
                <span className="signup-avatar-hint">Minimum 400×400px recommended</span>
              </div>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit auth-submit-next">
              Continue <IconArrowRight />
            </button>
          </form>
        )}

        {/* ── Signup Step 2: Presence ── */}
        {mode === MODES.SIGNUP && signupStep === 2 && (
          <form className="auth-form" onSubmit={handleStep2Next}>
            <div className="google-btn-wrap" ref={googleBtnRef} />
            <div className="auth-divider">
              <span>or continue with email</span>
            </div>

            <label className="auth-label">
              Email
              <div className="auth-field-wrap">
                <span className="auth-field-icon"><IconEmail /></span>
                <input
                  type="email"
                  className="auth-input auth-input-iconed"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </label>
            <label className="auth-label">
              Password
              <div className="auth-field-wrap">
                <span className="auth-field-icon"><IconLock /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="auth-input auth-input-iconed auth-input-has-toggle"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="auth-toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </label>
            <label className="auth-label">
              Confirm Password
              <div className="auth-field-wrap">
                <span className="auth-field-icon"><IconShield /></span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="auth-input auth-input-iconed auth-input-has-toggle"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="auth-toggle-password-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <div className="signup-step-actions">
              <button
                type="button"
                className="auth-back-btn"
                onClick={() => {
                  setError(null);
                  setSignupStep(1);
                }}
              >
                <IconArrowLeft /> Back
              </button>
              <button type="submit" className="auth-submit auth-submit-next">
                Continue <IconArrowRight />
              </button>
            </div>
          </form>
        )}

        {/* ── Signup Step 3: Network ── */}
        {mode === MODES.SIGNUP && signupStep === 3 && (
          <form className="auth-form" onSubmit={handleStep3Submit}>
            <label className="auth-label">
              Favorite category (optional)
              <select
                className="sort-select signup-category-select"
                value={favoriteCategory}
                onChange={(e) => setFavoriteCategory(e.target.value)}
              >
                <option value="">No preference</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="neu-checkbox-row">
              <span className="neu-checkbox-wrap">
                <input
                  type="checkbox"
                  className="neu-checkbox-input"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                />
                <span className="neu-checkbox-box" />
              </span>
              I agree to the{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <div className="signup-step-actions">
              <button
                type="button"
                className="auth-back-btn"
                onClick={() => {
                  setError(null);
                  setSignupStep(2);
                }}
              >
                <IconArrowLeft /> Back
              </button>
              <button type="submit" className="auth-submit" disabled={submitting}>
                {submitting ? "Creating account…" : "Create Account"}
                {!submitting && <IconArrowRight />}
              </button>
            </div>
          </form>
        )}

        {/* ── Signup bottom prompt ── */}
        {mode === MODES.SIGNUP && (
          <p className="auth-bottom-prompt">
            Already have an account?{" "}
            <button type="button" onClick={switchToLogin}>Sign in</button>
          </p>
        )}

        {/* ────────────────────── VERIFY OTP ────────────────────── */}
        {mode === MODES.VERIFY_SIGNUP && (
          <form className="auth-form" onSubmit={handleVerifySubmit}>
            <OtpInput value={code} onChange={setCode} length={6} autoFocus />

            {error && <p className="auth-error">{error}</p>}

            <button
              type="submit"
              className="auth-submit"
              disabled={submitting || code.length !== 6}
            >
              {submitting ? "Verifying…" : "Verify & continue"}
              {!submitting && <IconArrowRight />}
            </button>

            <button
              type="button"
              className="auth-forgot-link"
              onClick={() => handleResend("signup")}
              disabled={resendCooldown > 0}
            >
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
            </button>
          </form>
        )}

        {/* ────────────────────── FORGOT PASSWORD ────────────────────── */}
        {mode === MODES.FORGOT_EMAIL && (
          <form className="auth-form" onSubmit={handleForgotEmailSubmit}>
            <label className="auth-label">
              Email
              <div className="auth-field-wrap">
                <span className="auth-field-icon"><IconEmail /></span>
                <input
                  type="email"
                  className="auth-input auth-input-iconed"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? "Sending…" : "Send reset code"}
              {!submitting && <IconArrowRight />}
            </button>

            <button type="button" className="auth-forgot-link" onClick={switchToLogin}>
              <IconArrowLeft /> Back to sign in
            </button>
          </form>
        )}

        {/* ────────────────────── RESET PASSWORD ────────────────────── */}
        {mode === MODES.FORGOT_RESET && (
          <form className="auth-form" onSubmit={handleForgotResetSubmit}>
            <OtpInput value={code} onChange={setCode} length={6} autoFocus />

            <label className="auth-label">
              New password
              <div className="auth-field-wrap">
                <span className="auth-field-icon"><IconLock /></span>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="auth-input auth-input-iconed auth-input-has-toggle"
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="auth-toggle-password-btn"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showNewPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </label>

            <label className="auth-label">
              Confirm new password
              <div className="auth-field-wrap">
                <span className="auth-field-icon"><IconShield /></span>
                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  className="auth-input auth-input-iconed auth-input-has-toggle"
                  placeholder="Re-enter new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="auth-toggle-password-btn"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  aria-label={showConfirmNewPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showConfirmNewPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button
              type="submit"
              className="auth-submit"
              disabled={submitting || code.length !== 6}
            >
              {submitting ? "Resetting…" : "Reset password"}
              {!submitting && <IconArrowRight />}
            </button>

            <button
              type="button"
              className="auth-forgot-link"
              onClick={() => handleResend("reset")}
              disabled={resendCooldown > 0}
            >
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}