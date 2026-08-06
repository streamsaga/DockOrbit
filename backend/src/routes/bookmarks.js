import express from "express";
import { pool } from "../db/database.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// All bookmark routes require login
router.use(requireAuth);

// GET /api/bookmarks - list the logged-in user's saved channels
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT channel_data FROM bookmarks WHERE user_id = $1 AND item_type = 'channel' ORDER BY created_at DESC",
      [req.user.id]
    );
    // channel_data is a JSONB column - pg automatically parses it back
    // into a plain JS object, no JSON.parse() needed.
    const channels = result.rows.map((r) => r.channel_data);
    res.json(channels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load bookmarks" });
  }
});

const MAX_CHANNEL_JSON_BYTES = 20_000; // a real channel object is a few KB; this leaves generous headroom
const MAX_BOOKMARKS_PER_USER = 500;

// POST /api/bookmarks  { channel: {...full scored channel object} }
router.post("/", async (req, res) => {
  const { channel } = req.body;
  if (!channel || !channel.id) {
    return res.status(400).json({ error: "channel object with an id is required" });
  }

  const serialized = JSON.stringify(channel);
  if (serialized.length > MAX_CHANNEL_JSON_BYTES) {
    return res.status(413).json({ error: "Channel data is too large to save" });
  }

  try {
    const countResult = await pool.query(
      "SELECT COUNT(*)::int AS count FROM bookmarks WHERE user_id = $1 AND item_type = 'channel'",
      [req.user.id]
    );
    if (countResult.rows[0].count >= MAX_BOOKMARKS_PER_USER) {
      return res.status(400).json({
        error: `You've reached the ${MAX_BOOKMARKS_PER_USER} saved channel limit. Remove some to save more.`,
      });
    }

    await pool.query(
      `INSERT INTO bookmarks (user_id, channel_id, channel_data, item_type)
       VALUES ($1, $2, $3, 'channel')
       ON CONFLICT (user_id, channel_id) DO NOTHING`,
      [req.user.id, channel.id, serialized]
    );
    res.status(201).json({ saved: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save channel" });
  }
});

// DELETE /api/bookmarks/:channelId
router.delete("/:channelId", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM bookmarks WHERE user_id = $1 AND channel_id = $2 AND item_type = 'channel'",
      [req.user.id, req.params.channelId]
    );
    res.json({ removed: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove bookmark" });
  }
});

export default router;