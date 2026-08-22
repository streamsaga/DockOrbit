import express from "express";
import { mockChannels, getMockChannelsForCategory, categories, searchMockChannels } from "../data/mockChannels.js";
import { scoreChannels } from "../services/scoringEngine.js";
import { fetchChannelsForCategory, fetchChannelsForQuery } from "../services/youtubeService.js";

const router = express.Router();

function useMockData() {
  if (process.env.USE_MOCK_DATA === "true") return true;
  if (process.env.USE_MOCK_DATA === "false") return false;
  return !process.env.YOUTUBE_API_KEY;
}

function applySort(scored, sort) {
  if (sort === "subscribers") return [...scored].sort((a, b) => b.subscribers - a.subscribers);
  if (sort === "recent") return [...scored].sort((a, b) => b.uploadsLast30Days - a.uploadsLast30Days);
  return scored;
}

// GET /api/categories
router.get("/categories", (req, res) => {
  res.json(categories);
});

// GET /api/channels?category=tech-reviews&sort=trustScore&pageToken=...&country=US&language=en
// Response shape: { channels: [...], nextPageToken: string|null }
router.get("/channels", async (req, res) => {
  const { category, sort = "trustScore", pageToken = "", country = "", language = "" } = req.query;

  if (!category) {
    return res.status(400).json({ error: "category query param is required" });
  }

  try {
    let channels;
    let nextPageToken = null;

    if (useMockData()) {
      channels = getMockChannelsForCategory(category);
      nextPageToken = null;
    } else {
      try {
        const result = await fetchChannelsForCategory(category, pageToken, country, language);
        channels = result.channels;
        nextPageToken = result.nextPageToken;
      } catch (apiErr) {
        console.warn(`YouTube API failed for category "${category}", falling back to mock data:`, apiErr.message);
        channels = getMockChannelsForCategory(category);
        nextPageToken = null;
      }

      if (!channels || channels.length === 0) {
        channels = getMockChannelsForCategory(category);
      }
    }

    const scored = applySort(scoreChannels(channels), sort);
    res.json({ channels: scored, nextPageToken });
  } catch (err) {
    console.error(err);
    // Fallback so the user always gets a clean response
    const fallbackChannels = getMockChannelsForCategory(category);
    const scored = applySort(scoreChannels(fallbackChannels), sort);
    res.json({ channels: scored, nextPageToken: null });
  }
});

// GET /api/search?q=cooking&sort=trustScore&pageToken=...&country=US&language=en
router.get("/search", async (req, res) => {
  const { q, sort = "trustScore", pageToken = "", country = "", language = "" } = req.query;

  if (!q || !q.trim()) {
    return res.status(400).json({ error: "q query param is required" });
  }

  try {
    let channels;
    let nextPageToken = null;

    if (useMockData()) {
      channels = searchMockChannels(q);
      nextPageToken = null;
    } else {
      try {
        const result = await fetchChannelsForQuery(q, undefined, pageToken, country, language);
        channels = result.channels;
        nextPageToken = result.nextPageToken;
      } catch (apiErr) {
        console.warn(`YouTube API search failed for query "${q}", falling back to mock search:`, apiErr.message);
        channels = searchMockChannels(q);
        nextPageToken = null;
      }
    }

    if (!channels || channels.length === 0) {
      channels = searchMockChannels(q);
    }

    const scored = applySort(scoreChannels(channels), sort);
    res.json({ channels: scored, nextPageToken });
  } catch (err) {
    console.error(err);
    const fallback = searchMockChannels(q);
    const scored = applySort(scoreChannels(fallback), sort);
    res.json({ channels: scored, nextPageToken: null });
  }
});

export default router;