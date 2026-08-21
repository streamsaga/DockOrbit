import { Link, useLocation } from "react-router-dom";

export default function DashboardSidebar({
  user,
  onLoginClick,
  onLogout,
  onSavedClick,
  savedCount = 0,
}) {
  const location = useLocation();

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand-wrap">
        <Link to="/" className="sidebar-brand">
          <span className="brand-icon">
            <svg width="28" height="28" viewBox="0 0 512 512" fill="none">
              <circle cx="256" cy="256" r="88" fill="none" stroke="var(--accent, #00F0D0)" strokeWidth="40" />
              <path d="M 134 336 A 180 180 0 1 1 378 176" fill="none" stroke="var(--accent, #00F0D0)" strokeWidth="40" strokeLinecap="round" />
              <path d="M 378 176 A 180 180 0 0 1 134 336" fill="none" stroke="var(--accent, #00F0D0)" strokeWidth="40" strokeLinecap="round" />
              <g transform="translate(372, 140)">
                <rect x="-45" y="-45" width="90" height="90" rx="28" fill="var(--accent, #00F0D0)" />
                <circle cx="0" cy="0" r="18" fill="#252932" />
              </g>
              <g transform="translate(140, 372)">
                <rect x="-45" y="-45" width="90" height="90" rx="28" fill="var(--accent, #00F0D0)" />
                <circle cx="0" cy="0" r="18" fill="#252932" />
              </g>
            </svg>
          </span>
          <span className="brand-text">DockOrbit</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`sidebar-nav-item ${location.pathname === "/" ? "active" : ""}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Home</span>
        </Link>

        <Link
          to="/playlists"
          className={`sidebar-nav-item ${location.pathname === "/playlists" ? "active" : ""}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <span>Playlists</span>
        </Link>

        <Link
          to="/check"
          className={`sidebar-nav-item ${location.pathname === "/check" ? "active" : ""}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Check Trust</span>
        </Link>

        <button
          onClick={onSavedClick}
          className={`sidebar-nav-item ${location.pathname === "/saved" ? "active" : ""}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>Saved {savedCount > 0 ? `(${savedCount})` : ""}</span>
        </button>

        <Link
          to="/about"
          className={`sidebar-nav-item ${location.pathname === "/about" ? "active" : ""}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>Settings</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <Link to="/check" className="sidebar-action-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span>Add product</span>
        </Link>

        {user ? (
          <button className="sidebar-logout-btn" onClick={onLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log out</span>
          </button>
        ) : (
          <button className="sidebar-logout-btn" onClick={onLoginClick}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span>Log in</span>
          </button>
        )}
      </div>
    </aside>
  );
}
