import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function PlaylistCard({ playlist }) {
  const { isBookmarked, toggleBookmark, isComparePlaylist, toggleComparePlaylist } = useApp();
  const bookmarked = isBookmarked(playlist.id, 'playlist');
  const compared = isComparePlaylist(playlist.id);

  return (
    <div className="soft-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Thumbnail Banner */}
      <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden' }}>
        <img
          src={playlist.thumbnail}
          alt={playlist.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', color: '#ffffff', padding: '4px 10px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 700 }}>
          {playlist.videoCount} Videos • {playlist.totalDuration}
        </div>
        <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: '#4f46e5', color: '#ffffff', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700 }}>
          Score {playlist.qualityScore}/100
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={playlist.creatorAvatar} alt={playlist.creator} style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>{playlist.creator}</span>
          <span style={{ marginLeft: 'auto', fontSize: '11.5px', color: 'var(--primary)', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'var(--primary-light)' }}>
            {playlist.difficulty}
          </span>
        </div>

        <Link to={`/playlist/${playlist.id}`} style={{ fontWeight: 700, fontSize: '15.5px', color: 'var(--text-main)', lineHeight: 1.3 }}>
          {playlist.title}
        </Link>

        {/* Completion Pace Indicator */}
        <div className="soft-inset" style={{ padding: '8px 12px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Pace: <strong>{playlist.estimatedCompletion}</strong></span>
        </div>

        {/* Topic Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {playlist.topicsCovered.slice(0, 3).map((topic, i) => (
            <span key={i} style={{ fontSize: '11px', background: 'var(--bg-surface-soft)', color: 'var(--text-main)', padding: '3px 8px', borderRadius: '6px', fontWeight: 500 }}>
              {topic.name}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: 'auto', paddingTop: '8px' }}>
          <Link to={`/playlist/${playlist.id}`} className="soft-btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '12.5px', padding: '8px 12px' }}>
            Explore Playlist
          </Link>
          <button
            onClick={() => toggleComparePlaylist(playlist.id)}
            className="soft-btn"
            style={{
              padding: '8px 10px',
              fontSize: '12px',
              background: compared ? 'var(--primary-light)' : 'var(--bg-surface)',
              color: compared ? 'var(--primary)' : 'var(--text-main)'
            }}
            title="Compare playlist"
          >
            {compared ? 'Compared' : 'Compare'}
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