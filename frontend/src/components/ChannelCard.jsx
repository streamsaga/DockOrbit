import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import QualityGauge from './QualityGauge.jsx';

export default function ChannelCard({ channel, rank = null }) {
  const { isBookmarked, toggleBookmark, isCompareChannel, toggleCompareChannel } = useApp();
  const bookmarked = isBookmarked(channel.id, 'channel');
  const compared = isCompareChannel(channel.id);

  return (
    <div className="soft-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {rank && (
            <div className="rank-badge">
              #{rank}
            </div>
          )}
          <img
            src={channel.avatar}
            alt={channel.name}
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-light)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Link to={`/channel/${channel.id}`} style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-main)' }}>
                {channel.name}
              </Link>
              {channel.verified && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#4f46e5">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              )}
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span>{channel.category}</span>
              <span>•</span>
              <span>{channel.country}</span>
            </div>
          </div>
        </div>

        {/* Mini Gauge */}
        <QualityGauge score={channel.qualityScore} size={54} strokeWidth={6} showLabel={false} />
      </div>

      {/* Metrics Row */}
      <div className="soft-inset" style={{ padding: '12px 14px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '12.5px' }}>
        <div>
          <span style={{ color: 'var(--text-subtle)', display: 'block', marginBottom: '2px', fontSize: '11.5px' }}>Subscribers</span>
          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{channel.subscribers}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-subtle)', display: 'block', marginBottom: '2px', fontSize: '11.5px' }}>Avg Views</span>
          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{channel.avgViews}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-subtle)', display: 'block', marginBottom: '2px', fontSize: '11.5px' }}>Engagement Rate</span>
          <span style={{ fontWeight: 700, color: '#10b981' }}>{channel.engagementRate}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-subtle)', display: 'block', marginBottom: '2px', fontSize: '11.5px' }}>Upload Frequency</span>
          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{channel.uploadConsistency}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', paddingTop: '4px' }}>
        <Link to={`/channel/${channel.id}`} className="soft-btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '13px', padding: '8px 12px' }}>
          View Analytics
        </Link>
        <button
          onClick={() => toggleCompareChannel(channel.id)}
          className="soft-btn"
          style={{
            padding: '8px 12px',
            fontSize: '12.5px',
            background: compared ? 'var(--primary-light)' : 'var(--bg-surface)',
            color: compared ? 'var(--primary)' : 'var(--text-main)'
          }}
          title="Compare channel side-by-side"
        >
          {compared ? 'Compared' : 'Compare'}
        </button>
        <button
          onClick={() => toggleBookmark(channel.id, 'channel')}
          className="soft-btn"
          style={{ padding: '8px 10px', color: bookmarked ? '#ef4444' : 'var(--text-muted)' }}
          title={bookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarked ? '#ef4444' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}