import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function PlaylistCard({ playlist }) {
  const { isBookmarked, toggleBookmark, isComparePlaylist, toggleComparePlaylist } = useApp();
  const bookmarked = isBookmarked(playlist.id, 'playlist');
  const compared = isComparePlaylist(playlist.id);

  const title = playlist.title || 'YouTube Playlist';
  const creator = playlist.creator || playlist.channelTitle || 'YouTube Creator';
  const thumbnail = playlist.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80';
  const creatorAvatar = playlist.creatorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator)}&background=4F46E5&color=fff`;
  const videoCount = playlist.videoCount || playlist.itemCount || 10;
  const score = playlist.qualityScore || playlist.score || 88;
  const difficulty = playlist.difficulty || 'All levels';
  const estimatedCompletion = playlist.estimatedCompletion || '1-2 weeks';
  const topics = playlist.topicsCovered || [
    { name: playlist.category || 'Tutorial', depth: 90 },
    { name: 'Full Course', depth: 85 }
  ];

  return (
    <div className="soft-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Thumbnail Banner */}
      <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden' }}>
        <img
          src={thumbnail}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', color: '#ffffff', padding: '4px 10px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 700 }}>
          {videoCount} Videos
        </div>
        <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: '#4F46E5', color: '#ffffff', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700 }}>
          Score {score}/100
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={creatorAvatar} alt={creator} style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>{creator}</span>
          <span style={{ marginLeft: 'auto', fontSize: '11.5px', color: 'var(--primary)', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'var(--primary-light)' }}>
            {difficulty}
          </span>
        </div>

        <Link to={`/playlist/${playlist.id}`} style={{ fontWeight: 700, fontSize: '15.5px', color: 'var(--text-main)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {title}
        </Link>

        {/* Completion Pace Indicator */}
        <div className="soft-inset" style={{ padding: '8px 12px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Pace: <strong>{estimatedCompletion}</strong></span>
        </div>

        {/* Topic Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {topics.slice(0, 3).map((topic, i) => (
            <span key={i} style={{ fontSize: '11px', background: 'var(--bg-surface-soft)', color: 'var(--text-main)', padding: '3px 8px', borderRadius: '6px', fontWeight: 500 }}>
              {typeof topic === 'object' ? topic.name : topic}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: 'auto', paddingTop: '8px' }}>
          <Link to={`/playlist/${playlist.id}`} className="soft-btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '12.5px', padding: '8px 12px' }}>
            Explore Playlist
          </Link>
          <button
            onClick={() => toggleComparePlaylist(playlist)}
            className="soft-btn"
            style={{
              padding: '8px 10px',
              fontSize: '12px',
              background: compared ? 'var(--primary-light)' : 'var(--bg-surface)',
              color: compared ? 'var(--primary)' : 'var(--text-main)'
            }}
            title="Compare playlist"
          >
            {compared ? '✓ Compared' : '📊 Compare'}
          </button>
          <button
            onClick={() => toggleBookmark(playlist.id, 'playlist')}
            className="soft-btn"
            style={{ padding: '8px 10px', color: bookmarked ? '#ef4444' : 'var(--text-muted)' }}
            title={bookmarked ? 'Remove Bookmark' : 'Save Playlist'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarked ? '#ef4444' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}