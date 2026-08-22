import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CHANNELS, PLAYLISTS } from '../data/dockorbitData.js';
import QualityGauge from '../components/QualityGauge.jsx';
import ChartCard from '../components/ChartCard.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function ComparePage() {
  const [mode, setMode] = useState('channels'); // 'channels' | 'playlists'
  const { compareChannels, comparePlaylists, toggleCompareChannel, toggleComparePlaylist } = useApp();

  const selectedChannels = CHANNELS.filter(c => compareChannels.includes(c.id));
  const selectedPlaylists = PLAYLISTS.filter(p => comparePlaylists.includes(p.id));

  const items = mode === 'channels'
    ? (selectedChannels.length > 0 ? selectedChannels : CHANNELS.slice(0, 3))
    : (selectedPlaylists.length > 0 ? selectedPlaylists : PLAYLISTS.slice(0, 3));

  // Compute metrics dynamically for all channels/playlists
  const enrichedItems = items.map((item) => {
    const score = Number(item.qualityScore || item.trustScore || 85);
    const views = Number(item.avgViewsCount || item.totalViews || 50000);
    const likes = Number(item.avgLikes || Math.round(views * 0.04));
    const comments = Number(item.avgComments || Math.round(views * 0.005));
    const engagementValue = views > 0 ? ((likes + comments) / views) * 100 : 5.0;
    const engagementRateStr = item.engagementRate || `${engagementValue.toFixed(1)}%`;
    const subCount = Number(item.subscribersCount || item.subscribersRaw || 100000);

    return {
      ...item,
      computedQualityScore: score,
      computedEngagementRate: engagementRateStr,
      computedEngagementValue: engagementValue,
      computedSubscribersCount: subCount,
      computedAvgViews: views,
    };
  });

  // Determine winning candidate dynamically based on highest qualityScore
  const winner = enrichedItems.reduce(
    (prev, curr) => (curr.computedQualityScore > prev.computedQualityScore ? curr : prev),
    enrichedItems[0]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', maxWidth: '100%' }}>
      {/* Header & Mode Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>📊</span>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              Side-by-Side Comparison Matrix
            </h1>
          </div>
          <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
            Compare objective quality scores, engagement signals, and upload consistency across selected candidates.
          </p>
        </div>

        {/* Mode Selector */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setMode('channels')}
            className="soft-btn"
            style={{
              background: mode === 'channels' ? 'var(--primary-light)' : 'var(--bg-surface)',
              color: mode === 'channels' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 700,
              padding: '10px 16px',
              fontSize: '13.5px'
            }}
          >
            📺 Compare Channels ({selectedChannels.length > 0 ? selectedChannels.length : 'Default 3'})
          </button>
          <button
            onClick={() => setMode('playlists')}
            className="soft-btn"
            style={{
              background: mode === 'playlists' ? 'var(--primary-light)' : 'var(--bg-surface)',
              color: mode === 'playlists' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 700,
              padding: '10px 16px',
              fontSize: '13.5px'
            }}
          >
            📚 Compare Playlists ({selectedPlaylists.length > 0 ? selectedPlaylists.length : 'Default 3'})
          </button>
        </div>
      </div>

      {/* Dynamic Overall Winner Card */}
      {winner && (
        <div
          className="soft-card-static"
          style={{
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--primary-light) 100%)',
            borderLeft: '5px solid var(--primary)',
            borderRadius: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', minWidth: 0 }}>
            <span style={{ fontSize: '38px', flexShrink: 0 }}>🏆</span>
            <div style={{ minWidth: 0 }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                OVERALL WINNER (DYNAMICALLY CALCULATED)
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-main)', margin: '2px 0 4px 0', wordBreak: 'break-word' }}>
                {winner.name || winner.title}
              </h2>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0 }}>
                Highest reliability score ({winner.computedQualityScore}/100) with a {winner.computedEngagementRate} engagement rate and high viewer satisfaction.
              </p>
            </div>
          </div>

          <QualityGauge score={winner.computedQualityScore} size={72} strokeWidth={8} />
        </div>
      )}

      {/* Horizontal Scroll Hint for Mobile Viewports */}
      <div className="mobile-scroll-hint" style={{ display: 'none', fontSize: '12px', color: 'var(--primary)', fontWeight: 700, background: 'var(--primary-light)', padding: '8px 14px', borderRadius: '8px', textAlign: 'center' }}>
        👈 Swipe left or right to compare full matrix metrics 👉
      </div>

      {/* Side-by-Side Matrix Table Container */}
      <div className="soft-card-static matrix-scroll-wrapper" style={{ padding: '0', overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '640px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg-surface-soft)' }}>
              <th style={{ padding: '18px 24px', fontSize: '13.5px', fontWeight: 700, color: 'var(--text-muted)', width: '200px' }}>Metric</th>
              {enrichedItems.map(item => (
                <th key={item.id} style={{ padding: '18px 24px', fontSize: '14.5px', fontWeight: 800, color: 'var(--text-main)', minWidth: '180px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <img src={item.avatar || item.thumbnail} alt={item.name || item.title} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name || item.title}</span>
                    </div>
                    <button
                      onClick={() => mode === 'channels' ? toggleCompareChannel(item.id) : toggleComparePlaylist(item.id)}
                      style={{ fontSize: '11px', color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}
                      title="Remove from comparison"
                    >
                      ✕
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ fontSize: '14px' }}>
            {mode === 'channels' ? (
              <>
                <TableRow label="Quality Score" values={enrichedItems.map(i => `${i.computedQualityScore} / 100`)} highlightIndex={getBestIndex(enrichedItems.map(i => i.computedQualityScore))} />
                <TableRow label="Subscribers" values={enrichedItems.map(i => i.subscribers || `${(i.computedSubscribersCount / 1000).toFixed(0)}K`)} highlightIndex={getBestIndex(enrichedItems.map(i => i.computedSubscribersCount))} />
                <TableRow label="Avg Views / Video" values={enrichedItems.map(i => i.avgViews || `${(i.computedAvgViews / 1000).toFixed(0)}K`)} highlightIndex={getBestIndex(enrichedItems.map(i => i.computedAvgViews))} />
                <TableRow label="Engagement Rate" values={enrichedItems.map(i => i.computedEngagementRate)} highlightIndex={getBestIndex(enrichedItems.map(i => i.computedEngagementValue))} />
                <TableRow label="Upload Frequency" values={enrichedItems.map(i => i.uploadConsistency || `${i.uploadsLast30Days || 4} uploads/mo`)} highlightIndex={getBestIndex(enrichedItems.map(i => i.consistencyScore || i.uploadsLast30Days || 0))} />
                <TableRow label="Channel Age" values={enrichedItems.map(i => i.channelAge || (i.channelCreatedYear ? `${new Date().getFullYear() - i.channelCreatedYear} yrs` : '4 yrs'))} />
                <TableRow label="Category" values={enrichedItems.map(i => i.category || 'General')} />
                <TableRow label="Country" values={enrichedItems.map(i => i.country || 'Global')} />
              </>
            ) : (
              <>
                <TableRow label="Quality Score" values={enrichedItems.map(i => `${i.computedQualityScore} / 100`)} highlightIndex={getBestIndex(enrichedItems.map(i => i.computedQualityScore))} />
                <TableRow label="Video Count" values={enrichedItems.map(i => `${i.videoCount || 12} Videos`)} />
                <TableRow label="Total Duration" values={enrichedItems.map(i => i.totalDuration || '12h 30m')} />
                <TableRow label="Completion Time" values={enrichedItems.map(i => i.estimatedCompletion || '1-2 weeks')} />
                <TableRow label="Difficulty" values={enrichedItems.map(i => i.difficulty || 'Intermediate')} />
                <TableRow label="Creator" values={enrichedItems.map(i => i.creator || i.author || 'Featured')} />
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Side-by-Side Growth Charts */}
      {mode === 'channels' && enrichedItems.length >= 2 && enrichedItems[0].viewsHistory && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <ChartCard title={`${enrichedItems[0].name} View Trend`} data={enrichedItems[0].viewsHistory} color="#4F46E5" />
          <ChartCard title={`${enrichedItems[1].name} View Trend`} data={enrichedItems[1].viewsHistory} color="#10B981" />
        </div>
      )}

      {/* Add Candidates Call to Action */}
      <div className="soft-card-static" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', background: 'var(--bg-surface-soft)' }}>
        <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
          Want to compare custom channels or playlists? Select candidate items while browsing Discovery.
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/channels" className="soft-btn" style={{ fontSize: '13px' }}>
            Browse Channels →
          </Link>
          <Link to="/playlists" className="soft-btn" style={{ fontSize: '13px' }}>
            Browse Playlists →
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .mobile-scroll-hint {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

function TableRow({ label, values, highlightIndex = -1 }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
      <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-surface-inset)', whiteSpace: 'nowrap' }}>
        {label}
      </td>
      {values.map((val, idx) => {
        const isWinning = idx === highlightIndex;
        return (
          <td
            key={idx}
            style={{
              padding: '16px 24px',
              fontWeight: isWinning ? 800 : 500,
              color: isWinning ? '#10B981' : 'var(--text-main)',
              background: isWinning ? 'var(--success-bg)' : 'transparent',
              whiteSpace: 'nowrap'
            }}
          >
            {val} {isWinning && '👑'}
          </td>
        );
      })}
    </tr>
  );
}

function getBestIndex(numArray) {
  let max = -Infinity;
  let bestIdx = -1;
  numArray.forEach((val, idx) => {
    if (typeof val === 'number' && !isNaN(val) && val > max) {
      max = val;
      bestIdx = idx;
    }
  });
  return bestIdx;
}
