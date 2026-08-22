// authService.js
//
// Handles password hashing (bcrypt) and JWT token creation/verification.
// Passwords are NEVER stored or compared in plain text - only their
// bcrypt hash is stored, and bcrypt.compare() checks a login attempt
// against that hash without ever reversing it.

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function verifyPassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

export function generateToken(user) {
  const secret = process.env.JWT_SECRET;
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      tokenVersion: user.token_version || user.tokenVersion || 1,
    },
    secret,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  return jwt.verify(token, secret); // throws if invalid/expired
}