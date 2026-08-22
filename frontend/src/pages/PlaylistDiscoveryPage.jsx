import React, { useState, useMemo } from 'react';
import { PLAYLISTS } from '../data/dockorbitData.js';
import PlaylistCard from '../components/PlaylistCard.jsx';

const PAGE_SIZE = 6;

export default function PlaylistDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  const filteredPlaylists = useMemo(() => {
    return PLAYLISTS.filter(pl => {
      const matchesSearch = pl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            pl.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (pl.topicsCovered && pl.topicsCovered.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesDiff = selectedDifficulty === 'All' || pl.difficulty.includes(selectedDifficulty);
      const matchesCat = selectedCategory === 'All' || pl.category === selectedCategory;
      return matchesSearch && matchesDiff && matchesCat;
    });
  }, [searchQuery, selectedDifficulty, selectedCategory]);

  const visiblePlaylists = useMemo(() => {
    return filteredPlaylists.slice(0, visibleCount);
  }, [filteredPlaylists, visibleCount]);

  const hasMore = visibleCount < filteredPlaylists.length;

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 350);
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
          Curated learning roadmaps evaluated for topic depth, pacing, and estimated completion times.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="soft-card-static" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="soft-inset" style={{ display: 'flex', alignItems: 'center', padding: '6px 14px', width: '320px', maxWidth: '100%', gap: '8px' }}>
          <span style={{ color: 'var(--text-subtle)' }}>🔍</span>
          <input
            type="text"
            placeholder="Search playlists, topics (e.g. React, Docker)..."
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

      {/* Playlist Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {visiblePlaylists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="soft-btn-primary"
            style={{ padding: '12px 28px', fontSize: '14px', minWidth: '180px', justifyContent: 'center' }}
          >
            {loadingMore ? 'Loading...' : `Load More Playlists (${filteredPlaylists.length - visibleCount} remaining)`}
          </button>
        </div>
      )}
    </div>
  );
}
