import React, { useState, useEffect, useCallback } from 'react';
import { PLAYLISTS } from '../data/dockorbitData.js';
import PlaylistCard from '../components/PlaylistCard.jsx';

export default function PlaylistDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [playlists, setPlaylists] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPlaylists = useCallback(async (isLoadMore = false, token = '') => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const q = searchQuery.trim() || (selectedCategory !== 'All' ? selectedCategory : 'programming full course');
      const params = new URLSearchParams({ q });
      if (token) params.append('pageToken', token);

      const res = await fetch(`/api/playlists/search?${params.toString()}`);
      if (!res.ok) throw new Error('Playlist search failed');
      const data = await res.json();

      const fetchedPlaylists = data.playlists || [];
      const tokenReceived = data.nextPageToken || null;

      if (isLoadMore) {
        setPlaylists(prev => [...prev, ...fetchedPlaylists]);
      } else {
        setPlaylists(fetchedPlaylists.length > 0 ? fetchedPlaylists : PLAYLISTS);
      }
      setNextPageToken(tokenReceived);
    } catch (err) {
      console.warn('YouTube Playlist API error, using local fallback:', err.message);
      if (!isLoadMore) {
        let filtered = PLAYLISTS.filter(pl => {
          const matchesSearch = !searchQuery || pl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                pl.creator.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesDiff = selectedDifficulty === 'All' || pl.difficulty.includes(selectedDifficulty);
          const matchesCat = selectedCategory === 'All' || pl.category === selectedCategory;
          return matchesSearch && matchesDiff && matchesCat;
        });
        setPlaylists(filtered);
        setNextPageToken(null);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, selectedDifficulty, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPlaylists(false, '');
    }, 350);
    return () => clearTimeout(timer);
  }, [fetchPlaylists]);

  const handleLoadMore = () => {
    if (nextPageToken) {
      fetchPlaylists(true, nextPageToken);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>📚</span>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
            Find Your Next Playlist
          </h1>
        </div>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
          Curated YouTube learning roadmaps evaluated for topic depth, pacing, and estimated completion times.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="soft-card-static" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="soft-inset" style={{ display: 'flex', alignItems: 'center', padding: '6px 14px', width: '320px', maxWidth: '100%', gap: '8px' }}>
          <span style={{ color: 'var(--text-subtle)' }}>🔍</span>
          <input
            type="text"
            placeholder="Search YouTube playlists (e.g. React, Python, Math)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '13.5px', width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="soft-btn"
            style={{ fontSize: '13px' }}
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="soft-btn"
            style={{ fontSize: '13px' }}
          >
            <option value="All">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Education">Education</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="soft-card-static" style={{ padding: '48px', textAlign: 'center' }}>
          <span style={{ fontSize: '28px' }}>⏳</span>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>Fetching real YouTube playlist data...</p>
        </div>
      ) : (
        /* Playlist Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {playlists.length > 0 ? (
            playlists.map((playlist, idx) => (
              <PlaylistCard key={playlist.id || idx} playlist={playlist} />
            ))
          ) : (
            <div className="soft-card-static" style={{ padding: '48px', textAlign: 'center', gridColumn: '1 / -1' }}>
              <span style={{ fontSize: '32px' }}>🔍</span>
              <h3 style={{ margin: '12px 0 6px 0', fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
                No playlists found for your search
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
                Try searching for topics like "JavaScript full course", "Data Structures", or "Calculus".
              </p>
            </div>
          )}
        </div>
      )}

      {/* Load More Button */}
      {nextPageToken && !loading && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="soft-btn-primary"
            style={{ padding: '12px 28px', fontSize: '14px', minWidth: '180px', justifyContent: 'center' }}
          >
            {loadingMore ? 'Loading Next Batch...' : 'Load More Playlists →'}
          </button>
        </div>
      )}
    </div>
  );
}
