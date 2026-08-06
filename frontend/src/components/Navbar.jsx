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

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">DockOrbit</Link>

        <nav className="navbar-pages">
          <Link
            to="/"
            className={`navbar-page-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Channels
          </Link>
          <Link
            to="/playlists"
            className={`navbar-page-link ${location.pathname === "/playlists" ? "active" : ""}`}
          >
            Playlist Finder
          </Link>
          <Link
            to="/check"
            className={`navbar-page-link ${location.pathname === "/check" ? "active" : ""}`}
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
              <button className="profile-logout-btn" onClick={onLogout}>
                Log out
              </button>
            </div>
          ) : (
            <button className="navbar-login-btn" onClick={onLoginClick}>
              Log in / Sign up
            </button>
          )}
        </div>
      </div>
    </header>
  );
}