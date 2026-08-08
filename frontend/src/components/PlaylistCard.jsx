import { useState } from "react";

function formatCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n || 0);
}

function formatDuration(totalSeconds) {
  if (!totalSeconds) return "Unknown length";
  const hours = Math.floor(totalSeconds / 3600);
  if (hours >= 1) return `${hours}h total`;
  const minutes = Math.round(totalSeconds / 60);
  return `${minutes}m total`;
}

function formatDate(iso) {
  if (!iso) return "Unknown";
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

// Rough daily-study-time estimate: assuming 30 min/day, how many days
// to finish the whole playlist.
function estimateCompletionDays(totalSeconds) {
  if (!totalSeconds) return null;
  const dailyMinutes = 30;
  const totalMinutes = totalSeconds / 60;
  return Math.max(1, Math.ceil(totalMinutes / dailyMinutes));
}

function scoreTierClass(score) {
  if (score >= 70) return "tier-high";
  if (score >= 45) return "tier-mid";
  return "tier-low";
}

const BREAKDOWN_LABELS = {
  coverage: "Topic match",
  engagement: "Engagement",
  recency: "Recency",
  completeness: "Completeness",
  popularity: "Popularity",
};

function ScoreBreakdownMini({ breakdown }) {
  return (
    <div className="breakdown-panel">
      <p className="breakdown-heading">Why this score</p>
      {Object.entries(breakdown).map(([key, value]) => (
        <div className="breakdown-item" key={key}>
          <span className="breakdown-label">{BREAKDOWN_LABELS[key] || key}</span>
          <div className="breakdown-bar-track">
            <div
              className="breakdown-bar-fill"
              style={{
                width: `${value}%`,
                background:
                  value >= 70
                    ? "var(--trust-high)"
                    : value >= 45
                    ? "var(--trust-mid)"
                    : "var(--trust-low)",
              }}
            />
          </div>
          <span className="breakdown-score">{value}</span>
        </div>
      ))}
    </div>
  );
}

function AIAnalysisPanel({ analysis }) {
  return (
    <div className="ai-analysis-panel">
      <div className="ai-coverage-header">
        <span className="ai-panel-heading">AI Coverage Analysis</span>
        <span className="ai-coverage-percent">{analysis.coveragePercentage}%</span>
      </div>

      {analysis.coveredTopics?.length > 0 && (
        <div className="ai-topic-list">
          {analysis.coveredTopics.map((t) => (
            <div className="ai-topic-line ai-topic-covered" key={`c-${t}`}>
              ✓ {t}
            </div>
          ))}
        </div>
      )}

      {analysis.missingTopics?.length > 0 && (
        <div className="ai-topic-list">
          {analysis.missingTopics.map((t) => (
            <div className="ai-topic-line ai-topic-missing" key={`m-${t}`}>
              ✗ {t}
            </div>
          ))}
        </div>
      )}

      {analysis.aiSummary && (
        <div className="ai-summary-block">
          <span className="ai-panel-heading">AI Summary</span>
          <p className="ai-summary-text">{analysis.aiSummary}</p>
        </div>
      )}

      {analysis.sentiment && (
        <div className="ai-sentiment-block">
          <div className="ai-coverage-header">
            <span className="ai-panel-heading">Student Sentiment</span>
            <span className="ai-sentiment-percent">
              {analysis.sentiment.positivePercentage}% Positive
            </span>
          </div>

          {analysis.sentiment.studentsLiked?.length > 0 && (
            <div className="ai-sentiment-col">
              <span className="ai-sentiment-label ai-sentiment-good">Students liked</span>
              <ul className="ai-sentiment-list">
                {analysis.sentiment.studentsLiked.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.sentiment.studentsDisliked?.length > 0 && (
            <div className="ai-sentiment-col">
              <span className="ai-sentiment-label ai-sentiment-bad">Students disliked</span>
              <ul className="ai-sentiment-list">
                {analysis.sentiment.studentsDisliked.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.sentiment.commonFeedback && (
            <p className="ai-sentiment-summary">{analysis.sentiment.commonFeedback}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function PlaylistCard({
  playlist,
  searchTopic,
  onToggleBookmark,
  isBookmarked,
  onToggleCompare,
  isComparing,
  compareDisabled,
}) {
  const completionDays = estimateCompletionDays(playlist.estimatedTotalSeconds);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  function handleAnalyze() {
    if (analysis || analyzing) return;
    setAnalyzing(true);
    setAnalysisError(null);

    const params = new URLSearchParams({
      playlistId: playlist.id,
      topic: searchTopic || "",
      title: playlist.title,
      channel: playlist.channelTitle,
    });

    fetch(`/api/playlists/analyze?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Analysis failed");
        return res.json();
      })
      .then((data) => setAnalysis(data))
      .catch(() =>
        setAnalysisError("Could not analyze this playlist right now. Try again in a moment.")
      )
      .finally(() => setAnalyzing(false));
  }

  return (
    <div className="channel-card playlist-card">
      <div className="playlist-thumb-wrap">
        <img className="playlist-thumb" src={playlist.thumbnail} alt={playlist.title} />
        <div
          className={`playlist-score-badge ${scoreTierClass(playlist.score)}`}
          title="AI Recommendation Score"
        >
          {playlist.score}
        </div>
        {onToggleBookmark && (
          <button
            className={`bookmark-btn playlist-bookmark-btn ${isBookmarked ? "active" : ""}`}
            onClick={() => onToggleBookmark(playlist)}
            aria-label={isBookmarked ? "Remove from saved" : "Save playlist"}
            title={isBookmarked ? "Remove from saved" : "Save playlist"}
          >
            {isBookmarked ? "★" : "☆"}
          </button>
        )}
      </div>

      <div>
        <p className="channel-name playlist-title">{playlist.title}</p>
        <p className="channel-meta">{playlist.channelTitle}</p>
      </div>

      <p className="channel-desc">{playlist.description}</p>

      <div className="playlist-tag-row">
        <span className="playlist-tag">{playlist.difficulty}</span>
        <span className="playlist-tag">{playlist.language}</span>
      </div>

      <div className="stat-row">
        <span>
          <strong>{playlist.videoCount}</strong> videos
        </span>
        <span>
          <strong>{formatDuration(playlist.estimatedTotalSeconds)}</strong>
        </span>
        <span>
          <strong>{formatCount(playlist.estimatedTotalViews)}</strong> views
        </span>
      </div>

      <div className="stat-row">
        <span>Updated {formatDate(playlist.lastUpdated || playlist.publishedAt)}</span>
        {completionDays && <span>~{completionDays} days at 30 min/day</span>}
      </div>

      <ScoreBreakdownMini breakdown={playlist.scoreBreakdown} />

      {!analysis && !analyzing && !analysisError && (
        <button className="ai-analyze-btn" onClick={handleAnalyze}>
          ✨ Run AI Coverage &amp; Sentiment Analysis
        </button>
      )}

      {analyzing && <div className="ai-analyzing-state">Analyzing playlist with AI…</div>}

      {analysisError && (
        <div className="ai-analyzing-state ai-analysis-error">
          {analysisError}{" "}
          <button className="ai-retry-btn" onClick={handleAnalyze}>
            Retry
          </button>
        </div>
      )}

      {analysis && <AIAnalysisPanel analysis={analysis} />}

      <div className="card-actions">
        {onToggleCompare ? (
          <label className={`compare-checkbox ${compareDisabled ? "disabled" : ""}`}>
            <input
              type="checkbox"
              checked={isComparing}
              disabled={compareDisabled}
              onChange={() => onToggleCompare(playlist)}
            />
            Compare
          </label>
        ) : (
          <span className="playlist-score-label">{playlist.score}/100 recommendation score</span>
        )}
        <a
          className="visit-btn"
          href={playlist.playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open playlist →
        </a>
      </div>
    </div>
  );
}