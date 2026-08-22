import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function Navbar({ onOpenMobileDrawer }) {
  const { searchQuery, setSearchQuery, compareChannels, comparePlaylists, user } = useApp();
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search suggestions fetch
  useEffect(() => {
    const trimmed = localQuery.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetch(`/api/suggestions?q=${encodeURIComponent(trimmed)}`);
        if (!res.ok) throw new Error('Suggestions request failed');
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } catch (err) {
        console.warn('Autocomplete fetch failed:', err.message);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery]);

  // Click outside listener to close suggestions
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelectSuggestion(suggestions[selectedIndex]);
      return;
    }
    if (localQuery.trim()) {
      setSearchQuery(localQuery.trim());
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (item) => {
    setShowSuggestions(false);
    if (item.url) {
      navigate(item.url);
    } else {
      setSearchQuery(item.name);
      navigate(`/search?q=${encodeURIComponent(item.name)}`);
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

        {/* Live Search Autocomplete Box */}
        <div ref={searchContainerRef} style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
            <div className="soft-inset" style={{ display: 'flex', alignItems: 'center', padding: '6px 14px', width: '100%', gap: '8px' }}>
              <span style={{ color: 'var(--text-subtle)' }}>🔍</span>
              <input
                type="text"
                placeholder="Search channels, playlists, topics..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onFocus={() => localQuery.trim().length >= 2 && setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '13.5px', width: '100%' }}
              />
              {loadingSuggestions && (
                <span className="spinner" style={{ width: '12px', height: '12px', border: '2px solid var(--text-subtle)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              )}
            </div>
          </form>

          {/* Dropdown Suggestions List */}
          {showSuggestions && (
            <div
              className="soft-card-static"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: 0,
                background: 'var(--bg-surface)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                borderRadius: '12px',
                zIndex: 1000,
                padding: '6px 0',
                maxHeight: '320px',
                overflowY: 'auto'
              }}
            >
              {suggestions.length > 0 ? (
                suggestions.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id || idx}
                      onClick={() => handleSelectSuggestion(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      style={{
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        gap: '10px',
                        cursor: 'pointer',
                        background: isSelected ? 'var(--primary-light)' : 'transparent',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.name} style={{ width: '28px', height: '28px', borderRadius: item.type === 'channel' ? '50%' : '6px', objectFit: 'cover', flexShrink: 0 }} />
                        ) : (
                          <span style={{ fontSize: '16px', flexShrink: 0 }}>🔍</span>
                        )}
                        <span style={{ fontSize: '13px', fontWeight: 600, color: isSelected ? 'var(--primary)' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </span>
                      </div>

                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: item.type === 'channel' ? 'rgba(79, 70, 229, 0.12)' : item.type === 'playlist' ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-surface-soft)',
                          color: item.type === 'channel' ? '#4F46E5' : item.type === 'playlist' ? '#10B981' : 'var(--text-muted)'
                        }}
                      >
                        {item.type}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No matching suggestions found
                </div>
              )}
            </div>
          )}
        </div>
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
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
          .mobile-only-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
}