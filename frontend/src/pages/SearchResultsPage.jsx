import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CHANNELS, PLAYLISTS } from '../data/dockorbitData.js';
import ChannelCard from '../components/ChannelCard.jsx';
import PlaylistCard from '../components/PlaylistCard.jsx';
import VideoCard from '../components/VideoCard.jsx';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('all');

  const matchingChannels = CHANNELS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const matchingPlaylists = PLAYLISTS.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.creator.toLowerCase().includes(query.toLowerCase()) ||
    p.topicsCovered.some(t => t.name.toLowerCase().includes(query.toLowerCase()))
  );

  const matchingVideos = CHANNELS.flatMap(c => c.recentVideos || []).filter(v =>
    v.title.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults = matchingChannels.length + matchingPlaylists.length + matchingVideos.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Search Title */}
      <div>
        <h1 style={{ fontSize: '30px', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
          Search Results for "{query}"
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: 0 }}>
          Found {totalResults} matching channels, playlists, and video topics.
        </p>
      </div>

      {/* Result Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('all')}
          className="soft-btn"
          style={{ background: activeTab === 'all' ? 'var(--primary-light)' : 'transparent', color: activeTab === 'all' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700 }}
        >
          All ({totalResults})
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className="soft-btn"
          style={{ background: activeTab === 'channels' ? 'var(--primary-light)' : 'transparent', color: activeTab === 'channels' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700 }}
        >
          Channels ({matchingChannels.length})
        </button>
        <button
          onClick={() => setActiveTab('playlists')}
          className="soft-btn"
          style={{ background: activeTab === 'playlists' ? 'var(--primary-light)' : 'transparent', color: activeTab === 'playlists' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700 }}
        >
          Playlists ({matchingPlaylists.length})
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className="soft-btn"
          style={{ background: activeTab === 'videos' ? 'var(--primary-light)' : 'transparent', color: activeTab === 'videos' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700 }}
        >
          Videos ({matchingVideos.length})
        </button>
      </div>

      {/* Results Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {(activeTab === 'all' || activeTab === 'channels') && matchingChannels.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Matching Channels</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {matchingChannels.map(channel => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'playlists') && matchingPlaylists.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Matching Playlists</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {matchingPlaylists.map(playlist => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'videos') && matchingVideos.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Matching Video Topics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {matchingVideos.map((video, idx) => (
                <VideoCard key={idx} video={video} />
              ))}
            </div>
          </div>
        )}

        {totalResults === 0 && (
          <div className="soft-card-static" style={{ padding: '48px', textAlign: 'center' }}>
            <span style={{ fontSize: '36px' }}>🔎</span>
            <h3 style={{ margin: '12px 0 6px 0', fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
              No results found for "{query}"
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
              Try searching for general topics like "React", "Linux", "Math", or "Fireship".
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
