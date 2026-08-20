import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const second = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + second).toUpperCase();
}

export default function Navbar({
  onSearch,
  onClear,
  user,
  onLoginClick,
  onLogout,
  searchPlaceholder = "Search any topic...",
}) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-top-row">
          <button
            className="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>

          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <span className="brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2">
                <circle cx="12" cy="12" r="9" strokeOpacity="0.4" />
                <path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round" />
              </svg>
            </span>
            DockOrbit
          </Link>

          <div className="navbar-account">
            {user ? (
              <div className="profile-menu">
                <button className="profile-avatar-btn" title={user.name}>
                  {user.avatarData ? (
                    <img src={user.avatarData} alt={user.name} className="profile-avatar-img" />
                  ) : (
                    getInitials(user.name)
                  )}
                </button>
                <button className="profile-logout-btn" onClick={() => { closeMenu(); onLogout(); }}>
                  Log out
                </button>
              </div>
            ) : (
              <button className="navbar-login-icon-btn" onClick={() => { closeMenu(); onLoginClick(); }} aria-label="Log in">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="login-btn-text">Log in / Sign up</span>
              </button>
            )}
          </div>
        </div>

        <nav className={`navbar-pages ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <Link
            to="/"
            className={`navbar-page-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={closeMenu}
          >
            Channels
          </Link>
          <Link
            to="/playlists"
            className={`navbar-page-link ${location.pathname === "/playlists" ? "active" : ""}`}
            onClick={closeMenu}
          >
            Playlist Finder
          </Link>
          <Link
            to="/check"
            className={`navbar-page-link ${location.pathname === "/check" ? "active" : ""}`}
            onClick={closeMenu}
          >
            Check Score
          </Link>
        </nav>

        <div className="navbar-search">
          <SearchBar onSearch={onSearch} onClear={onClear} placeholder={searchPlaceholder} />
        </div>
      </div>
    </header>
  );
}