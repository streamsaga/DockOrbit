import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import TrustRing from "../components/TrustRing.jsx";
import ScoreBreakdown from "../components/ScoreBreakdown.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import AuthModal from "../components/AuthModal.jsx";

function formatCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n || 0);
}

function formatDuration(totalSeconds) {
  if (!totalSeconds) return null;
  const hours = Math.floor(totalSeconds / 3600);
  if (hours >= 1) return `${hours}h total`;
  const minutes = Math.round(totalSeconds / 60);
  return `${minutes}m total`;
}

// Playlist-specific breakdown labels (different from channel's)
const PLAYLIST_BREAKDOWN_LABELS = {
  coverage: "Topic match",
  engagement: "Engagement",
  recency: "Recency",
  completeness: "Completeness",
  popularity: "Popularity",
};

function PlaylistScoreBreakdown({ breakdown }) {
  return (
    <div className="breakdown-panel">
      <p className="breakdown-heading">Score breakdown</p>
      {Object.entries(breakdown).map(([key, value]) => (
        <div className="breakdown-item" key={key}>
          <span className="breakdown-label">{PLAYLIST_BREAKDOWN_LABELS[key] || key}</span>
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

/* ── Inline SVG Icons ──────────────────────────────────────────────── */
const IconLink = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const IconChannel = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <path d="m10 9 5 3-5 3V9z"/>
    <path d="M2 20h20"/>
  </svg>
);

const IconPlaylist = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15V6"/>
    <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
    <path d="M12 12H3"/>
    <path d="M16 6H3"/>
    <path d="M12 18H3"/>
  </svg>
);

export default function LinkCheckerPage() {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // { type, data }
  const [history, setHistory] = useState([]); // recent lookups

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) return;

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/lookup?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setResult(data);

      // Add to history (avoid duplicates, keep last 5)
      setHistory((prev) => {
        const filtered = prev.filter((h) => h.data?.id !== data.data?.id);
        return [data, ...filtered].slice(0, 5);
      });
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleHistoryClick(item) {
    setResult(item);
    setError(null);
  }

  return (
    <>
      <Navbar
        onSearch={() => {}}
        onClear={() => {}}
        user={user}
        onLoginClick={() => setShowAuth(true)}
        onLogout={logout}
        searchPlaceholder="Search channels…"
      />

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <main className="link-checker-page">
        {/* ── Hero Section ── */}
        <section className="link-checker-hero">
          <div className="link-checker-hero-badge">
            <IconLink /> Link Checker
          </div>
          <h1 className="link-checker-title">Check Any Channel or Playlist Score</h1>
          <p className="link-checker-subtitle">
            Paste a YouTube channel or playlist URL below to instantly get a detailed trust score, 
            engagement analysis, and quality breakdown.
          </p>

          <form className="link-checker-form" onSubmit={handleSubmit}>
            <div className="link-checker-input-wrap">
              <span className="link-checker-input-icon"><IconLink /></span>
              <input
                type="text"
                className="link-checker-input"
                placeholder="Paste YouTube link… e.g. youtube.com/@mkbhd or youtube.com/playlist?list=PL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="link-checker-submit-btn"
                disabled={loading || !url.trim()}
              >
                {loading ? (
                  <span className="link-checker-spinner" />
                ) : (
                  <>
                    <IconSearch /> Check Score
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="link-checker-supported">
            <span className="link-checker-supported-label">Supported links:</span>
            <span className="link-checker-supported-tag"><IconChannel /> Channel</span>
            <span className="link-checker-supported-tag"><IconPlaylist /> Playlist</span>
          </div>
        </section>

        {/* ── Error ── */}
        {error && (
          <div className="link-checker-error">
            <span className="link-checker-error-icon">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* ── Loading Skeleton ── */}
        {loading && (
          <div className="link-checker-skeleton">
            <div className="link-checker-skeleton-avatar shimmer" />
            <div className="link-checker-skeleton-lines">
              <div className="link-checker-skeleton-line shimmer" style={{ width: "60%" }} />
              <div className="link-checker-skeleton-line shimmer" style={{ width: "40%" }} />
              <div className="link-checker-skeleton-line shimmer" style={{ width: "80%" }} />
              <div className="link-checker-skeleton-line shimmer" style={{ width: "50%" }} />
            </div>
            <div className="link-checker-skeleton-ring shimmer" />
          </div>
        )}

        {/* ── Channel Result ── */}
        {result && result.type === "channel" && (
          <div className="link-checker-result link-checker-result-enter">
            <div className="link-checker-result-header">
              <div className="link-checker-result-type-badge channel">
                <IconChannel /> Channel
              </div>
            </div>
            <div className="channel-card">
              <div className="channel-card-header">
                <img
                  className="channel-avatar"
                  src={result.data.thumbnail}
                  alt={`${result.data.name} avatar`}
                />
                <div className="channel-card-heading">
                  <div className="channel-name-row">
                    <p className="channel-name">{result.data.name}</p>
                    {result.data.verified && (
                      <span className="verified-badge" title="Verified channel">✓</span>
                    )}
                  </div>
                  <p className="channel-meta">
                    {formatCount(result.data.subscribers)} subscribers
                    {(result.data.country || result.data.language) && (
                      <span className="channel-locale-badge">
                        {[result.data.country, result.data.language?.toUpperCase()].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </p>
                </div>
                <div className="channel-card-topright">
                  <TrustRing score={result.data.trustScore} size={64} />
                </div>
              </div>

              <p className="channel-desc">{result.data.description}</p>

              <div className="stat-row">
                <span><strong>{formatCount(result.data.avgViewsPerVideo)}</strong> avg views</span>
                <span><strong>{result.data.uploadsLast30Days}</strong> uploads/30d</span>
                <span><strong>{result.data.videoCount}</strong> videos</span>
              </div>

              {result.data.redFlags && result.data.redFlags.length > 0 && (
                <div className="red-flags">
                  {result.data.redFlags.map((flag) => (
                    <div className="red-flag" key={flag}>
                      <span>⚠</span>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              )}

              <ScoreBreakdown breakdown={result.data.scoreBreakdown} />

              <div className="card-actions">
                <a
                  className="visit-btn"
                  href={result.data.channelUrl || `https://youtube.com/results?search_query=${encodeURIComponent(result.data.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit channel →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── Playlist Result ── */}
        {result && result.type === "playlist" && (
          <div className="link-checker-result link-checker-result-enter">
            <div className="link-checker-result-header">
              <div className="link-checker-result-type-badge playlist">
                <IconPlaylist /> Playlist
              </div>
            </div>
            <div className="channel-card">
              <div className="channel-card-header">
                <img
                  className="channel-avatar"
                  src={result.data.thumbnail}
                  alt={result.data.title}
                  style={{ borderRadius: "8px" }}
                />
                <div className="channel-card-heading">
                  <p className="channel-name">{result.data.title}</p>
                  <p className="channel-meta">
                    by {result.data.channelTitle}
                  </p>
                </div>
                <div className="channel-card-topright">
                  <TrustRing score={result.data.score} size={64} />
                </div>
              </div>

              <p className="channel-desc">{result.data.description}</p>

              <div className="stat-row">
                <span><strong>{result.data.videoCount}</strong> videos</span>
                <span><strong>{formatCount(result.data.estimatedTotalViews)}</strong> est. views</span>
                {formatDuration(result.data.estimatedTotalSeconds) && (
                  <span><strong>{formatDuration(result.data.estimatedTotalSeconds)}</strong></span>
                )}
                <span>{result.data.difficulty}</span>
                <span>{result.data.language}</span>
              </div>

              <PlaylistScoreBreakdown breakdown={result.data.scoreBreakdown} />

              <div className="card-actions">
                <a
                  className="visit-btn"
                  href={result.data.playlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open playlist →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── Recent Lookups ── */}
        {history.length > 0 && !loading && (
          <section className="link-checker-history">
            <h3 className="link-checker-history-title">Recent Lookups</h3>
            <div className="link-checker-history-list">
              {history.map((item) => (
                <button
                  key={item.data?.id}
                  className={`link-checker-history-item ${
                    result?.data?.id === item.data?.id ? "is-active" : ""
                  }`}
                  onClick={() => handleHistoryClick(item)}
                >
                  <img
                    className="link-checker-history-thumb"
                    src={item.data?.thumbnail}
                    alt=""
                  />
                  <div className="link-checker-history-info">
                    <span className="link-checker-history-name">
                      {item.data?.name || item.data?.title}
                    </span>
                    <span className="link-checker-history-type">
                      {item.type === "channel" ? "Channel" : "Playlist"} · Score: {item.data?.trustScore ?? item.data?.score}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Empty State ── */}
        {!result && !loading && !error && (
          <section className="link-checker-empty">
            <div className="link-checker-empty-icon">🔍</div>
            <p className="link-checker-empty-text">
              Paste any YouTube channel or playlist URL above to see a detailed quality score, 
              engagement metrics, and trust analysis.
            </p>
            <div className="link-checker-examples">
              <p className="link-checker-examples-label">Try these examples:</p>
              <button
                className="link-checker-example-btn"
                onClick={() => setUrl("https://www.youtube.com/@mkbhd")}
              >
                youtube.com/@mkbhd
              </button>
              <button
                className="link-checker-example-btn"
                onClick={() => setUrl("https://www.youtube.com/@veritasium")}
              >
                youtube.com/@veritasium
              </button>
              <button
                className="link-checker-example-btn"
                onClick={() => setUrl("https://www.youtube.com/@firabordi")}
              >
                youtube.com/@firabordi
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
