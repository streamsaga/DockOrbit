// youtubeService.js
//
// Talks to the real YouTube Data API v3 and reshapes the response into
// the exact same "channel object" shape used by mockChannels.js, so
// scoringEngine.js works unchanged on real or mock data.
//
// Uses 3 endpoints per category search:
//   1. search.list      -> find channels matching the category keyword
//   2. channels.list     -> get subscriber/view/video counts + upload playlist
//   3. playlistItems/videos.list -> get recent video stats for engagement &
//      upload-frequency numbers
//
// NOTE ON QUOTA: search.list costs 100 units per call (expensive).
// channels.list and videos.list cost 1 unit each. The free daily quota
// is 10,000 units, so be mindful of how often you re-fetch each category.
// NodeCache below caches results for 1 hour to avoid burning quota on
// every page reload during development.

import NodeCache from "node-cache";

// Read lazily (inside a function) rather than as a top-level const, so
// it's always read AFTER dotenv.config() has run in server.js, no
// matter the import order.
function getApiKey() {
  return process.env.YOUTUBE_API_KEY;
}

const BASE_URL = "https://www.googleapis.com/youtube/v3";

// Cache results for 1 hour (3600s) to conserve API quota
const cache = new NodeCache({ stdTTL: 3600 });

// Maps our internal category slugs to real YouTube search terms.
// Edit/add entries here to support more categories.
export const CATEGORY_SEARCH_TERMS = {
  "tech-reviews": "tech reviews",
  cooking: "cooking recipes",
  fitness: "fitness workout",
  gaming: "gaming lets play",
  music: "music channel",
  education: "educational lessons",
  finance: "personal finance investing",
  travel: "travel vlog",
  beauty: "beauty makeup tutorial",
  comedy: "comedy sketch",
  science: "science explained",
  movies: "movie review commentary",
  "diy-crafts": "diy crafts tutorial",
  sports: "sports highlights analysis",
  news: "news commentary",
  "art-design": "art design tutorial",
};

export { getApiKey, fetchJson, BASE_URL };

async function fetchJson(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) {
    throw new Error(`YouTube API error: ${data.error.message}`);
  }
  return data;
}

async function searchChannels(query, maxResults = 10, pageToken = "", regionCode = "", relevanceLanguage = "") {
  const pageParam = pageToken ? `&pageToken=${pageToken}` : "";
  const regionParam = regionCode ? `&regionCode=${regionCode}` : "";
  const langParam = relevanceLanguage ? `&relevanceLanguage=${relevanceLanguage}` : "";
  const url = `${BASE_URL}/search?part=snippet&type=channel&q=${encodeURIComponent(
    query
  )}&maxResults=${maxResults}${pageParam}${regionParam}${langParam}&key=${getApiKey()}`;
  const data = await fetchJson(url);
  return {
    channelIds: data.items.map((item) => item.snippet.channelId),
    nextPageToken: data.nextPageToken || null,
  };
}

async function getChannelDetails(channelIds) {
  const url = `${BASE_URL}/channels?part=snippet,statistics,contentDetails&id=${channelIds.join(
    ","
  )}&key=${getApiKey()}`;
  const data = await fetchJson(url);
  return data.items;
}

async function getRecentVideos(uploadsPlaylistId, maxResults = 15) {
  const playlistUrl = `${BASE_URL}/playlistItems?part=contentDetails,snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${getApiKey()}`;
  const playlistData = await fetchJson(playlistUrl);

  const videoIds = playlistData.items.map((item) => item.contentDetails.videoId);
  const publishDates = playlistData.items.map(
    (item) => new Date(item.contentDetails.videoPublishedAt || item.snippet.publishedAt)
  );

  if (videoIds.length === 0) {
    return { videos: [], publishDates: [] };
  }

  const statsUrl = `${BASE_URL}/videos?part=statistics&id=${videoIds.join(",")}&key=${getApiKey()}`;
  const statsData = await fetchJson(statsUrl);

  return { videos: statsData.items, publishDates };
}

function countUploadsWithin(publishDates, days) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return publishDates.filter((d) => d.getTime() >= cutoff).length;
}

/**
 * Fetches and reshapes real channels for a category into the same
 * object shape scoringEngine.js expects.
 */
export async function fetchChannelsForCategory(categorySlug, pageToken = "", country = "", language = "") {
  const query = CATEGORY_SEARCH_TERMS[categorySlug];
  if (!query) {
    throw new Error(`No search term configured for category "${categorySlug}"`);
  }
  return fetchChannelsForQuery(
    query,
    `channels:${categorySlug}:${pageToken}:${country}:${language}`,
    pageToken,
    country,
    language
  );
}

/**
 * Fetches and reshapes real channels for an arbitrary free-text search
 * query (used by the search bar, as opposed to a fixed category).
 * Returns { channels, nextPageToken } so the frontend can page through
 * more results without refetching ones it already has.
 *
 * country: ISO 3166-1 alpha-2 code (e.g. "US", "IN") - biases YouTube's
 *   search toward that region. NOTE: this is a bias, not a strict
 *   filter - YouTube's search API doesn't guarantee every result is
 *   actually based in that country. Each returned channel also carries
 *   its own declared `country` field (from the channel's About page)
 *   when available, so the frontend can show it transparently.
 * language: ISO 639-1 code (e.g. "en", "hi") - biases results toward
 *   that language, same caveat as above.
 */
export async function fetchChannelsForQuery(
  query,
  cacheKeyOverride,
  pageToken = "",
  country = "",
  language = ""
) {
  const cacheKey = cacheKeyOverride || `search:${query.toLowerCase()}:${pageToken}:${country}:${language}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const { channelIds, nextPageToken } = await searchChannels(
    query,
    10,
    pageToken,
    country,
    language
  );
  const channelDetails = await getChannelDetails(channelIds);

  const results = [];

  for (const ch of channelDetails) {
    const uploadsPlaylistId = ch.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) continue;

    const { videos, publishDates } = await getRecentVideos(uploadsPlaylistId, 15);

    const viewCounts = videos.map((v) => Number(v.statistics.viewCount) || 0);
    const likeCounts = videos.map((v) => Number(v.statistics.likeCount) || 0);
    const commentCounts = videos.map((v) => Number(v.statistics.commentCount) || 0);

    const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

    results.push({
      id: ch.id,
      name: ch.snippet.title,
      thumbnail: ch.snippet.thumbnails?.medium?.url || ch.snippet.thumbnails?.default?.url,
      description: ch.snippet.description?.slice(0, 140) || "",
      subscribers: Number(ch.statistics.subscriberCount) || 0,
      totalViews: Number(ch.statistics.viewCount) || 0,
      videoCount: Number(ch.statistics.videoCount) || 0,
      avgViewsPerVideo: Math.round(avg(viewCounts)),
      avgLikes: Math.round(avg(likeCounts)),
      avgComments: Math.round(avg(commentCounts)),
      channelCreatedYear: new Date(ch.snippet.publishedAt).getFullYear(),
      uploadsLast30Days: countUploadsWithin(publishDates, 30),
      uploadsLast90Days: countUploadsWithin(publishDates, 90),
      verified: false, // YouTube API doesn't expose verification status publicly
      channelUrl: `https://www.youtube.com/channel/${ch.id}`,
      country: ch.snippet.country || null, // declared by the channel owner, often blank
      language: ch.snippet.defaultLanguage || null,
    });
  }

  cache.set(cacheKey, { channels: results, nextPageToken });
  return { channels: results, nextPageToken };
}