import { Link, useLocation } from "react-router-dom";

export default function BottomNav({ onSavedClick, savedCount = 0 }) {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <Link
        to="/"
        className={`bottom-nav-item ${location.pathname === "/" ? "active" : ""}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="15" rx="3" />
          <path d="m10 9 5 3-5 3V9z" fill="currentColor" />
        </svg>
        <span>Channels</span>
      </Link>

      <Link
        to="/playlists"
        className={`bottom-nav-item ${location.pathname === "/playlists" ? "active" : ""}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        <span>Playlists</span>
      </Link>

      <Link
        to="/check"
        className={`bottom-nav-item ${location.pathname === "/check" ? "active" : ""}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        <span>Scores</span>
      </Link>

      <button
        onClick={onSavedClick}
        className={`bottom-nav-item ${location.pathname === "/saved" ? "active" : ""}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span>Saved {savedCount > 0 ? `(${savedCount})` : ""}</span>
      </button>
    </nav>
  );
}
