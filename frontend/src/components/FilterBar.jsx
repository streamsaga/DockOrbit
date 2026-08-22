import React from 'react';

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  selectedCountry,
  onCountryChange,
  minScore,
  onMinScoreChange
}) {
  return (
    <div className="soft-card-static" style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Search Input */}
      <div className="soft-inset" style={{ display: 'flex', alignItems: 'center', padding: '6px 14px', width: '280px', gap: '8px' }}>
        <span style={{ color: 'var(--text-subtle)' }}>🔍</span>
        <input
          type="text"
          placeholder="Filter channels & keywords..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '13px', width: '100%' }}
        />
      </div>

      {/* Dropdown Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="soft-btn"
          style={{ fontSize: '13px', outline: 'none' }}
        >
          <option value="All">All Categories</option>
          <option value="Programming">Programming</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="Technology">Technology</option>
          <option value="Education">Education</option>
          <option value="Design">Design</option>
          <option value="Finance">Finance</option>
          <option value="Science">Science</option>
          <option value="Business">Business</option>
          <option value="Gaming">Gaming</option>
          <option value="Entertainment">Entertainment</option>
        </select>

        {/* Country */}
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="soft-btn"
          style={{ fontSize: '13px', outline: 'none' }}
        >
          <option value="All">All Countries</option>
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Global">Global</option>
        </select>

        {/* Min Score */}
        <select
          value={minScore}
          onChange={(e) => onMinScoreChange(e.target.value)}
          className="soft-btn"
          style={{ fontSize: '13px', outline: 'none' }}
        >
          <option value="0">Any Quality Score</option>
          <option value="95">95+ Exceptional</option>
          <option value="90">90+ Excellent</option>
          <option value="85">85+ Strong</option>
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="soft-btn"
          style={{ fontSize: '13px', outline: 'none', color: 'var(--primary)', fontWeight: 700 }}
        >
          <option value="Quality">Sort: Quality Score</option>
          <option value="Most Engaged">Sort: Most Engaged</option>
          <option value="Fast Growing">Sort: Fast Growing</option>
          <option value="Most Consistent">Sort: Most Consistent</option>
          <option value="Most Viewed">Sort: Most Viewed</option>
        </select>
      </div>
    </div>
  );
}
