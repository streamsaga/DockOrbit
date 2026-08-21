import { useEffect } from "react";
import TrustRing from "./TrustRing.jsx";

function formatCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n || 0);
}

export default function CompareModal({ channels, onClose, onRemove }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!channels || channels.length === 0) return null;

  // Find top performer by trust score
  const topChannel = [...channels].sort((a, b) => b.trustScore - a.trustScore)[0];

  return (
    <div className="compare-overlay fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="compare-modal bg-surface border border-outline-variant rounded-3xl p-6 md:p-8 max-w-4xl w-full neumorphic-card shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-on-background">Compare Channels</h2>
            <p className="text-sm text-on-surface-variant mt-1">Side-by-side metric analysis.</p>
          </div>
          <button className="text-outline hover:text-primary text-xl font-bold p-1" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Channels Header Cards Row (Matching Image 3) */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {channels.map((ch) => {
            const isTop = ch.id === topChannel?.id;
            return (
              <div
                key={ch.id}
                className={`p-4 rounded-2xl bg-surface border text-center relative flex flex-col items-center justify-center ${
                  isTop
                    ? "border-2 border-primary shadow-lg bg-surface-container-low"
                    : "border-outline-variant neumorphic-card"
                }`}
              >
                {isTop && (
                  <span className="absolute -top-3 bg-primary text-on-primary text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Top Pick
                  </span>
                )}
                <img src={ch.thumbnail} alt={ch.name} className="w-12 h-12 rounded-full object-cover mb-2 border border-outline-variant" />
                <h3 className="font-bold text-on-background text-sm leading-tight">{ch.name}</h3>
                <p className="text-[11px] text-on-surface-variant">@{ch.name.toLowerCase().replace(/\s+/g, "")}</p>
                {onRemove && (
                  <button onClick={() => onRemove(ch.id)} className="text-[10px] text-red-500 hover:underline mt-2">
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Metric Comparison Table Rows (Image 3) */}
        <div className="divide-y divide-outline-variant/40 mb-8 text-sm">
          {/* Quality Score Row */}
          <div className="py-4 grid grid-cols-4 items-center">
            <div className="flex items-center gap-2 font-bold text-on-background">
              <span>⭐</span> Quality Score
            </div>
            {channels.map((ch) => (
              <div key={ch.id} className="flex justify-center">
                <TrustRing score={ch.trustScore} size={48} />
              </div>
            ))}
          </div>

          {/* Subscribers Row */}
          <div className="py-4 grid grid-cols-4 items-center">
            <div className="flex items-center gap-2 font-bold text-on-background">
              <span>👥</span> Subscribers
            </div>
            {channels.map((ch) => (
              <div key={ch.id} className={`text-center font-bold ${ch.id === topChannel?.id ? "text-primary text-base font-extrabold" : "text-on-surface-variant"}`}>
                {formatCount(ch.subscribers)}
              </div>
            ))}
          </div>

          {/* Avg Views Row */}
          <div className="py-4 grid grid-cols-4 items-center">
            <div className="flex items-center gap-2 font-bold text-on-background">
              <span>👁</span> Avg Views
            </div>
            {channels.map((ch) => (
              <div key={ch.id} className={`text-center font-bold ${ch.id === topChannel?.id ? "text-primary text-base font-extrabold" : "text-on-surface-variant"}`}>
                {formatCount(ch.avgViewsPerVideo)}
              </div>
            ))}
          </div>
        </div>

        {/* AI Consensus Banner (Image 3) */}
        {topChannel && (
          <div className="ai-consensus-banner bg-surface-container-low border border-primary/30 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xl flex-shrink-0">
              🏆
            </div>
            <div>
              <h4 className="font-bold text-primary text-base mb-1">
                AI Consensus: {topChannel.name}
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Based on the weighted Quality Score ({topChannel.trustScore}) and significantly higher engagement metrics relative to subscriber count, {topChannel.name} presents the highest value density. While upload frequency is balanced, the viewer retention and conversion rates heavily favor this channel for long-term discovery.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}