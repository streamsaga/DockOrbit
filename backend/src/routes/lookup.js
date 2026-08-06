// lookup.js
//
// Provides GET /api/lookup?url=<youtube_url>
// Accepts any YouTube channel or playlist URL, fetches its data from
// the YouTube Data API, scores it using the existing scoring engine,
// and returns the full result card data.
//
// Supports channel formats:
//   - youtube.com/channel/UC...
//   - youtube.com/@handle
//   - youtube.com/c/CustomName
// Supports playlist format:
//   - youtube.com/playlist?list=PL...

import express from "express";
import { getApiKey, fetchJson, BASE_URL } from "../services/youtubeService.js";
import { scoreChannel } from "../services/scoringEngine.js";
import { searchMockChannels } from "../data/mockChannels.js";

const router = express.Router();

function useMockData() {
  return process.env.USE_MOCK_DATA !== "false";
}

// ── URL parsing helpers ──────────────────────────────────────────────

/**
 * Extracts a channel ID, handle, or playlist ID from a YouTube URL.
 * Returns { type: "channel"|"playlist", id: string, subtype: "id"|"handle"|"custom" }
 * or null if the URL doesn't match any known pattern.
 */
function parseYouTubeUrl(raw) {
  let url;
  try {
    // Allow users to paste bare URLs without protocol
    if (!raw.startsWith("http")) raw = "https://" + raw;
    url = new URL(raw);
  } catch {
    return null;
  }

  const host = url.hostname.replace("www.", "").replace("m.", "");
  if (host !== "youtube.com" && host !== "youtu.be") return null;

  const path = url.pathname;

  // Playlist: youtube.com/playlist?list=PLxxxxxx
  const listParam = url.searchParams.get("list");
  if (listParam && (path === "/playlist" || path.startsWith("/playlist"))) {
    return { type: "playlist", id: listParam, subtype: "id" };
  }

  // Channel by ID: youtube.com/channel/UCxxxxx
  const channelIdMatch = path.match(/^\/channel\/(UC[A-Za-z0-9_-]+)/);
  if (channelIdMatch) {
    return { type: "channel", id: channelIdMatch[1], subtype: "id" };
  }

  // Channel by handle: youtube.com/@handle
  const handleMatch = path.match(/^\/@([A-Za-z0-9._-]+)/);
  if (handleMatch) {
    return { type: "channel", id: handleMatch[1], subtype: "handle" };
  }

  // Channel by custom URL: youtube.com/c/ChannelName
  const customMatch = path.match(/^\/c\/([A-Za-z0-9._-]+)/);
  if (customMatch) {
    return { type: "channel", id: customMatch[1], subtype: "custom" };
  }

  // Legacy /user/ URLs
  const userMatch = path.match(/^\/user\/([A-Za-z0-9._-]+)/);
  if (userMatch) {
    return { type: "channel", id: userMatch[1], subtype: "custom" };
  }

  return null;
}

// ── YouTube API helpers (thin wrappers, same logic as youtubeService) ──

async function resolveChannelId(parsed) {
  if (parsed.subtype === "id") return parsed.id;

  // For handles and custom URLs, use search to find the channel ID
  const query = parsed.subtype === "handle" ? `@${parsed.id}` : parsed.id;
  const url = `${BASE_URL}/search?part=snippet&type=channel&q=${encodeURIComponent(
    query
  )}&maxResults=1&key=${getApiKey()}`;
  const data = await fetchJson(url);

  if (!data.items || data.items.length === 0) {
    throw new Error("Channel not found. Please check the URL and try again.");
  }

  return data.items[0].snippet.channelId;
}

async function fetchChannelById(channelId) {
  const detailUrl = `${BASE_URL}/channels?part=snippet,statistics,contentDetails&id=${channelId}&key=${getApiKey()}`;
  const detailData = await fetchJson(detailUrl);

  if (!detailData.items || detailData.items.length === 0) {
    throw new Error("Channel not found. The ID may be invalid.");
  }

  const ch = detailData.items[0];
  const uploadsPlaylistId = ch.contentDetails?.relatedPlaylists?.uploads;

  let videos = [];
  let publishDates = [];

  if (uploadsPlaylistId) {
    const playlistUrl = `${BASE_URL}/playlistItems?part=contentDetails,snippet&playlistId=${uploadsPlaylistId}&maxResults=15&key=${getApiKey()}`;
    const playlistData = await fetchJson(playlistUrl);

    const videoIds = playlistData.items.map((item) => item.contentDetails.videoId);
    publishDates = playlistData.items.map(
      (item) => new Date(item.contentDetails.videoPublishedAt || item.snippet.publishedAt)
    );

    if (videoIds.length > 0) {
      const statsUrl = `${BASE_URL}/videos?part=statistics&id=${videoIds.join(",")}&key=${getApiKey()}`;
      const statsData = await fetchJson(statsUrl);
      videos = statsData.items;
    }
  }

  const viewCounts = videos.map((v) => Number(v.statistics.viewCount) || 0);
  const likeCounts = videos.map((v) => Number(v.statistics.likeCount) || 0);
  const commentCounts = videos.map((v) => Number(v.statistics.commentCount) || 0);
  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  const cutoff30 = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const cutoff90 = Date.now() - 90 * 24 * 60 * 60 * 1000;

  const rawChannel = {
    id: ch.id,
    name: ch.snippet.title,
    thumbnail: ch.snippet.thumbnails?.medium?.url || ch.snippet.thumbnails?.default?.url,
    description: ch.snippet.description?.slice(0, 200) || "",
    subscribers: Number(ch.statistics.subscriberCount) || 0,
    totalViews: Number(ch.statistics.viewCount) || 0,
    videoCount: Number(ch.statistics.videoCount) || 0,
    avgViewsPerVideo: Math.round(avg(viewCounts)),
    avgLikes: Math.round(avg(likeCounts)),
    avgComments: Math.round(avg(commentCounts)),
    channelCreatedYear: new Date(ch.snippet.publishedAt).getFullYear(),
    uploadsLast30Days: publishDates.filter((d) => d.getTime() >= cutoff30).length,
    uploadsLast90Days: publishDates.filter((d) => d.getTime() >= cutoff90).length,
    verified: false,
    channelUrl: `https://www.youtube.com/channel/${ch.id}`,
    country: ch.snippet.country || null,
    language: ch.snippet.defaultLanguage || null,
  };

  return scoreChannel(rawChannel);
}

