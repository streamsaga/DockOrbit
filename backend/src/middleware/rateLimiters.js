// rateLimiters.js
//
// Three tiers of rate limiting, from loosest to strictest:
//
// 1. generalApiLimiter - a broad safety net on all /api routes, mainly
//    to protect your YouTube API quota from being drained by a bot
//    hammering your server (YouTube quota is shared across ALL your
//    users - one abusive client can lock everyone out for the day).
//
// 2. authLimiter - tighter limit on login/signup/password-reset,
//    since these are classic brute-force/spam targets. Deliberately
//    counts ALL attempts (not just failed ones) - counting only
//    failures is what most tutorials do, but it means a script can
//    still hammer your SMTP provider with OTP emails as long as each
//    attempt "succeeds" in triggering an email send.
//
// 3. analyzeLimiter - the strictest, on /api/playlists/analyze, since
//    each request costs you real money (one OpenAI API call). Without
//    this, anyone could run your bill up arbitrarily just by clicking
//    "Analyze" in a loop or scripting requests directly.

import rateLimit from "express-rate-limit";

export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down and try again shortly." },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 auth attempts per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Please wait a few minutes before trying again." },
});

export const analyzeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 AI analyses per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "You've hit the hourly limit for AI analysis. Please try again later.",
  },
});