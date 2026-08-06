import { Fragment, useEffect } from "react";
import TrustRing from "./TrustRing.jsx";

function formatCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

const BREAKDOWN_LABELS = {
  engagement: "Engagement",
  consistency: "Consistency",
  authenticity: "Authenticity",
  longevity: "Longevity",
};

export default function CompareModal({ channels, onClose, onRemove }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (channels.length === 0) return null;

  return (
    <div className="compare-overlay" onClick={onClose}>
      <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
        <div className="compare-header">
          <h2 className="compare-title">Comparing {channels.length} channels</h2>
          <button className="compare-close" onClick={onClose} aria-label="Close comparison">
            ✕
          </button>
        </div>

        <div
          className="compare-grid"
          style={{ gridTemplateColumns: `160px repeat(${channels.length}, 1fr)` }}
        >
          {/* Header row: avatar + name */}
          <div className="compare-cell compare-row-label" />
          {channels.map((ch) => (
            <div className="compare-cell compare-channel-header" key={ch.id}>
              <img src={ch.thumbnail} alt={ch.name} className="compare-avatar" />
              <p className="compare-channel-name">{ch.name}</p>
              <button className="compare-remove" onClick={() => onRemove(ch.id)}>
                Remove
              </button>
            </div>
          ))}

          {/* Trust score row */}
          <div className="compare-cell compare-row-label">Trust Score</div>
          {channels.map((ch) => (
            <div className="compare-cell compare-center" key={ch.id}>
              <TrustRing score={ch.trustScore} size={48} />
            </div>
          ))}

          {/* Basic stats */}
          {[
            ["Subscribers", (ch) => formatCount(ch.subscribers)],
            ["Avg views/video", (ch) => formatCount(ch.avgViewsPerVideo)],
            ["Total videos", (ch) => ch.videoCount],
            ["Uploads / 30 days", (ch) => ch.uploadsLast30Days],
            ["Channel age", (ch) => `${new Date().getFullYear() - ch.channelCreatedYear} yrs`],
            ["Verified", (ch) => (ch.verified ? "Yes ✓" : "No")],
          ].map(([label, getValue]) => (
            <Fragment key={label}>
              <div className="compare-cell compare-row-label">
                {label}
              </div>
              {channels.map((ch) => (
                <div className="compare-cell compare-center" key={`${label}-${ch.id}`}>
                  {getValue(ch)}
                </div>
              ))}
            </Fragment>
          ))}

          {/* Score breakdown rows */}
          {Object.keys(BREAKDOWN_LABELS).map((key) => (
            <Fragment key={key}>
              <div className="compare-cell compare-row-label">
                {BREAKDOWN_LABELS[key]}
              </div>
              {channels.map((ch) => (
                <div className="compare-cell compare-center" key={`${key}-${ch.id}`}>
                  {ch.scoreBreakdown[key]}
                </div>
              ))}
            </Fragment>
          ))}

          {/* Red flags */}
          <div className="compare-cell compare-row-label">Red flags</div>
          {channels.map((ch) => (
            <div className="compare-cell compare-flags" key={`flags-${ch.id}`}>
              {ch.redFlags.length === 0 ? (
                <span className="compare-no-flags">None</span>
              ) : (
                ch.redFlags.map((f) => (
                  <div className="red-flag" key={f}>
                    ⚠ {f}
                  </div>
                ))
              )}
            </div>
          ))}

          {/* Visit links */}
          <div className="compare-cell compare-row-label" />
          {channels.map((ch) => (
            <div className="compare-cell compare-center" key={`visit-${ch.id}`}>
              <a
                className="visit-btn"
                href={
                  ch.channelUrl ||
                  `https://youtube.com/results?search_query=${encodeURIComponent(ch.name)}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}