// ── Playlist lookup ──────────────────────────────────────────────────

function parseISODuration(iso) {
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || "");
  if (!match) return 0;
  const [, h, m, s] = match;
  return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
}

const COMPLETENESS_KEYWORDS = [
  "full course", "complete course", "complete guide", "from scratch",
  "beginner to advanced", "zero to hero", "crash course", "masterclass",
  "tutorial series",
];

const PL_WEIGHTS = { coverage: 0.3, engagement: 0.25, recency: 0.15, completeness: 0.15, popularity: 0.15 };

const LANGUAGE_LABELS = {
  en: "English", hi: "Hindi", es: "Spanish", pt: "Portuguese",
  fr: "French", de: "German", ja: "Japanese", ko: "Korean",
  id: "Indonesian", ar: "Arabic", ru: "Russian", bn: "Bengali",
};

function detectLanguageCode(title, description) {
  const text = `${title} ${description}`;
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  if (/[\u0980-\u09FF]/.test(text)) return "bn";
  if (/[\u0600-\u06FF]/.test(text)) return "ar";
  if (/[\u0400-\u04FF]/.test(text)) return "ru";
  if (/[\u3040-\u30FF\u4E00-\u9FFF]/.test(text)) return "ja";
  if (/[\uAC00-\uD7A3]/.test(text)) return "ko";
  const lower = text.toLowerCase();
  if (/(español|curso completo|en español)/.test(lower)) return "es";
  if (/(português|em português|curso completo)/.test(lower)) return "pt";
  if (/(français|en français|cours complet)/.test(lower)) return "fr";
  if (/(deutsch|auf deutsch)/.test(lower)) return "de";
  if (/(bahasa indonesia|belajar)/.test(lower)) return "id";
  return "en";
}

