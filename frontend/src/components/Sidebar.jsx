import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function Sidebar() {
  const { theme, toggleTheme, user, bookmarks } = useApp();

  const mainLinks = [
    { to: '/', label: 'Discover', icon: '🧭' },
    { to: '/channels', label: 'Channels', icon: '📺' },
    { to: '/playlists', label: 'Playlists', icon: '📚' },
    { to: '/analyzer', label: 'Link Analyzer', icon: '⚡' },
    { to: '/compare', label: 'Compare Matrix', icon: '📊' },
    { to: '/bookmarks', label: 'Your Library', icon: '🔖', badge: bookmarks.length },
    { to: '/categories', label: 'Categories', icon: '🏷️' }
  ];

  const secondaryLinks = [
    { to: '/user-dashboard', label: 'User Dashboard', icon: '👤' },
    { to: '/login', label: 'Sign In / Account', icon: '🔑' }
  ];

  return (
    <aside className="desktop-sidebar">
      {/* Brand Header */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)' }}>
          DO
        </div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>
            DockOrbit
          </h1>
          <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>Quality Metrics Platform</span>
        </div>
      </div>

      {/* Main Navigation List */}
      <div style={{ padding: '16px 12px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 700, padding: '0 12px 6px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Navigation
        </span>

        {mainLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              background: isActive ? 'var(--primary-light)' : 'transparent',
              transition: 'all 0.2s ease'
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </div>
            {link.badge > 0 && (
              <span style={{ background: 'var(--primary)', color: '#ffffff', padding: '2px 7px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700 }}>
                {link.badge}
              </span>
            )}
          </NavLink>
        ))}

        <div style={{ margin: '16px 0 8px 0', borderTop: '1px solid var(--border-light)' }} />

        <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 700, padding: '0 12px 6px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Personal
        </span>

        {secondaryLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              background: isActive ? 'var(--primary-light)' : 'transparent',
              transition: 'all 0.2s ease'
            })}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Footer Profile & Theme Toggle */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface-soft)' }}>
        <Link to="/user-dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <img src={user.avatar} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>{user.plan}</div>
          </div>
        </Link>

        <button
          onClick={toggleTheme}
          className="soft-btn"
          style={{ padding: '6px 8px', borderRadius: '8px' }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </aside>
  );
}
