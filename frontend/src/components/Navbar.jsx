import { useState } from "react";
import { Link } from "react-router-dom";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const second = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + second).toUpperCase();
}

export default function Navbar({ user, onLoginClick, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="top-app-bar">
      {/* Mobile Header Bar */}
      <div className="mobile-header-bar flex md:hidden justify-between items-center w-full px-4 h-16 sticky top-0 z-50">
        <Link to="/" className="font-bold text-xl text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-[24px]">satellite_alt</span>
          DockOrbit
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 hover:bg-surface-container-low rounded-full"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          <span className="material-symbols-outlined text-2xl p-1 cursor-pointer">notifications</span>
          <span className="material-symbols-outlined text-2xl p-1 cursor-pointer">settings</span>
          <div className="w-8 h-8 rounded-full border border-outline-variant overflow-hidden cursor-pointer">
            {user?.avatarData ? (
              <img src={user.avatarData} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>

      {/* Desktop Top Header Actions */}
      <div className="hidden md:flex justify-between items-center mb-6">
        <div className="flex-1 max-w-2xl"></div>
        <div className="flex items-center gap-6">
          <button className="text-outline hover:text-primary transition-colors" title="Notifications">
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </button>
          <Link to="/about" className="text-outline hover:text-primary transition-colors" title="Settings">
            <span className="material-symbols-outlined text-2xl">settings</span>
          </Link>
          {user ? (
            <div
              className="w-10 h-10 rounded-full bg-surface-variant border-2 border-surface neumorphic-card overflow-hidden cursor-pointer flex items-center justify-center font-bold text-primary"
              title={user.name}
              onClick={onLogout}
            >
              {user.avatarData ? (
                <img src={user.avatarData} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(user.name)
              )}
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-full bg-surface-variant border-2 border-surface neumorphic-card overflow-hidden cursor-pointer flex items-center justify-center text-primary"
              title="Sign In"
              onClick={onLoginClick}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer md:hidden">
          <Link to="/" className="mobile-drawer-item" onClick={() => setMobileMenuOpen(false)}>
            <span className="material-symbols-outlined">explore</span> Discover
          </Link>
          <Link to="/playlists" className="mobile-drawer-item" onClick={() => setMobileMenuOpen(false)}>
            <span className="material-symbols-outlined">playlist_play</span> Playlists
          </Link>
          <Link to="/check" className="mobile-drawer-item" onClick={() => setMobileMenuOpen(false)}>
            <span className="material-symbols-outlined">analytics</span> Analyzer
          </Link>
          <Link to="/about" className="mobile-drawer-item" onClick={() => setMobileMenuOpen(false)}>
            <span className="material-symbols-outlined">settings</span> Settings
          </Link>
        </div>
      )}
    </header>
  );
}