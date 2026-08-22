// database.js
//
// Connects to a real, cloud-hosted PostgreSQL database (e.g. Neon,
// Supabase, or Railway) using the connection string in DATABASE_URL.
// Replaces the earlier local SQLite file so your data lives in a
// proper database server instead of a single file on your machine.

import pg from "pg";

const { Pool } = pg;

const isLocal =
  !process.env.DATABASE_URL ||
  process.env.DATABASE_URL.includes("localhost") ||
  process.env.DATABASE_URL.includes("127.0.0.1");

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

// Creates the tables if they don't already exist. Safe to run every
// time the server starts - it won't touch existing data.
export async function ensureTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,        -- nullable: Google-only accounts have no password
      google_id TEXT UNIQUE,     -- nullable: only set for accounts that used Google sign-in
      email_verified BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Migration-safe: adds the column if this table already existed from
  // before this feature, without touching existing data. Postgres
  // supports IF NOT EXISTS on ADD COLUMN directly, no try/catch needed.
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false;
  `);

  // Added for the 3-step signup wizard (Identity / Presence / Network):
  // username (unique handle), avatar_data (a resized profile photo
  // stored as a base64 data URL - no cloud storage needed for a
  // small image), and favorite_category (used to personalize the
  // default category shown on the Channel Discovery page).
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
  `);
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_data TEXT;
  `);
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS favorite_category TEXT;
  `);
  await pool.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 1;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      channel_id TEXT NOT NULL,
      channel_data JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, channel_id)
    );
  `);

  // Reused for playlist bookmarks too (Playlist Finder's "Saved"
  // feature) - item_type distinguishes a channel row from a playlist
  // row sharing the same table/columns. Existing rows default to
  // 'channel' so nothing about the current channel-bookmarks feature
  // changes.
  await pool.query(`
    ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS item_type TEXT NOT NULL DEFAULT 'channel';
  `);

  // One-time codes used for both signup email verification and
  // password reset. `purpose` distinguishes the two so a signup code
  // can't be replayed to reset a password or vice versa.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS otp_codes (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      purpose TEXT NOT NULL CHECK (purpose IN ('signup', 'reset')),
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}