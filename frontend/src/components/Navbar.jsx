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
  searchPlaceholder,
}) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-header-left">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>DockOrbit</Link>

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

        <div className="navbar-account">
          {user ? (
            <div className="profile-menu">
              <div className="profile-avatar">
                {user.avatarData ? (
                  <img src={user.avatarData} alt={user.name} className="profile-avatar-img" />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <span className="profile-name">{user.name}</span>
              <button className="profile-logout-btn" onClick={() => { closeMenu(); onLogout(); }}>
                Log out
              </button>
            </div>
          ) : (
            <button className="navbar-login-btn" onClick={() => { closeMenu(); onLoginClick(); }}>
              Log in / Sign up
            </button>
          )}
        </div>
      </div>
    </header>
  );
}