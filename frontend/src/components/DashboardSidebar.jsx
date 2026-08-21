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
    <aside className="dashboard-sidebar-panel">
      {/* Brand Header */}
      <div className="sidebar-brand-box">
        <div className="sidebar-brand-icon">
          <span className="material-symbols-outlined text-[24px]">satellite_alt</span>
        </div>
        <div>
          <h1 className="sidebar-brand-title">DockOrbit</h1>
          <p className="sidebar-brand-sub">Intelligent Discovery</p>
        </div>
      </div>

      {/* New Analysis CTA */}
      <Link to="/check" className="sidebar-new-btn">
        <span className="material-symbols-outlined text-[18px]">add</span>
        New Analysis
      </Link>

      {/* Navigation Links */}
      <ul className="sidebar-nav-list">
        <li>
          <Link
            to="/"
            className={`sidebar-nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined text-[20px]">explore</span>
            Discover
          </Link>
        </li>
        <li>
          <Link
            to="/"
            className={`sidebar-nav-link ${location.pathname === "/channels" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined text-[20px]">subscriptions</span>
            Channels
          </Link>
        </li>
        <li>
          <Link
            to="/playlists"
            className={`sidebar-nav-link ${location.pathname === "/playlists" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined text-[20px]">playlist_play</span>
            Playlists
          </Link>
        </li>
        <li>
          <Link
            to="/check"
            className={`sidebar-nav-link ${location.pathname === "/check" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined text-[20px]">analytics</span>
            Analyzer
          </Link>
        </li>
        <li>
          <button
            onClick={onSavedClick}
            className={`sidebar-nav-link ${location.pathname === "/saved" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
            Bookmarks {savedCount > 0 ? `(${savedCount})` : ""}
          </button>
        </li>
      </ul>

      {/* Footer Settings & Auth */}
      <div className="sidebar-footer-links">
        <Link to="/about" className="sidebar-nav-link">
          <span className="material-symbols-outlined text-[20px]">settings</span>
          Settings
        </Link>

        {user ? (
          <button onClick={onLogout} className="sidebar-nav-link">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Log out
          </button>
        ) : (
          <button onClick={onLoginClick} className="sidebar-nav-link">
            <span className="material-symbols-outlined text-[20px]">login</span>
            Sign in
          </button>
        )}
      </div>
    </aside>
  );
}
