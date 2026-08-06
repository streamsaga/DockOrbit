import express from "express";
import { findPlaylists, getPlaylistVideoTitles, getTopComments } from "../services/playlistService.js";
import { analyzePlaylist } from "../services/aiAnalysisService.js";
import { analyzeLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// GET /api/playlists/search?q=binary+trees&pageToken=...&language=en
// Response shape: { playlists: [...], nextPageToken: string|null }
router.get("/search", async (req, res) => {
  const { q, pageToken = "", language = "" } = req.query;

  if (!q || !q.trim()) {
    return res.status(400).json({ error: "q query param is required" });
  }

  try {
    const result = await findPlaylists(q.trim(), pageToken, language);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Playlist search failed", details: err.message });
  }
});

// GET /api/playlists/analyze?playlistId=...&topic=...&title=...&channel=...
// Runs the AI coverage + summary + sentiment analysis for one playlist.
// title/channel are passed from the frontend (already fetched during
// search) to avoid an extra YouTube API round-trip just for display text.
router.get("/analyze", analyzeLimiter, async (req, res) => {
  const { playlistId, topic, title = "", channel = "" } = req.query;

  if (!playlistId || !topic) {
    return res.status(400).json({ error: "playlistId and topic query params are required" });
  }

  try {
    const videoEntries = await getPlaylistVideoTitles(playlistId, 40);
    const videoTitles = videoEntries.map((v) => v.title).filter(Boolean);
    const videoIds = videoEntries.map((v) => v.videoId).filter(Boolean);

    const comments = await getTopComments(videoIds, 15, 5);

    const analysis = await analyzePlaylist({
      cacheKey: `analysis:${playlistId}:${topic.toLowerCase()}`,
      topic,
      playlistTitle: title,
      channelTitle: channel,
      videoTitles,
      comments,
    });

    res.json(analysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Playlist analysis failed", details: err.message });
  }
});

export default router;