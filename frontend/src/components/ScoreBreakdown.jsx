// ScoreBreakdown.jsx
// Shows the four sub-scores that make up the Trust Score, so users
// understand *why* a channel was rated the way it was rather than
// just trusting a single opaque number.

const LABELS = {
  engagement: "Engagement",
  consistency: "Consistency",
  authenticity: "Authenticity",
  longevity: "Longevity",
};

function barColor(value) {
  if (value >= 70) return "var(--trust-high)";
  if (value >= 45) return "var(--trust-mid)";
  return "var(--trust-low)";
}

export default function ScoreBreakdown({ breakdown }) {
  return (
    <div className="breakdown-panel">
      <p className="breakdown-heading">Score breakdown</p>
      {Object.entries(breakdown).map(([key, value]) => (
        <div className="breakdown-item" key={key}>
          <span className="breakdown-label">{LABELS[key] || key}</span>
          <div className="breakdown-bar-track">
            <div
              className="breakdown-bar-fill"
              style={{ width: `${value}%`, background: barColor(value) }}
            />
          </div>
          <span className="breakdown-score">{value}</span>
        </div>
      ))}
    </div>
  );
}