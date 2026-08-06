// Mascot.jsx
//
// The site's signature illustration: a friendly flat-style character
// reused across empty states and page intros, with a different
// "accessory" per context. Rebuilt with more personality (antenna,
// rosier proportions, layered color) and richer surrounding scenes
// than the first version. Inline SVG using CSS variables for color,
// so it re-themes automatically with light/dark mode.

function Character({ tilt = 0 }) {
  return (
    <g transform={`rotate(${tilt} 95 150)`}>
      {/* antenna */}
      <line x1="95" y1="40" x2="95" y2="55" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="95" cy="36" r="7" fill="var(--trust-mid)" />

      {/* body */}
      <rect x="52" y="112" width="86" height="92" rx="42" fill="var(--accent)" />
      <rect x="62" y="150" width="66" height="40" rx="20" fill="var(--accent)" opacity="0.85" />

      {/* head */}
      <circle cx="95" cy="90" r="40" fill="var(--accent)" />

      {/* cheeks */}
      <circle cx="74" cy="99" r="6.5" fill="var(--trust-low)" opacity="0.4" />
      <circle cx="116" cy="99" r="6.5" fill="var(--trust-low)" opacity="0.4" />

      {/* eyes */}
      <circle cx="79" cy="87" r="6" fill="var(--surface)" />
      <circle cx="111" cy="87" r="6" fill="var(--surface)" />
      <circle cx="80.5" cy="85.5" r="2.2" fill="var(--accent)" />
      <circle cx="112.5" cy="85.5" r="2.2" fill="var(--accent)" />

      {/* smile */}
      <path
        d="M78 103 Q95 116 112 103"
        stroke="var(--surface)"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* left arm */}
      <rect
        x="26"
        y="126"
        width="17"
        height="58"
        rx="8.5"
        fill="var(--accent)"
        transform="rotate(-20 34 126)"
      />
      {/* right arm */}
      <rect
        x="148"
        y="126"
        width="17"
        height="58"
        rx="8.5"
        fill="var(--accent)"
        transform="rotate(20 156 126)"
      />
    </g>
  );
}

function SearchingScene() {
  return (
    <svg viewBox="0 0 340 250" width="100%" height="100%" role="presentation" aria-hidden="true">
      {/* layered backdrop blobs for depth */}
      <circle cx="280" cy="55" r="34" fill="var(--surface-raised)" opacity="0.7" />
      <circle cx="305" cy="185" r="22" fill="var(--surface-raised)" opacity="0.7" />
      <circle cx="34" cy="34" r="18" fill="var(--surface-raised)" opacity="0.7" />
      <circle cx="20" cy="200" r="14" fill="var(--surface-raised)" opacity="0.5" />

      {/* stacked "video card" stack the character is inspecting */}
      <g transform="translate(148 55)">
        <rect x="14" y="34" width="122" height="72" rx="14" fill="var(--surface-raised)" />
        <rect x="4" y="18" width="122" height="72" rx="14" fill="var(--surface)" />
        <rect x="0" y="2" width="122" height="72" rx="14" fill="var(--surface)" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.08))" }} />
        <polygon points="46,26 46,50 68,38" fill="var(--accent)" />
        <rect x="14" y="60" width="60" height="6" rx="3" fill="var(--surface-raised)" />
        <rect x="14" y="72" width="40" height="6" rx="3" fill="var(--surface-raised)" />
      </g>

      <Character tilt={-6} />

      {/* magnifying glass */}
      <g transform="translate(138 158) rotate(18)">
        <circle cx="0" cy="0" r="27" fill="var(--surface)" opacity="0.4" />
        <circle cx="0" cy="0" r="27" fill="none" stroke="var(--accent)" strokeWidth="8" />
        <line x1="19" y1="19" x2="42" y2="42" stroke="var(--accent)" strokeWidth="9" strokeLinecap="round" />
      </g>

      {/* sparkle accents */}
      <circle cx="245" cy="28" r="4.5" fill="var(--trust-high)" />
      <circle cx="266" cy="46" r="3" fill="var(--trust-mid)" />
      <circle cx="255" cy="15" r="2.4" fill="var(--trust-low)" />
      <path d="M18 60 l4 4 4 -4 -4 -4 z" fill="var(--trust-mid)" opacity="0.8" />
    </svg>
  );
}

function EmptyScene() {
  return (
    <svg viewBox="0 0 340 250" width="100%" height="100%" role="presentation" aria-hidden="true">
      <circle cx="55" cy="45" r="26" fill="var(--surface-raised)" opacity="0.7" />
      <circle cx="300" cy="65" r="20" fill="var(--surface-raised)" opacity="0.7" />
      <circle cx="30" cy="205" r="14" fill="var(--surface-raised)" opacity="0.5" />

      {/* empty dashed frame */}
      <rect
        x="172"
        y="58"
        width="132"
        height="104"
        rx="16"
        fill="var(--surface)"
        opacity="0.4"
      />
      <rect
        x="172"
        y="58"
        width="132"
        height="104"
        rx="16"
        fill="none"
        stroke="var(--surface-raised)"
        strokeWidth="8"
        strokeDasharray="11 11"
      />
      <text
        x="238"
        y="122"
        textAnchor="middle"
        fontSize="36"
        fontFamily="var(--font-display)"
        fill="var(--surface-raised)"
      >
        ?
      </text>

      <Character tilt={4} />

      {/* shrug marks above the raised arm */}
      <path
        d="M170 92 q7 -11 15 -4"
        stroke="var(--text-faint)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M178 82 q7 -9 14 -3"
        stroke="var(--text-faint)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

export default function Mascot({ variant = "searching", width = 280 }) {
  return (
    <div style={{ width, maxWidth: "100%", margin: "0 auto" }}>
      {variant === "empty" ? <EmptyScene /> : <SearchingScene />}
    </div>
  );
}