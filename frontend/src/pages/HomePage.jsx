import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES, CHANNELS, PLAYLISTS } from '../data/dockorbitData.js';
import ChannelCard from '../components/ChannelCard.jsx';
import PlaylistCard from '../components/PlaylistCard.jsx';
import CategoryCard from '../components/CategoryCard.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function HomePage() {
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();
  const { setSearchQuery } = useApp();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      setSearchQuery(heroSearch.trim());
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      {/* Hero Section */}
      <section className="soft-card-static hero-card" style={{ padding: '56px 36px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--primary-light) 100%)' }}>
        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'var(--bg-surface)', padding: '6px 14px', borderRadius: '9999px', boxShadow: 'var(--shadow-soft-sm)' }}>
          Data-Driven Content Intelligence
        </span>

        <h1 className="hero-heading" style={{ fontSize: '42px', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em', lineHeight: 1.15, maxWidth: '800px' }}>
          Discover Better YouTube Content
        </h1>

        <p className="hero-sub" style={{ fontSize: '18px', color: 'var(--text-muted)', margin: 0, maxWidth: '620px', lineHeight: 1.5 }}>
          Find high-value channels and playlists worth your time using objective 0–100 reliability scores instead of vanity metrics alone.
        </p>

        {/* Hero Search Bar */}
        <form onSubmit={handleHeroSearch} style={{ width: '100%', maxWidth: '640px', marginTop: '12px' }}>
          <div className="soft-card hero-search-card" style={{ display: 'flex', alignItems: 'center', padding: '8px 12px 8px 20px', gap: '12px', borderRadius: '16px' }}>
            <span style={{ fontSize: '20px', color: 'var(--text-subtle)' }}>🔍</span>
            <input
              type="text"
              placeholder="Search channels, playlists, topics..."
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '16px', flex: 1, minWidth: 0 }}
            />
            <button type="submit" className="soft-btn-primary" style={{ padding: '12px 24px', fontSize: '14px', flexShrink: 0 }}>
              Search
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginTop: '8px' }}>
          <Link to="/channels" className="soft-btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }}>
            Explore Channels
          </Link>
          <Link to="/analyzer" className="soft-btn" style={{ padding: '12px 28px', fontSize: '15px' }}>
            ⚡ Analyze a Link
          </Link>
        </div>
      </section>

      {/* Trending Categories */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
              Trending Categories
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              Curated domains evaluated for learning density and viewer trust.
            </p>
          </div>
          <Link to="/categories" className="soft-btn" style={{ fontSize: '13px' }}>
            View All Categories →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '18px' }}>
          {CATEGORIES.slice(0, 4).map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Top Channels Grid */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
              Top Ranked Channels
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              Highest overall quality scores calculated from activity, retention, and viewer signals.
            </p>
          </div>
          <Link to="/channels" className="soft-btn" style={{ fontSize: '13px' }}>
            Explore All Channels →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {CHANNELS.slice(0, 3).map((channel, idx) => (
            <ChannelCard key={channel.id} channel={channel} rank={idx + 1} />
          ))}
        </div>
      </section>

      {/* Popular Playlists Grid */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
              Popular Playlists
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              Structured learning roadmaps with completion estimates and topic coverage.
            </p>
          </div>
          <Link to="/playlists" className="soft-btn" style={{ fontSize: '13px' }}>
            Find More Playlists →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {PLAYLISTS.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>
    </div>
  );
}
