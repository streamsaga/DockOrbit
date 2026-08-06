// TrustRing.jsx
// The site's signature visual element: a circular progress ring around
// the trust score, colored by tier (red/amber/green). Used on every card.

function getTier(score) {
  if (score >= 70) return { color: "var(--trust-high)", label: "High trust" };
  if (score >= 45) return { color: "var(--trust-mid)", label: "Medium trust" };
  return { color: "var(--trust-low)", label: "Low trust" };
}

export default function TrustRing({ score, size = 56 }) {
  const { color, label } = getTier(score);
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      className="trust-ring-wrap"
      style={{ width: size, height: size }}
      title={`${label}: ${score}/100`}
      role="img"
      aria-label={`Trust score ${score} out of 100, ${label}`}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-raised)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </svg>
      <div className="trust-ring-value" style={{ color }}>
        {score}
      </div>
    </div>
  );
}