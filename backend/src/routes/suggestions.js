import express from "express";
import { getSearchSuggestions } from "../services/suggestionsService.js";

const router = express.Router();

// GET /api/suggestions?q=machine lea
// Response shape: { suggestions: string[] }
router.get("/", async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) {
    return res.json({ suggestions: [] });
  }

  try {
    const suggestions = await getSearchSuggestions(q);
    res.json({ suggestions });
  } catch (err) {
    // Suggestions are a nice-to-have, not critical - fail quietly with
    // an empty list rather than surfacing an error to the user.
    console.error("Suggestions failed:", err.message);
    res.json({ suggestions: [] });
  }
});

export default router;