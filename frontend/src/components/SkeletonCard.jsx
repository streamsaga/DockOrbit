// SkeletonCard.jsx
// Pulsing placeholder shown in the grid while real data loads, so the
// layout doesn't jump and the wait feels shorter than a blank screen.
export default function SkeletonCard() {
  return (
    <div className="channel-card skeleton-card" aria-hidden="true">
      <div className="channel-card-top">
        <div className="skeleton-block skeleton-avatar" />
        <div style={{ flex: 1 }}>
          <div className="skeleton-block skeleton-line" style={{ width: "60%" }} />
          <div className="skeleton-block skeleton-line" style={{ width: "40%", marginTop: 8 }} />
        </div>
        <div className="skeleton-block skeleton-ring" />
      </div>
      <div className="skeleton-block skeleton-line" style={{ width: "100%" }} />
      <div className="skeleton-block skeleton-line" style={{ width: "80%" }} />
      <div className="skeleton-block skeleton-line" style={{ width: "50%", height: 32, marginTop: 4 }} />
    </div>
  );
}