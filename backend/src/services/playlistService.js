// playlistService.js
//
// Powers the "Playlist Finder" feature: given any study topic, finds
// YouTube playlists and ranks them with an explainable, non-AI
// heuristic score. This is Part 1 of the feature - later parts add an
// AI layer (via the Anthropic API) on top of this for coverage
// analysis, summaries, and comment sentiment. This file works fully
// standalone without any AI key.
//
// Scoring is a weighted combination of:
//   - coverageSignal   how well the title/description matches the
//                       topic and its "completeness" language
//   - engagement        avg likes+comments per view across sampled videos
//   - recency           how recently the playlist was last updated
//   - completeness       video count relative to what a real course needs
//   - popularity         total estimated views, log-scaled
//
// All five combine into a single 0-100 "AI Recommendation Score" shown
// on the playlist card - "AI" in the UI label refers to the eventual
// AI layer (Part 2); this scoring itself is deterministic and free.

import NodeCache from "node-cache";
import { getApiKey, fetchJson, BASE_URL } from "./youtubeService.js";

const cache = new NodeCache({ stdTTL: 3600 });

const COMPLETENESS_KEYWORDS = [
  "full course",
  "complete course",
  "complete guide",
  "from scratch",
  "beginner to advanced",
  "zero to hero",
  "crash course",
  "masterclass",
  "tutorial series",
];

const WEIGHTS = {
  coverage: 0.3,
  engagement: 0.25,
  recency: 0.15,
  completeness: 0.15,
  popularity: 0.15,
};

async function searchPlaylists(query, maxResults = 10, pageToken = "", language = "") {
  const pageParam = pageToken ? `&pageToken=${pageToken}` : "";
  const langParam = language ? `&relevanceLanguage=${language}` : "";
  const url = `${BASE_URL}/search?part=snippet&type=playlist&q=${encodeURIComponent(
    query
  )}&maxResults=${maxResults}${pageParam}${langParam}&key=${getApiKey()}`;
  const data = await fetchJson(url);
  return {
    playlistIds: data.items.map((item) => item.id.playlistId),
    nextPageToken: data.nextPageToken || null,
  };
}

async function getPlaylistDetails(playlistIds) {
  const url = `${BASE_URL}/playlists?part=snippet,contentDetails&id=${playlistIds.join(
    ","
  )}&key=${getApiKey()}`;
  const data = await fetchJson(url);
  return data.items;
}

// Samples up to `maxResults` videos from a playlist to estimate
// engagement/views/duration without pulling every single video
// (keeps quota usage and response time reasonable for long courses).
async function samplePlaylistVideos(playlistId, maxResults = 20) {
  const itemsUrl = `${BASE_URL}/playlistItems?part=contentDetails,snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${getApiKey()}`;
  const itemsData = await fetchJson(itemsUrl);

  const videoIds = itemsData.items
    .map((item) => item.contentDetails?.videoId)
    .filter(Boolean);

  if (videoIds.length === 0) {
    return { videos: [], lastPublishedAt: null };
  }

  const publishDates = itemsData.items
    .map((item) => item.contentDetails?.videoPublishedAt)
    .filter(Boolean)
    .map((d) => new Date(d));
  const lastPublishedAt = publishDates.length
    ? new Date(Math.max(...publishDates.map((d) => d.getTime())))
    : null;

  const statsUrl = `${BASE_URL}/videos?part=statistics,contentDetails&id=${videoIds.join(
    ","
  )}&key=${getApiKey()}`;
  const statsData = await fetchJson(statsUrl);

  return { videos: statsData.items, lastPublishedAt };
}

function parseISODuration(iso) {
  // Parses "PT1H2M10S" style durations into total seconds
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || "");
  if (!match) return 0;
  const [, h, m, s] = match;
  return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
}

function scoreCoverage(title, description, query) {
  const text = `${title} ${description}`.toLowerCase();
  const queryWords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);

  const matchedWords = queryWords.filter((w) => text.includes(w));
  const matchRatio = queryWords.length ? matchedWords.length / queryWords.length : 0;

  const hasCompletenessLanguage = COMPLETENESS_KEYWORDS.some((kw) => text.includes(kw));

  let score = matchRatio * 80;
  if (hasCompletenessLanguage) score += 20;
  return Math.round(Math.min(score, 100));
}

function scoreEngagement(videos) {
  if (videos.length === 0) return 0;
  const rates = videos.map((v) => {
    const views = Number(v.statistics?.viewCount) || 0;
    const likes = Number(v.statistics?.likeCount) || 0;
    if (!views) return 0;
    return likes / views;
  });
  const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
  const ceiling = 0.05; // 5% like rate is excellent for educational content
  return Math.round(Math.min(avgRate / ceiling, 1) * 100);
}

