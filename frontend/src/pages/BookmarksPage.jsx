import React, { useState } from 'react';
import { CHANNELS, PLAYLISTS } from '../data/dockorbitData.js';
import ChannelCard from '../components/ChannelCard.jsx';
import PlaylistCard from '../components/PlaylistCard.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = useState('all');
  const { bookmarks, recentViewed } = useApp();

  const savedChannels = CHANNELS.filter(c => bookmarks.some(b => b.id === c.id && b.type === 'channel'));
  const savedPlaylists = PLAYLISTS.filter(p => bookmarks.some(b => b.id === p.id && b.type === 'playlist'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>🔖</span>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              Your Saved Library
            </h1>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
            Organize, monitor, and compare your saved channels and learning playlists.
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('all')}
            className="soft-btn"
            style={{ background: activeTab === 'all' ? 'var(--primary-light)' : 'var(--bg-surface)', color: activeTab === 'all' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700 }}
          >
            All Saved ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className="soft-btn"
            style={{ background: activeTab === 'channels' ? 'var(--primary-light)' : 'var(--bg-surface)', color: activeTab === 'channels' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700 }}
          >
            Channels ({savedChannels.length})
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className="soft-btn"
            style={{ background: activeTab === 'playlists' ? 'var(--primary-light)' : 'var(--bg-surface)', color: activeTab === 'playlists' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700 }}
          >
            Playlists ({savedPlaylists.length})
          </button>
        </div>
      </div>

      {/* Saved Content Grids */}
      {bookmarks.length === 0 ? (
        <div className="soft-card-static" style={{ padding: '64px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '42px' }}>🔖</span>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Your Library is currently empty
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14.5px', margin: 0, maxWidth: '400px' }}>
            Explore channels or playlists and click the bookmark button to save them to your library.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {(activeTab === 'all' || activeTab === 'channels') && savedChannels.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Saved Channels ({savedChannels.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {savedChannels.map((channel) => (
                  <ChannelCard key={channel.id} channel={channel} />
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'playlists') && savedPlaylists.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Saved Playlists ({savedPlaylists.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                {savedPlaylists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recently Viewed Stream */}
      {recentViewed.length > 0 && (
        <div className="soft-card-static" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Recently Viewed History
          </h3>
          <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px' }}>
            {recentViewed.map((item, idx) => (
              <div key={idx} className="soft-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, width: '220px' }}>
                <img src={item.avatar || item.thumbnail} alt={item.name || item.title} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.name || item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
