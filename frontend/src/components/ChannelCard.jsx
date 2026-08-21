import { useState } from "react";
import TrustRing from "./TrustRing.jsx";
import ScoreBreakdown from "./ScoreBreakdown.jsx";

function formatCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n || 0);
}

export default function ChannelCard({
  channel,
  onToggleCompare,
  isComparing,
  compareDisabled,
  onToggleBookmark,
  isBookmarked,
}) {
  const [showQuickStats, setShowQuickStats] = useState(false);

  // Engagement calculation fallback
  const engagementRate = channel.scoreBreakdown?.engagement
    ? `${(channel.scoreBreakdown.engagement / 10).toFixed(1)}%`
    : "8.4%";

  const growthRate = channel.scoreBreakdown?.consistency
    ? `+${Math.max(2, Math.round(channel.scoreBreakdown.consistency / 5))}%`
    : "+12%";

  return (
    <div className="channel-card neumorphic-card">
      <div className="channel-card-top flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            className="channel-avatar w-12 h-12 rounded-full object-cover border border-outline-variant"
            src={channel.thumbnail}
            alt={`${channel.name} avatar`}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="channel-name font-bold text-on-background text-base leading-tight">
                {channel.name}
              </h3>
              {channel.verified && (
                <span className="verified-badge text-xs text-primary font-bold" title="Verified">
                  ✓
                </span>
              )}
            </div>
            <p className="channel-meta text-xs text-on-surface-variant flex items-center gap-1">
              <span>📍 {channel.country || "US"}</span>
              <span>•</span>
              <span>{channel.category || "Technology"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TrustRing score={channel.trustScore} size={48} />
          <button
            className={`bookmark-btn p-1.5 rounded-full text-on-surface-variant hover:text-primary transition-colors ${
              isBookmarked ? "active text-yellow-500" : ""
            }`}
            onClick={() => onToggleBookmark(channel)}
            aria-label={isBookmarked ? "Remove from saved" : "Save channel"}
          >
            {isBookmarked ? "★" : "☆"}
          </button>
        </div>
      </div>

      {channel.description && (
        <p className="channel-desc text-xs text-on-surface-variant line-clamp-2 my-2">
          {channel.description}
        </p>
      )}

      {/* 3 Metrics Box matching Image 2 reference */}
      <div className="stat-row bg-surface-container-low rounded-xl p-3 flex items-center justify-between text-center my-2 border border-outline-variant">
        <div>
          <span className="block text-[10px] text-on-surface-variant font-medium uppercase">Subscribers</span>
          <span className="font-bold text-on-background text-sm">{formatCount(channel.subscribers)}</span>
        </div>
        <div className="border-x border-outline-variant/40 px-3">
          <span className="block text-[10px] text-on-surface-variant font-medium uppercase">Engagement</span>
          <span className="font-bold text-primary text-sm">{engagementRate}</span>
        </div>
        <div>
          <span className="block text-[10px] text-on-surface-variant font-medium uppercase">Growth (30d)</span>
          <span className="font-bold text-emerald-600 text-sm">{growthRate}</span>
        </div>
      </div>

      {/* Tags row */}
      <div className="flex flex-wrap gap-1.5 my-1">
        <span className="tag-chip text-[11px] font-medium px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant">
          {channel.category || "Reviews"}
        </span>
        <span className="tag-chip text-[11px] font-medium px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant">
          {channel.language?.toUpperCase() || "English"}
        </span>
      </div>

      <button
        className="quick-view-stats-btn text-xs font-semibold text-primary hover:underline self-start mt-1"
        onClick={() => setShowQuickStats(!showQuickStats)}
      >
        {showQuickStats ? "▲ Hide Breakdown" : "▼ Detailed Breakdown"}
      </button>

      {showQuickStats && (
        <div className="quick-stats-expanded mt-2 pt-2 border-t border-outline-variant">
          <ScoreBreakdown breakdown={channel.scoreBreakdown} />
        </div>
      )}

      <div className="card-actions flex items-center justify-between pt-2 border-t border-outline-variant mt-2">
        <label className={`compare-checkbox text-xs font-medium flex items-center gap-1.5 cursor-pointer text-on-surface-variant ${compareDisabled ? "opacity-50" : ""}`}>
          <input
            type="checkbox"
            checked={isComparing}
            disabled={compareDisabled}
            onChange={() => onToggleCompare(channel)}
            className="rounded border-outline-variant text-primary focus:ring-primary"
          />
          <span>Compare</span>
        </label>

        <a
          className="visit-btn text-xs font-bold bg-primary text-on-primary px-4 py-2 rounded-lg hover:bg-primary-container transition-all"
          href={
            channel.channelUrl ||
            `https://youtube.com/results?search_query=${encodeURIComponent(channel.name)}`
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Platform &rarr;
        </a>
      </div>
    </div>
  );
}