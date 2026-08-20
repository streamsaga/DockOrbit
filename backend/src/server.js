import "./loadEnv.js"; // MUST stay the first import - loads .env before anything else

import express from "express";
import cors from "cors";
import helmet from "helmet";

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import channelsRouter from "./routes/channels.js";
import authRouter from "./routes/auth.js";
import bookmarksRouter from "./routes/bookmarks.js";
import playlistBookmarksRouter from "./routes/playlistBookmarks.js";
import playlistsRouter from "./routes/playlists.js";
import suggestionsRouter from "./routes/suggestions.js";
import lookupRouter from "./routes/lookup.js";
import { ensureTables } from "./db/database.js";
import { verifyEmailConfig } from "./services/emailService.js";
import { generalApiLimiter } from "./middleware/rateLimiters.js";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");

// If deployed behind a reverse proxy (Render, Railway, Heroku, nginx,
// etc.), this is required for express-rate-limit and req.ip to see the
// REAL client IP instead of the proxy's IP for every request. Leave
// unset for plain local development.
if (process.env.TRUST_PROXY !== "false") {
  app.set("trust proxy", 1);
}

// Sets a battery of standard security-related HTTP response headers
// (X-Content-Type-Options, X-Frame-Options, etc.) with sane defaults.
app.use(helmet({ contentSecurityPolicy: false }));

// CORS_ORIGIN restricts which frontend domain(s) may call this API.
// Falls back to allowing all origins (fine for local development) if
// not set, with a clear warning so it isn't accidentally left open in
// production. Supports a comma-separated list for multiple domains.
const corsOrigin = process.env.CORS_ORIGIN;
if (!corsOrigin) {
  console.warn(
    "[security] CORS_ORIGIN is not set - allowing requests from ANY origin. " +
      "Fine for local development, but set this to your real frontend URL before deploying."
  );
}
app.use(
  cors({
    origin: corsOrigin ? corsOrigin.split(",").map((s) => s.trim()) : true,
  })
);

app.use(express.json({ limit: "1.5mb" })); // raised from 100kb to fit a resized profile-photo upload; still capped against abuse

// Broad safety net on every /api route - protects your YouTube API
// daily quota and general server capacity from being drained by abuse.
// Stricter, endpoint-specific limiters (auth, AI analysis) are applied
// inside their own route files on top of this.
app.use("/api", generalApiLimiter);

app.use("/api", channelsRouter);
app.use("/api/auth", authRouter);
app.use("/api/bookmarks", bookmarksRouter);
app.use("/api/playlist-bookmarks", playlistBookmarksRouter);
app.use("/api/playlists", playlistsRouter);
app.use("/api/suggestions", suggestionsRouter);
app.use("/api/lookup", lookupRouter);

// Serve static frontend build if present (for single-service Render/PaaS deploys)
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("YouTube Discovery API is running. Try /api/categories or /api/channels?category=cooking");
  });
}

async function start() {
  try {
    await ensureTables();
    console.log("Connected to database, tables ready.");
    verifyEmailConfig(); // logs a clear pass/fail message, doesn't block startup
  } catch (err) {
    console.error("Could not connect to the database. Check DATABASE_URL in your .env file.");
    console.error(err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Mock data mode: ${process.env.USE_MOCK_DATA !== "false"}`);
  });
}

start();