function scoreRecency(lastPublishedAt) {
  if (!lastPublishedAt) return 30; // unknown - assume middling
  const daysSince = (Date.now() - lastPublishedAt.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince <= 180) return 100; // updated within 6 months
  if (daysSince <= 365) return 75;
  if (daysSince <= 730) return 50;
  if (daysSince <= 1460) return 25; // within 4 years
  return 10;
}

function scoreCompleteness(itemCount, hasCompletenessLanguage) {
  // A real course-length playlist is usually 10+ videos. Very short
  // playlists (1-3 videos) are rarely a full course.
  let score = Math.min((itemCount / 20) * 100, 100);
  if (hasCompletenessLanguage) score = Math.min(score + 10, 100);
  return Math.round(score);
}

function scorePopularity(totalViews) {
  if (totalViews <= 0) return 0;
  // Log scale so a 50M-view playlist doesn't completely dwarf a
  // genuinely great 500K-view one - both can score well.
  const score = (Math.log10(totalViews) / 8) * 100; // log10(100,000,000) = 8
  return Math.round(Math.min(Math.max(score, 0), 100));
}

function difficultyFromText(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  if (/(advanced|expert|master)/.test(text)) return "Advanced";
  if (/(intermediate)/.test(text)) return "Intermediate";
  if (/(beginner|introduction|basics|crash course|from scratch)/.test(text)) return "Beginner";
  return "All levels";
}

// Maps each detected language code to a human-readable label for
// display on the card (e.g. "hi" -> "Hindi").
const LANGUAGE_LABELS = {
  en: "English",
  hi: "Hindi",
  es: "Spanish",
  pt: "Portuguese",
  fr: "French",
  de: "German",
  ja: "Japanese",
  ko: "Korean",
  id: "Indonesian",
  ar: "Arabic",
  ru: "Russian",
  bn: "Bengali",
};

// Script-based detection is highly reliable for languages with a
// distinct writing system (Devanagari, Bengali, Arabic, Cyrillic,
// Japanese kana/kanji, Hangul) - if ANY characters in that Unicode
// range appear, the text is almost certainly in that language.
// Latin-script languages (Spanish, French, German, etc.) can't be
// detected this way, so those fall back to keyword hints, which are
// weaker but still useful.
function detectLanguageCode(title, description) {
  const text = `${title} ${description}`;

  if (/[\u0900-\u097F]/.test(text)) return "hi"; // Devanagari (Hindi)
  if (/[\u0980-\u09FF]/.test(text)) return "bn"; // Bengali
  if (/[\u0600-\u06FF]/.test(text)) return "ar"; // Arabic
  if (/[\u0400-\u04FF]/.test(text)) return "ru"; // Cyrillic (Russian)
  if (/[\u3040-\u30FF\u4E00-\u9FFF]/.test(text)) return "ja"; // Hiragana/Katakana/Kanji
  if (/[\uAC00-\uD7A3]/.test(text)) return "ko"; // Hangul (Korean)

  const lower = text.toLowerCase();
  if (/(español|curso completo|en español)/.test(lower)) return "es";
  if (/(português|em português|curso completo)/.test(lower)) return "pt";
  if (/(français|en français|cours complet)/.test(lower)) return "fr";
  if (/(deutsch|auf deutsch)/.test(lower)) return "de";
  if (/(bahasa indonesia|belajar)/.test(lower)) return "id";

  return "en"; // default assumption when no other signal is present
}

function languageFromText(title, description) {
  const code = detectLanguageCode(title, description);
  return { code, label: LANGUAGE_LABELS[code] || "English" };
}

// Fetches just the video IDs + titles for a playlist (lighter than
// samplePlaylistVideos, which also pulls stats) - used as input to the
// AI coverage analysis so it can see what topics the playlist covers.
export async function getPlaylistVideoTitles(playlistId, maxResults = 30) {
  const url = `${BASE_URL}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${getApiKey()}`;
  const data = await fetchJson(url);
  return data.items.map((item) => ({
    videoId: item.snippet?.resourceId?.videoId,
    title: item.snippet?.title || "",
  }));
}

