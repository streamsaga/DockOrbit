import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function Navbar({ onOpenMobileDrawer }) {
  const { searchQuery, setSearchQuery, compareChannels, comparePlaylists, user } = useApp();
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchQuery(localQuery.trim());
      navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
    }
  };

  const totalCompareCount = compareChannels.length + comparePlaylists.length;

  return (
    <header className="top-navbar">
      {/* Mobile Menu Icon & Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onOpenMobileDrawer}
          className="soft-btn mobile-only-btn"
          style={{ padding: '8px', display: 'none' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
          <div className="soft-inset" style={{ display: 'flex', alignItems: 'center', padding: '6px 14px', width: '320px', gap: '8px' }}>
            <span style={{ color: 'var(--text-subtle)' }}>🔍</span>
            <input
              type="text"
              placeholder="Search channels, playlists, topics..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '13.5px', width: '100%' }}
            />
          </div>
        </form>
      </div>

      {/* Actions Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Link to="/compare" className="soft-btn" style={{ padding: '8px 14px', position: 'relative' }}>
          <span>📊 Compare</span>
          {totalCompareCount > 0 && (
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--primary)', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '9999px' }}>
              {totalCompareCount}
            </span>
          )}
        </Link>

        <Link to="/analyzer" className="soft-btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
          ⚡ Analyze Link
        </Link>

        {user ? (
          <Link to="/user-dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={user.avatarData || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4F46E5&color=fff`} alt={user.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-light)' }} />
          </Link>
        ) : (
          <Link to="/login" className="soft-btn" style={{ padding: '8px 14px', fontSize: '13px' }}>
            🔑 Sign In
          </Link>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .mobile-only-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
}