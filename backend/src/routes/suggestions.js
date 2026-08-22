import express from "express";
import { getSearchSuggestions } from "../services/suggestionsService.js";
import { searchMockChannels, searchMockPlaylists } from "../data/mockChannels.js";

const router = express.Router();

// GET /api/suggestions?q=react
// Response shape: { suggestions: Array<{ id, name, type, thumbnail?, category? }> }
router.get("/", async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) {
    return res.json({ suggestions: [] });
  }

  const queryStr = q.trim();

  try {
    const rawSuggestions = await getSearchSuggestions(queryStr);
    const matchedChannels = searchMockChannels(queryStr);
    const matchedPlaylists = searchMockPlaylists(queryStr);

    const suggestions = [];

    // Add matching channels
    matchedChannels.slice(0, 3).forEach((ch) => {
      suggestions.push({
        id: ch.id,
        name: ch.name,
        type: "channel",
        thumbnail: ch.thumbnail,
        category: ch.category,
        url: `/channel/${ch.id}`
      });
    });

    // Add matching playlists
    matchedPlaylists.slice(0, 2).forEach((pl) => {
      suggestions.push({
        id: pl.id,
        name: pl.title,
        type: "playlist",
        thumbnail: pl.thumbnail,
        category: pl.category,
        url: `/playlist/${pl.id}`
      });
    });

    // Add text topic autocomplete suggestions
    rawSuggestions.slice(0, 4).forEach((term) => {
      if (!suggestions.some((s) => s.name.toLowerCase() === term.toLowerCase())) {
        suggestions.push({
          id: term,
          name: term,
          type: "topic",
          url: `/search?q=${encodeURIComponent(term)}`
        });
      }
    });

    res.json({ suggestions });
  } catch (err) {
    console.error("Suggestions failed:", err.message);
    res.json({ suggestions: [] });
  }
});

export default router;