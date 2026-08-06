// authMiddleware.js
//
// Protects routes that require a logged-in user. Expects the frontend
// to send the JWT in an "Authorization: Bearer <token>" header.
// On success, attaches the decoded { id, email } to req.user.

import { verifyToken } from "../services/authService.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const token = header.slice("Bearer ".length);

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session, please log in again" });
  }
}