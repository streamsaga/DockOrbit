// scoringEngine.js
//
// This is the heart of the site's differentiator: turning raw channel
// stats into a 0-100 Trust Score with an explainable breakdown, plus
// automatic red flags. All four sub-scores are 0-100, then combined
// with weights into the final score.

const WEIGHTS = {
  engagement: 0.35,
  consistency: 0.25,
  authenticity: 0.25,
  longevity: 0.15,
};

/**
 * Engagement: how much viewers actually interact vs. just view.
 * Uses (likes + comments) / views, normalized against a realistic
 * "great engagement" ceiling of ~8%.
 */
function scoreEngagement(channel) {
  const { avgLikes, avgComments, avgViewsPerVideo } = channel;
  if (!avgViewsPerVideo) return 0;
  const engagementRate = (avgLikes + avgComments) / avgViewsPerVideo;
  const ceiling = 0.08; // 8% engagement is excellent
  const score = Math.min(engagementRate / ceiling, 1) * 100;
  return Math.round(score);
}

/**
 * Consistency: regular upload cadence signals an active, reliable channel.
 * Compares uploads in the last 30/90 days against a healthy baseline
 * (roughly 1 upload/week = fully consistent).
 */
function scoreConsistency(channel) {
  const { uploadsLast30Days, uploadsLast90Days } = channel;
  const healthyMonthly = 4; // ~1/week
  const recentScore = Math.min(uploadsLast30Days / healthyMonthly, 1);
  const sustainedScore = Math.min(uploadsLast90Days / (healthyMonthly * 3), 1);
  // Average recent activity with sustained activity so a single burst
  // month doesn't fully carry the score.
  const score = ((recentScore + sustainedScore) / 2) * 100;
  return Math.round(score);
}

/**
 * Authenticity: flags patterns common to inflated/bought subscribers
 * or farmed engagement. High subs + very low views/engagement is
 * the classic red flag. Also rewards verification.
 */
function scoreAuthenticity(channel) {
  const { subscribers, avgViewsPerVideo, verified } = channel;
  if (!subscribers) return 50;

  const viewToSubRatio = avgViewsPerVideo / subscribers;
  // Organic channels typically show 3-15% of subscribers viewing
  // each new video. Below ~1% is suspicious.
  let ratioScore;
  if (viewToSubRatio >= 0.1) ratioScore = 100;
  else if (viewToSubRatio >= 0.03) ratioScore = 85;
  else if (viewToSubRatio >= 0.01) ratioScore = 60;
  else ratioScore = 25;

  const verifiedBonus = verified ? 10 : 0;
  return Math.round(Math.min(ratioScore + verifiedBonus, 100));
}

/**
 * Longevity: older channels with a track record are lower-risk than
 * brand-new ones, though we cap the benefit so new-but-great channels
 * aren't buried.
 */
function scoreLongevity(channel) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - channel.channelCreatedYear;
  const cappedAge = Math.min(age, 8); // 8+ years = full marks
  return Math.round((cappedAge / 8) * 100);
}

/**
 * Detects human-readable red flags from the same underlying stats,
 * shown directly to users alongside the score.
 */
function detectRedFlags(channel) {
  const flags = [];
  const viewToSubRatio = channel.avgViewsPerVideo / (channel.subscribers || 1);

  if (viewToSubRatio < 0.01) {
    flags.push("Low view-to-subscriber ratio — possible inflated subscriber count");
  }
  if (channel.uploadsLast30Days > 25) {
    flags.push("Very high upload frequency — may indicate low-effort/mass-produced content");
  }
  if (channel.avgComments / (channel.avgViewsPerVideo || 1) < 0.0003) {
    flags.push("Unusually low comment engagement relative to views");
  }
  if (channel.uploadsLast90Days === 0) {
    flags.push("No uploads in the last 90 days — channel may be inactive");
  }
  return flags;
}

/**
 * Main entry point: takes a raw channel object and returns it enriched
 * with trustScore, scoreBreakdown, and redFlags.
 */
export function scoreChannel(channel) {
  const engagement = scoreEngagement(channel);
  const consistency = scoreConsistency(channel);
  const authenticity = scoreAuthenticity(channel);
  const longevity = scoreLongevity(channel);

  const trustScore = Math.round(
    engagement * WEIGHTS.engagement +
      consistency * WEIGHTS.consistency +
      authenticity * WEIGHTS.authenticity +
      longevity * WEIGHTS.longevity
  );

  return {
    ...channel,
    trustScore,
    scoreBreakdown: { engagement, consistency, authenticity, longevity },
    redFlags: detectRedFlags(channel),
  };
}

export function scoreChannels(channels) {
  return channels
    .map(scoreChannel)
    .sort((a, b) => b.trustScore - a.trustScore);
}