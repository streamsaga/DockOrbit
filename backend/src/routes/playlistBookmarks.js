import express from "express";
import { pool } from "../db/database.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);

const MAX_PLAYLIST_JSON_BYTES = 20_000;
const MAX_BOOKMARKS_PER_USER = 500;

// GET /api/playlist-bookmarks - list the logged-in user's saved playlists
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT channel_data FROM bookmarks WHERE user_id = $1 AND item_type = 'playlist' ORDER BY created_at DESC",
      [req.user.id]
    );
    const playlists = result.rows.map((r) => r.channel_data);
    res.json(playlists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load saved playlists" });
  }
});

// POST /api/playlist-bookmarks  { playlist: {...full scored playlist object} }
router.post("/", async (req, res) => {
  const { playlist } = req.body;
  if (!playlist || !playlist.id) {
    return res.status(400).json({ error: "playlist object with an id is required" });
  }

  const serialized = JSON.stringify(playlist);
  if (serialized.length > MAX_PLAYLIST_JSON_BYTES) {
    return res.status(413).json({ error: "Playlist data is too large to save" });
  }

  try {
    const countResult = await pool.query(
      "SELECT COUNT(*)::int AS count FROM bookmarks WHERE user_id = $1 AND item_type = 'playlist'",
      [req.user.id]
    );
    if (countResult.rows[0].count >= MAX_BOOKMARKS_PER_USER) {
      return res.status(400).json({
        error: `You've reached the ${MAX_BOOKMARKS_PER_USER} saved playlist limit. Remove some to save more.`,
      });
    }

    await pool.query(
      `INSERT INTO bookmarks (user_id, channel_id, channel_data, item_type)
       VALUES ($1, $2, $3::jsonb, 'playlist')
       ON CONFLICT (user_id, channel_id) DO NOTHING`,
      [req.user.id, playlist.id, serialized]
    );
    res.status(201).json({ saved: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save playlist" });
  }
});

// DELETE /api/playlist-bookmarks/:playlistId
router.delete("/:playlistId", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM bookmarks WHERE user_id = $1 AND channel_id = $2 AND item_type = 'playlist'",
      [req.user.id, req.params.playlistId]
    );
    res.json({ removed: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove saved playlist" });
  }
});

export default router;