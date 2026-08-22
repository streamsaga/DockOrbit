import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CHANNELS } from '../data/dockorbitData.js';
import QualityGauge from '../components/QualityGauge.jsx';
import MetricCard from '../components/MetricCard.jsx';
import ChartCard from '../components/ChartCard.jsx';
import WarningCard from '../components/WarningCard.jsx';
import VideoCard from '../components/VideoCard.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function ChannelDetailPage() {
  const { id } = useParams();
  const { isBookmarked, toggleBookmark, isCompareChannel, toggleCompareChannel, addRecentViewed } = useApp();

  const channel = CHANNELS.find(c => c.id === id) || CHANNELS[0];
  const bookmarked = isBookmarked(channel.id, 'channel');
  const compared = isCompareChannel(channel.id);

  useEffect(() => {
    addRecentViewed({
      id: channel.id,
      type: 'channel',
      name: channel.name,
      avatar: channel.avatar
    });
  }, [channel.id]);

  const { scoreBreakdown } = channel;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Banner Header */}
      <div className="soft-card-static" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <img
              src={channel.avatar}
              alt={channel.name}
              style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-light)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                  {channel.name}
                </h1>
                {channel.verified && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#4f46e5">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>{channel.handle}</span>
                <span>•</span>
                <span className="quality-chip quality-chip-good">{channel.category}</span>
                <span>•</span>
                <span>📍 {channel.country}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a href={channel.url} target="_blank" rel="noreferrer" className="soft-btn" style={{ fontSize: '13px' }}>
              ↗ Open YouTube
            </a>
            <button
              onClick={() => toggleCompareChannel(channel.id)}
              className="soft-btn"
              style={{ background: compared ? 'var(--primary-light)' : 'var(--bg-surface)', color: compared ? 'var(--primary)' : 'var(--text-main)', fontSize: '13px' }}
            >
              {compared ? '✓ Compared' : '📊 Compare'}
            </button>
            <button
              onClick={() => toggleBookmark(channel.id, 'channel')}
              className="soft-btn-primary"
              style={{ fontSize: '13px', background: bookmarked ? '#ef4444' : 'var(--primary)', borderColor: bookmarked ? '#dc2626' : 'var(--primary-hover)' }}
            >
              {bookmarked ? '❤️ Bookmarked' : '🔖 Bookmark Channel'}
            </button>
          </div>
        </div>
      </div>

      {/* Quality Score Gauge & Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Quality Score Gauge Card */}
        <div className="soft-card-static" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            QUALITY / RELIABILITY SCORE
          </span>
          <QualityGauge score={channel.qualityScore} size={150} strokeWidth={12} />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, maxWidth: '280px' }}>
            Based on engagement depth, upload consistency, audience retention, and channel longevity.
          </p>
        </div>

        {/* Detailed Score Breakdown */}
        <div className="soft-card-static" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Score Breakdown Signals
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ProgressSignal label="Audience Engagement" score={scoreBreakdown.engagement} color="#4f46e5" />
            <ProgressSignal label="Upload Consistency" score={scoreBreakdown.consistency} color="#10b981" />
            <ProgressSignal label="Content Activity & Recency" score={scoreBreakdown.contentActivity} color="#06b6d4" />
            <ProgressSignal label="Channel Longevity" score={scoreBreakdown.longevity} color="#f59e0b" />
            <ProgressSignal label="Audience Signal & Retention" score={scoreBreakdown.audienceSignal} color="#8b5cf6" />
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '18px' }}>
        <MetricCard label="Subscribers" value={channel.subscribers} icon="👥" trend="+4.2%/mo" />
        <MetricCard label="Average Views" value={channel.avgViews} icon="👁️" trend="+8.1%" />
        <MetricCard label="Engagement Rate" value={channel.engagementRate} icon="🔥" trend="+1.2%" subtitle="Industry avg: 4.5%" />
        <MetricCard label="Upload Frequency" value={channel.uploadConsistency} icon="📅" subtitle="High consistency" />
        <MetricCard label="Channel Age" value={channel.channelAge} icon="⏳" subtitle="Established Creator" />
      </div>

      {/* Performance Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        <ChartCard title="Views Over Time (K)" data={channel.viewsHistory} color="#4f46e5" />
        <ChartCard title="Subscriber Growth (M)" data={channel.subsHistory} color="#10b981" />
        <ChartCard title="Upload Frequency (Videos/Mo)" data={channel.uploadFrequencyHistory} color="#06b6d4" />
      </div>

      {/* Strengths & Red Flags */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <div className="soft-card-static" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>✅</span> Key Strengths
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {channel.strengths.map((str, idx) => (
              <div key={idx} style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#10b981' }}>•</span>
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="soft-card-static" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚠️</span> Potential Red Flags & Considerations
          </h3>
          {channel.concerns.map((con, idx) => (
            <WarningCard key={idx} title="Consideration" description={con} type="warning" />
          ))}
        </div>
      </div>

      {/* Recent Videos Roster */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Recent Video Uploads
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {channel.recentVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressSignal({ label, score, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
        <span style={{ color: 'var(--text-main)' }}>{label}</span>
        <span style={{ color: color }}>{score} / 100</span>
      </div>
      <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'var(--bg-surface-soft)', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.8s ease' }} />
      </div>
    </div>
  );
}
