import React from 'react';

export default function VideoCard({ video }) {
  return (
    <div className="soft-card" style={{ display: 'flex', gap: '14px', padding: '12px', alignItems: 'center' }}>
      <img
        src={video.thumbnail}
        alt={video.title}
        style={{ width: '120px', height: '70px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 6px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {video.title}
        </h4>
        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>👁️ {video.views} views</span>
          <span>👍 {video.likes}</span>
          <span>💬 {video.comments}</span>
          <span>📅 {video.publishedDate}</span>
        </div>
      </div>
    </div>
  );
}
