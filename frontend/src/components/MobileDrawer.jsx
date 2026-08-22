import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function MobileDrawer({ isOpen, onClose }) {
  const { theme, toggleTheme, user } = useApp();

  if (!isOpen) return null;

  const links = [
    { to: '/', label: 'Discover', icon: '🧭' },
    { to: '/channels', label: 'Channels', icon: '📺' },
    { to: '/playlists', label: 'Playlists', icon: '📚' },
    { to: '/analyzer', label: 'Link Analyzer', icon: '⚡' },
    { to: '/compare', label: 'Compare Matrix', icon: '📊' },
    { to: '/bookmarks', label: 'Your Library', icon: '🔖' },
    { to: '/categories', label: 'Categories', icon: '🏷️' },
    { to: '/user-dashboard', label: 'User Dashboard', icon: '👤' },
    { to: '/login', label: 'Account / Sign In', icon: '🔑' }
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90, display: 'flex' }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }} />

      {/* Drawer Body */}
      <div style={{ position: 'relative', width: '280px', height: '100%', background: 'var(--bg-surface)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 91, boxShadow: '4px 0 20px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              DO
            </div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>DockOrbit</span>
          </div>
          <button onClick={onClose} className="soft-btn" style={{ padding: '6px 10px' }}>✕</button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto' }}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--primary)' : 'var(--text-main)',
                background: isActive ? 'var(--primary-light)' : 'transparent'
              })}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={user.avatar} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{user.name}</span>
          </div>
          <button onClick={toggleTheme} className="soft-btn" style={{ padding: '6px 10px' }}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </div>
  );
}