async function fetchPlaylistById(playlistId) {
  // Get playlist details
  const detailUrl = `${BASE_URL}/playlists?part=snippet,contentDetails&id=${playlistId}&key=${getApiKey()}`;
  const detailData = await fetchJson(detailUrl);

  if (!detailData.items || detailData.items.length === 0) {
    throw new Error("Playlist not found. Please check the URL and try again.");
  }

  const pl = detailData.items[0];
  const itemCount = pl.contentDetails?.itemCount || 0;

  // Sample videos for scoring
  const itemsUrl = `${BASE_URL}/playlistItems?part=contentDetails,snippet&playlistId=${playlistId}&maxResults=20&key=${getApiKey()}`;
  const itemsData = await fetchJson(itemsUrl);

  const videoIds = itemsData.items.map((item) => item.contentDetails?.videoId).filter(Boolean);
  const publishDates = itemsData.items
    .map((item) => item.contentDetails?.videoPublishedAt)
    .filter(Boolean)
    .map((d) => new Date(d));
  const lastPublishedAt = publishDates.length
    ? new Date(Math.max(...publishDates.map((d) => d.getTime())))
    : null;

  let videos = [];
  if (videoIds.length > 0) {
    const statsUrl = `${BASE_URL}/videos?part=statistics,contentDetails&id=${videoIds.join(",")}&key=${getApiKey()}`;
    const statsData = await fetchJson(statsUrl);
    videos = statsData.items;
  }

  const totalSampledViews = videos.reduce(
    (sum, v) => sum + (Number(v.statistics?.viewCount) || 0), 0
  );
  const estimatedTotalViews = videos.length > 0
    ? Math.round((totalSampledViews / videos.length) * itemCount) : 0;

  const totalSampledSeconds = videos.reduce(
    (sum, v) => sum + parseISODuration(v.contentDetails?.duration), 0
  );
  const avgSecondsPerVideo = videos.length ? totalSampledSeconds / videos.length : 0;
  const estimatedTotalSeconds = Math.round(avgSecondsPerVideo * itemCount);

  const title = pl.snippet.title || "";
  const description = pl.snippet.description || "";
  const hasCompletenessLang = COMPLETENESS_KEYWORDS.some((kw) =>
    `${title} ${description}`.toLowerCase().includes(kw)
  );

  // Score sub-components
  const queryWords = title.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const coverage = Math.round(Math.min(
    ((queryWords.length ? queryWords.filter((w) => title.toLowerCase().includes(w)).length / queryWords.length : 0) * 80) +
    (hasCompletenessLang ? 20 : 0), 100
  ));

  const engRates = videos.map((v) => {
    const views = Number(v.statistics?.viewCount) || 0;
    const likes = Number(v.statistics?.likeCount) || 0;
    if (!views) return 0;
    return likes / views;
  });
  const avgEngRate = engRates.length ? engRates.reduce((a, b) => a + b, 0) / engRates.length : 0;
  const engagement = Math.round(Math.min(avgEngRate / 0.05, 1) * 100);

  let recency = 30;
  if (lastPublishedAt) {
    const daysSince = (Date.now() - lastPublishedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince <= 180) recency = 100;
    else if (daysSince <= 365) recency = 75;
    else if (daysSince <= 730) recency = 50;
    else if (daysSince <= 1460) recency = 25;
    else recency = 10;
  }

  let completeness = Math.round(Math.min((itemCount / 20) * 100, 100));
  if (hasCompletenessLang) completeness = Math.min(completeness + 10, 100);

  let popularity = 0;
  if (estimatedTotalViews > 0) {
    popularity = Math.round(Math.min(Math.max((Math.log10(estimatedTotalViews) / 8) * 100, 0), 100));
  }

  const score = Math.round(
    coverage * PL_WEIGHTS.coverage +
    engagement * PL_WEIGHTS.engagement +
    recency * PL_WEIGHTS.recency +
    completeness * PL_WEIGHTS.completeness +
    popularity * PL_WEIGHTS.popularity
  );

  const langCode = detectLanguageCode(title, description);

  // Difficulty detection
  const text = `${title} ${description}`.toLowerCase();
  let difficulty = "All levels";
  if (/(advanced|expert|master)/.test(text)) difficulty = "Advanced";
  else if (/(intermediate)/.test(text)) difficulty = "Intermediate";
  else if (/(beginner|introduction|basics|crash course|from scratch)/.test(text)) difficulty = "Beginner";

  return {
    id: pl.id,
    title,
    description: description.slice(0, 220),
    channelTitle: pl.snippet.channelTitle,
    thumbnail: pl.snippet.thumbnails?.medium?.url || pl.snippet.thumbnails?.default?.url || "",
    videoCount: itemCount,
    estimatedTotalViews,
    estimatedTotalSeconds,
    lastUpdated: lastPublishedAt ? lastPublishedAt.toISOString() : null,
    publishedAt: pl.snippet.publishedAt,
    difficulty,
    language: LANGUAGE_LABELS[langCode] || "English",
    languageCode: langCode,
    playlistUrl: `https://www.youtube.com/playlist?list=${pl.id}`,
    score,
    scoreBreakdown: { coverage, engagement, recency, completeness, popularity },
  };
}

// ── Route handler ────────────────────────────────────────────────────

router.get("/", async (req, res) => {
  const { url } = req.query;

  if (!url || !url.trim()) {
    return res.status(400).json({ error: "url query param is required" });
  }

  const parsed = parseYouTubeUrl(url.trim());
  if (!parsed) {
    return res.status(400).json({
      error: "Invalid YouTube URL. Please paste a YouTube channel or playlist link.",
    });
  }

  try {
    if (parsed.type === "channel") {
      if (useMockData()) {
        // In mock mode, search by the handle/custom name
        const query = parsed.subtype === "id" ? parsed.id : parsed.id;
        const results = searchMockChannels(query);
        if (results.length > 0) {
          const scored = scoreChannel(results[0]);
          return res.json({ type: "channel", data: scored });
        }
        // Fallback: return the first mock channel with the name set
        const allMock = searchMockChannels("");
        if (allMock.length > 0) {
          const scored = scoreChannel(allMock[0]);
          return res.json({ type: "channel", data: scored });
        }
        return res.status(404).json({ error: "Channel not found in mock data." });
      }

      const channelId = await resolveChannelId(parsed);
      const channelData = await fetchChannelById(channelId);
      return res.json({ type: "channel", data: channelData });
    }

    if (parsed.type === "playlist") {
      if (useMockData()) {
        return res.status(400).json({
          error: "Playlist lookup requires a YouTube API key. Mock data mode is active.",
        });
      }

      const playlistData = await fetchPlaylistById(parsed.id);
      return res.json({ type: "playlist", data: playlistData });
    }

    return res.status(400).json({ error: "Unsupported URL type." });
  } catch (err) {
    console.error("Lookup error:", err);
    res.status(500).json({ error: err.message || "Lookup failed. Please try again." });
  }
});

export default router;
