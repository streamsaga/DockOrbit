import React, { useState, useMemo } from 'react';
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

  const filteredChannels = useMemo(() => {
    return CHANNELS.filter(ch => {
      const matchesSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ch.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || ch.category === selectedCategory;
      const matchesCountry = selectedCountry === 'All' || ch.country === selectedCountry;
      const matchesScore = ch.qualityScore >= parseInt(minScore);

      return matchesSearch && matchesCat && matchesCountry && matchesScore;
    }).sort((a, b) => {
      if (sortBy === 'Quality') return b.qualityScore - a.qualityScore;
      if (sortBy === 'Most Engaged') return b.engagementValue - a.engagementValue;
      if (sortBy === 'Most Viewed') return b.avgViewsCount - a.avgViewsCount;
      if (sortBy === 'Fast Growing') return b.subscribersCount - a.subscribersCount;
      if (sortBy === 'Most Consistent') return b.consistencyScore - a.consistencyScore;
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedCountry, minScore, sortBy]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
            Explore Channels
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: 0 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr', gap: '20px' }}>
        {filteredChannels.length > 0 ? (
          filteredChannels.map((channel, idx) => (
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
    </div>
  );
}