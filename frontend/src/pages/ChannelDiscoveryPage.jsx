import React, { useState, useEffect, useCallback } from 'react';
import { CHANNELS } from '../data/dockorbitData.js';
import ChannelCard from '../components/ChannelCard.jsx';
import FilterBar from '../components/FilterBar.jsx';

export default function ChannelDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [minScore, setMinScore] = useState('0');
  const [sortBy, setSortBy] = useState('Quality');
  const [viewMode, setViewMode] = useState('grid');

  const [channels, setChannels] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchChannels = useCallback(async (isLoadMore = false, token = '') => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      let endpoint = '';
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        endpoint = '/api/search';
        params.append('q', searchQuery.trim());
      } else {
        endpoint = '/api/channels';
        const catSlug = selectedCategory === 'All' ? 'tech-reviews' : selectedCategory.toLowerCase().replace(/[^a-z0-9]/g, '-');
        params.append('category', catSlug);
      }

      if (sortBy === 'Fast Growing') params.append('sort', 'subscribers');
      if (sortBy === 'Most Consistent') params.append('sort', 'recent');
      if (token) params.append('pageToken', token);

      const res = await fetch(`${endpoint}?${params.toString()}`);
      if (!res.ok) throw new Error('API fetch failed');
      const data = await res.json();

      const fetchedChannels = data.channels || [];
      const tokenReceived = data.nextPageToken || null;

      if (isLoadMore) {
        setChannels(prev => [...prev, ...fetchedChannels]);
      } else {
        setChannels(fetchedChannels.length > 0 ? fetchedChannels : CHANNELS);
      }
      setNextPageToken(tokenReceived);
    } catch (err) {
      console.warn('Backend API fetch error, using local dataset fallback:', err.message);
      if (!isLoadMore) {
        // Fallback to local dataset
        let filtered = CHANNELS.filter(ch => {
          const matchesSearch = !searchQuery || ch.name.toLowerCase().includes(searchQuery.toLowerCase()) || ch.category.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCat = selectedCategory === 'All' || ch.category === selectedCategory;
          const matchesCountry = selectedCountry === 'All' || ch.country === selectedCountry;
          const matchesScore = (ch.qualityScore || 0) >= parseInt(minScore);
          return matchesSearch && matchesCat && matchesCountry && matchesScore;
        });
        setChannels(filtered);
        setNextPageToken(null);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, selectedCategory, selectedCountry, minScore, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchChannels(false, '');
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchChannels]);

  const handleLoadMore = () => {
    if (nextPageToken) {
      fetchChannels(true, nextPageToken);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>📺</span>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              Explore Channels
            </h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
            Browse live YouTube channels ranked by objective quality, engagement rates, and content consistency.
          </p>
        </div>

        {/* View Switcher */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setViewMode('grid')}
            className="soft-btn"
            style={{ padding: '8px 14px', background: viewMode === 'grid' ? 'var(--primary-light)' : 'var(--bg-surface)', color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700 }}
          >
            📱 Grid View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="soft-btn"
            style={{ padding: '8px 14px', background: viewMode === 'list' ? 'var(--primary-light)' : 'var(--bg-surface)', color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700 }}
          >
            📑 List View
          </button>
        </div>
      </div>

      {/* Filter Engine */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        minScore={minScore}
        onMinScoreChange={setMinScore}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Loading State */}
      {loading ? (
        <div className="soft-card-static" style={{ padding: '48px', textAlign: 'center' }}>
          <span style={{ fontSize: '28px' }}>⏳</span>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>Fetching real YouTube channel data...</p>
        </div>
      ) : (
        /* Grid or List Layout */
        <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr', gap: '20px' }}>
          {channels.length > 0 ? (
            channels.map((channel, idx) => (
              <ChannelCard key={channel.id || idx} channel={channel} rank={idx + 1} />
            ))
          ) : (
            <div className="soft-card-static" style={{ padding: '48px', textAlign: 'center', gridColumn: '1 / -1' }}>
              <span style={{ fontSize: '32px' }}>🔍</span>
              <h3 style={{ margin: '12px 0 6px 0', fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
                No channels match your query
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
                Try searching for a different keyword like "coding", "physics", or "cooking".
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
            {loadingMore ? 'Loading Next Batch...' : 'Load More Channels →'}
          </button>
        </div>
      )}
    </div>
  );
}