// Fetches top-level comments (by relevance) across a handful of videos
// in the playlist, used as input to the AI sentiment analysis.
// Capped at a few videos to keep quota/time bounded - comments.list
// costs only 1 unit per call, but pulling every video in a 100-video
// course isn't necessary to get a representative sentiment read.
export async function getTopComments(videoIds, maxPerVideo = 15, maxVideos = 5) {
  const sampledIds = videoIds.slice(0, maxVideos);
  const allComments = [];

  for (const videoId of sampledIds) {
    try {
      const url = `${BASE_URL}/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxPerVideo}&order=relevance&textFormat=plainText&key=${getApiKey()}`;
      const data = await fetchJson(url);
      const comments = (data.items || []).map(
        (item) => item.snippet.topLevelComment.snippet.textDisplay
      );
      allComments.push(...comments);
    } catch (err) {
      // Comments can be disabled on some videos - skip that video
      // rather than failing the whole analysis.
      continue;
    }
  }

  return allComments;
}

/**
 * Searches YouTube for playlists on a topic, scores them, and returns
 * them ranked best-first. This is the main entry point used by the
 * /api/playlists/search route.
 */
export async function findPlaylists(query, pageToken = "", language = "") {
  const cacheKey = `playlists:${query.toLowerCase()}:${pageToken}:${language}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const { playlistIds, nextPageToken } = await searchPlaylists(query, 10, pageToken, language);
  if (playlistIds.length === 0) {
    return { playlists: [], nextPageToken: null };
  }

  const playlistDetails = await getPlaylistDetails(playlistIds);

  const results = [];

  for (const pl of playlistDetails) {
    const itemCount = pl.contentDetails?.itemCount || 0;
    const { videos, lastPublishedAt } = await samplePlaylistVideos(pl.id, 20);

    const totalSampledViews = videos.reduce(
      (sum, v) => sum + (Number(v.statistics?.viewCount) || 0),
      0
    );
    // Extrapolate total views across the full playlist from the sample,
    // since we only pull stats for a subset of long playlists.
    const estimatedTotalViews =
      videos.length > 0 ? Math.round((totalSampledViews / videos.length) * itemCount) : 0;

    const totalSampledSeconds = videos.reduce(
      (sum, v) => sum + parseISODuration(v.contentDetails?.duration),
      0
    );
    const avgSecondsPerVideo = videos.length ? totalSampledSeconds / videos.length : 0;
    const estimatedTotalSeconds = Math.round(avgSecondsPerVideo * itemCount);

    const title = pl.snippet.title || "";
    const description = pl.snippet.description || "";
    const hasCompletenessLanguage = COMPLETENESS_KEYWORDS.some((kw) =>
      `${title} ${description}`.toLowerCase().includes(kw)
    );

    const coverage = scoreCoverage(title, description, query);
    const engagement = scoreEngagement(videos);
    const recency = scoreRecency(lastPublishedAt);
    const completeness = scoreCompleteness(itemCount, hasCompletenessLanguage);
    const popularity = scorePopularity(estimatedTotalViews);

    const overallScore = Math.round(
      coverage * WEIGHTS.coverage +
        engagement * WEIGHTS.engagement +
        recency * WEIGHTS.recency +
        completeness * WEIGHTS.completeness +
        popularity * WEIGHTS.popularity
    );

    const detectedLanguage = languageFromText(title, description);

    results.push({
      id: pl.id,
      title,
      description: description.slice(0, 220),
      channelTitle: pl.snippet.channelTitle,
      thumbnail:
        pl.snippet.thumbnails?.medium?.url || pl.snippet.thumbnails?.default?.url || "",
      videoCount: itemCount,
      estimatedTotalViews,
      estimatedTotalSeconds,
      lastUpdated: lastPublishedAt ? lastPublishedAt.toISOString() : null,
      publishedAt: pl.snippet.publishedAt,
      difficulty: difficultyFromText(title, description),
      language: detectedLanguage.label, // display label, e.g. "Hindi"
      languageCode: detectedLanguage.code, // e.g. "hi" - used for filtering
      playlistUrl: `https://www.youtube.com/playlist?list=${pl.id}`,
      score: overallScore,
      scoreBreakdown: { coverage, engagement, recency, completeness, popularity },
    });
  }

  results.sort((a, b) => b.score - a.score);

  // If the caller asked for a specific language, filter down to
  // playlists we actually detected as that language rather than just
  // relying on YouTube's soft relevanceLanguage bias (which only
  // nudges ranking, it doesn't guarantee a match). If nothing matches
  // exactly, fall back to the unfiltered list so the user still sees
  // results, with a flag the frontend can use to explain why.
  let finalPlaylists = results;
  let languageFilterApplied = false;

  if (language) {
    const matched = results.filter((p) => p.languageCode === language);
    if (matched.length > 0) {
      finalPlaylists = matched;
      languageFilterApplied = true;
    }
  }

  const payload = {
    playlists: finalPlaylists,
    nextPageToken,
    languageFilterApplied,
    languageRequested: language || null,
  };
  cache.set(cacheKey, payload);
  return payload;
}