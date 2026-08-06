// otpService.js
//
// Handles creating and verifying one-time codes stored in the
// otp_codes table. Codes expire after 10 minutes and can only be used
// once. Old/expired codes for the same email+purpose are invalidated
// when a new one is issued, so only the most recent code works.

import { pool } from "../db/database.js";
import { generateOtpCode } from "./emailService.js";

const EXPIRY_MINUTES = 10;

export async function createOtp(email, purpose) {
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

  // Invalidate any earlier unused codes for this email+purpose so only
  // the newest one is valid - prevents an old leaked code from an
  // earlier request still working.
  await pool.query(
    "UPDATE otp_codes SET used = true WHERE email = $1 AND purpose = $2 AND used = false",
    [email, purpose]
  );

  await pool.query(
    "INSERT INTO otp_codes (email, code, purpose, expires_at) VALUES ($1, $2, $3, $4)",
    [email, code, purpose, expiresAt]
  );

  return code;
}

/**
 * Verifies a code and marks it used if valid. Returns true/false -
 * does not throw, so callers can give a clean error message.
 */
export async function verifyOtp(email, code, purpose) {
  const result = await pool.query(
    `SELECT id FROM otp_codes
     WHERE email = $1 AND code = $2 AND purpose = $3
       AND used = false AND expires_at > NOW()
     ORDER BY created_at DESC
     LIMIT 1`,
    [email, code, purpose]
  );

  if (result.rows.length === 0) return false;

  await pool.query("UPDATE otp_codes SET used = true WHERE id = $1", [result.rows[0].id]);
  return true;
}