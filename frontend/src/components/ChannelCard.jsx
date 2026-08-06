import TrustRing from "./TrustRing.jsx";
import ScoreBreakdown from "./ScoreBreakdown.jsx";

function formatCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function ChannelCard({
  channel,
  onToggleCompare,
  isComparing,
  compareDisabled,
  onToggleBookmark,
  isBookmarked,
}) {
  return (
    <div className="channel-card">
      <div className="channel-card-header">
        <img
          className="channel-avatar"
          src={channel.thumbnail}
          alt={`${channel.name} avatar`}
        />

        <div className="channel-card-heading">
          <div className="channel-name-row">
            <p className="channel-name">{channel.name}</p>
            {channel.verified && (
              <span className="verified-badge" title="Verified channel">
                ✓
              </span>
            )}
          </div>
          <p className="channel-meta">
            {formatCount(channel.subscribers)} subscribers
            {(channel.country || channel.language) && (
              <span className="channel-locale-badge">
                {[channel.country, channel.language?.toUpperCase()].filter(Boolean).join(" · ")}
              </span>
            )}
          </p>
        </div>

        <div className="channel-card-topright">
          <TrustRing score={channel.trustScore} />
          <button
            className={`bookmark-btn ${isBookmarked ? "active" : ""}`}
            onClick={() => onToggleBookmark(channel)}
            aria-label={isBookmarked ? "Remove from saved" : "Save channel"}
            title={isBookmarked ? "Remove from saved" : "Save channel"}
          >
            {isBookmarked ? "★" : "☆"}
          </button>
        </div>
      </div>

      <p className="channel-desc">{channel.description}</p>

      <div className="stat-row">
        <span>
          <strong>{formatCount(channel.avgViewsPerVideo)}</strong> avg views
        </span>
        <span>
          <strong>{channel.uploadsLast30Days}</strong> uploads/30d
        </span>
        <span>
          <strong>{channel.videoCount}</strong> videos
        </span>
      </div>

      {channel.redFlags.length > 0 && (
        <div className="red-flags">
          {channel.redFlags.map((flag) => (
            <div className="red-flag" key={flag}>
              <span>⚠</span>
              <span>{flag}</span>
            </div>
          ))}
        </div>
      )}

      <ScoreBreakdown breakdown={channel.scoreBreakdown} />

      <div className="card-actions">
        <label className={`compare-checkbox ${compareDisabled ? "disabled" : ""}`}>
          <input
            type="checkbox"
            checked={isComparing}
            disabled={compareDisabled}
            onChange={() => onToggleCompare(channel)}
          />
          Compare
        </label>
        <a
          className="visit-btn"
          href={
            channel.channelUrl ||
            `https://youtube.com/results?search_query=${encodeURIComponent(channel.name)}`
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit channel →
        </a>
      </div>
    </div>
  );
}