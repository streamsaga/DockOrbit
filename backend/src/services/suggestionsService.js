// suggestionsService.js
//
// Powers the "type a few letters, see suggestions" search-bar
// experience, similar to YouTube's own search box.
//
// NOTE ON THE DATA SOURCE: YouTube Data API v3 has no official
// autocomplete/suggestions endpoint. This uses the same public
// suggestion service YouTube's own search box calls
// (suggestqueries.google.com), which is unauthenticated and free, but
// UNDOCUMENTED/unofficial - Google could change or remove it without
// notice. If it ever stops responding, this file is the only place
// that needs to change; every other feature in the app is unaffected.

import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 3600 });

export async function getSearchSuggestions(query) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const cacheKey = `suggest:${trimmed.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const url = `https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=${encodeURIComponent(
    trimmed
  )}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Suggestion service returned ${res.status}`);
  }

  // This endpoint returns a JSONP-ish response: a JS array literal
  // wrapped in text, e.g.  window.google.ac.h(["query", [["suggestion1",0],...]])
  // We extract just the array of suggestion strings.
  const text = await res.text();
  const jsonStart = text.indexOf("(");
  const jsonEnd = text.lastIndexOf(")");
  const parsed = JSON.parse(text.slice(jsonStart + 1, jsonEnd));
  const suggestions = (parsed[1] || []).map((entry) => entry[0]).slice(0, 8);

  cache.set(cacheKey, suggestions);
  return suggestions;
}