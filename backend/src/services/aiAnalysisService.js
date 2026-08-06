// aiAnalysisService.js
//
// Calls the OpenAI API to turn raw playlist data (video titles +
// sampled comments) into three things the Playlist Finder UI shows:
//   1. Coverage analysis  - which subtopics are covered / missing, and
//                            an overall coverage percentage
//   2. AI summary          - a short paragraph on why this playlist is
//                            (or isn't) a good pick
//   3. Comment sentiment   - overall positive %, what students liked,
//                            what they disliked, common feedback
//
// One API call returns all three as structured JSON (using OpenAI's
// JSON mode, which guarantees the response is valid JSON), to keep
// cost and latency down - one request instead of three.

import NodeCache from "node-cache";

// Cache analysis results for 24 hours - this is the most expensive
// operation in the app (an LLM call), and a playlist's content and
// comments don't meaningfully change hour to hour.
const cache = new NodeCache({ stdTTL: 86400 });

function getApiKey() {
  return process.env.OPENAI_API_KEY;
}

const SYSTEM_PROMPT = `You are an expert curriculum analyst helping students choose the best YouTube playlist for a study topic.

You will be given:
- The topic the student searched for
- A playlist's title and channel name
- A list of video titles in the playlist (in order)
- A sample of viewer comments on videos in the playlist

Analyze topic coverage and comment sentiment, and respond with ONLY a JSON object matching this exact shape:

{
  "coveragePercentage": <integer 0-100>,
  "coveredTopics": [<array of 3-8 short strings, subtopics this playlist clearly covers, based on video titles>],
  "missingTopics": [<array of 0-5 short strings, important subtopics for this search topic that do NOT appear to be covered - empty array if none>],
  "aiSummary": "<1-3 sentence plain-English explanation of why this playlist is or isn't a strong recommendation, written for a student deciding whether to commit to it>",
  "sentiment": {
    "positivePercentage": <integer 0-100, your best estimate from the comment sample>,
    "studentsLiked": [<array of 2-5 short phrases, what commenters praised - empty array if comments are too sparse to tell>],
    "studentsDisliked": [<array of 0-5 short phrases, what commenters criticized - empty array if none found>],
    "commonFeedback": "<1 sentence summarizing the overall tone of the comments>"
  }
}

Base coveredTopics/missingTopics on the actual video titles provided - do not invent topics that aren't suggested by the titles. If comments are empty or too few to judge, say so honestly in commonFeedback and use conservative/neutral values rather than guessing positively.`;

function buildUserPrompt(topic, playlistTitle, channelTitle, videoTitles, comments) {
  const titleList = videoTitles.slice(0, 40).map((t, i) => `${i + 1}. ${t}`).join("\n");
  const commentSample = comments.slice(0, 60).map((c) => `- ${c}`).join("\n");

  return `Search topic: "${topic}"

Playlist: "${playlistTitle}" by ${channelTitle}

Video titles in this playlist:
${titleList || "(no video titles available)"}

Sample viewer comments (${comments.length} total collected):
${commentSample || "(no comments available or comments are disabled)"}

Return the JSON analysis now.`;
}

async function callOpenAI(systemPrompt, userPrompt) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set in .env");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // fast and cheap, good enough for this structured-extraction task
      response_format: { type: "json_object" }, // guarantees valid JSON back, no fence-stripping needed
      max_tokens: 1024,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI API returned no content");
  }

  return JSON.parse(content);
}

/**
 * Runs the full AI analysis for one playlist and caches the result.
 * cacheKey should uniquely identify this playlist+topic combination.
 */
export async function analyzePlaylist({
  cacheKey,
  topic,
  playlistTitle,
  channelTitle,
  videoTitles,
  comments,
}) {
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const userPrompt = buildUserPrompt(topic, playlistTitle, channelTitle, videoTitles, comments);
  const analysis = await callOpenAI(SYSTEM_PROMPT, userPrompt);

  cache.set(cacheKey, analysis);
  return analysis;
}