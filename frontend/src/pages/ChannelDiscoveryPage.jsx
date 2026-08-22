import React, { useState, useMemo } from 'react';
import { CHANNELS } from '../data/dockorbitData.js';
import ChannelCard from '../components/ChannelCard.jsx';
import FilterBar from '../components/FilterBar.jsx';

const PAGE_SIZE = 6;

export default function ChannelDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [minScore, setMinScore] = useState('0');
  const [sortBy, setSortBy] = useState('Quality');
  const [viewMode, setViewMode] = useState('grid');

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  const filteredChannels = useMemo(() => {
    return CHANNELS.filter(ch => {
      const matchesSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ch.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || ch.category === selectedCategory;
      const matchesCountry = selectedCountry === 'All' || ch.country === selectedCountry;
      const matchesScore = (ch.qualityScore || ch.trustScore || 0) >= parseInt(minScore);

      return matchesSearch && matchesCat && matchesCountry && matchesScore;
    }).sort((a, b) => {
      if (sortBy === 'Quality') return (b.qualityScore || 0) - (a.qualityScore || 0);
      if (sortBy === 'Most Engaged') return (b.engagementValue || 0) - (a.engagementValue || 0);
      if (sortBy === 'Most Viewed') return (b.avgViewsCount || 0) - (a.avgViewsCount || 0);
      if (sortBy === 'Fast Growing') return (b.subscribersCount || 0) - (a.subscribersCount || 0);
      if (sortBy === 'Most Consistent') return (b.consistencyScore || 0) - (a.consistencyScore || 0);
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedCountry, minScore, sortBy]);

  const visibleChannels = useMemo(() => {
    return filteredChannels.slice(0, visibleCount);
  }, [filteredChannels, visibleCount]);

  const hasMore = visibleCount < filteredChannels.length;

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>📺</span>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              Explore Channels
            </h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
            Browse YouTube channels ranked by objective quality, engagement rates, and content consistency.
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

      {/* Grid or List Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr', gap: '20px' }}>
        {visibleChannels.length > 0 ? (
          visibleChannels.map((channel, idx) => (
            <ChannelCard key={channel.id} channel={channel} rank={idx + 1} />
          ))
        ) : (
          <div className="soft-card-static" style={{ padding: '48px', textAlign: 'center', gridColumn: '1 / -1' }}>
            <span style={{ fontSize: '32px' }}>🔍</span>
            <h3 style={{ margin: '12px 0 6px 0', fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
              No channels match your filters
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
              Try adjusting your category, quality score, or search keywords.
            </p>
          </div>
        )}
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
            {loadingMore ? 'Loading...' : `Load More Channels (${filteredChannels.length - visibleCount} remaining)`}
          </button>
        </div>
      )}
    </div>
  );
}