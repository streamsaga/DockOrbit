import { Fragment, useEffect } from "react";

function formatCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n || 0);
}

function formatDuration(totalSeconds) {
  if (!totalSeconds) return "Unknown";
  const hours = Math.floor(totalSeconds / 3600);
  if (hours >= 1) return `${hours}h`;
  return `${Math.round(totalSeconds / 60)}m`;
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

export default function PlaylistCompareModal({ playlists, onClose, onRemove }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (playlists.length === 0) return null;

  return (
    <div className="compare-overlay" onClick={onClose}>
      <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
        <div className="compare-header">
          <h2 className="compare-title">Comparing {playlists.length} playlists</h2>
          <button className="compare-close" onClick={onClose} aria-label="Close comparison">
            ✕
          </button>
        </div>

        <div
          className="compare-grid"
          style={{ gridTemplateColumns: `160px repeat(${playlists.length}, 1fr)` }}
        >
          {/* Header row: thumbnail + title */}
          <div className="compare-cell compare-row-label" />
          {playlists.map((pl) => (
            <div className="compare-cell compare-channel-header" key={pl.id}>
              <img src={pl.thumbnail} alt={pl.title} className="compare-avatar compare-avatar-square" />
              <p className="compare-channel-name">{pl.title}</p>
              <button className="compare-remove" onClick={() => onRemove(pl.id)}>
                Remove
              </button>
            </div>
          ))}

          {/* Score row */}
          <div className="compare-cell compare-row-label">Score</div>
          {playlists.map((pl) => (
            <div className="compare-cell compare-center" key={pl.id}>
              <span className={`compare-score-badge ${scoreTierClass(pl.score)}`}>{pl.score}</span>
            </div>
          ))}

          {/* Basic stats */}
          {[
            ["Channel", (pl) => pl.channelTitle],
            ["Videos", (pl) => pl.videoCount],
            ["Total length", (pl) => formatDuration(pl.estimatedTotalSeconds)],
            ["Views", (pl) => formatCount(pl.estimatedTotalViews)],
            ["Difficulty", (pl) => pl.difficulty],
            ["Language", (pl) => pl.language],
          ].map(([label, getValue]) => (
            <Fragment key={label}>
              <div className="compare-cell compare-row-label">{label}</div>
              {playlists.map((pl) => (
                <div className="compare-cell compare-center" key={`${label}-${pl.id}`}>
                  {getValue(pl)}
                </div>
              ))}
            </Fragment>
          ))}

          {/* Score breakdown rows */}
          {Object.keys(BREAKDOWN_LABELS).map((key) => (
            <Fragment key={key}>
              <div className="compare-cell compare-row-label">{BREAKDOWN_LABELS[key]}</div>
              {playlists.map((pl) => (
                <div className="compare-cell compare-center" key={`${key}-${pl.id}`}>
                  {pl.scoreBreakdown?.[key] ?? "—"}
                </div>
              ))}
            </Fragment>
          ))}

          {/* Open links */}
          <div className="compare-cell compare-row-label" />
          {playlists.map((pl) => (
            <div className="compare-cell compare-center" key={`visit-${pl.id}`}>
              <a
                className="visit-btn"
                href={pl.playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}