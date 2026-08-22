import React, { useState } from 'react';
import { CHANNELS, PLAYLISTS } from '../data/dockorbitData.js';
import QualityGauge from '../components/QualityGauge.jsx';
import ChartCard from '../components/ChartCard.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function ComparePage() {
  const [mode, setMode] = useState('channels'); // 'channels' | 'playlists'
  const { compareChannels, comparePlaylists } = useApp();

  const selectedChannels = CHANNELS.filter(c => compareChannels.includes(c.id));
  const selectedPlaylists = PLAYLISTS.filter(p => comparePlaylists.includes(p.id));

  const items = mode === 'channels' ? (selectedChannels.length ? selectedChannels : CHANNELS.slice(0, 3)) : (selectedPlaylists.length ? selectedPlaylists : PLAYLISTS);

  // Determine winning channel based on Quality Score
  const winner = items.reduce((prev, curr) => (curr.qualityScore > prev.qualityScore ? curr : prev), items[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header & Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
            Side-by-Side Comparison Matrix
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: 0 }}>
            Compare metrics, quality scores, engagement signals, and upload consistency across multiple creators.
          </p>
        </div>

        {/* Mode Selector */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setMode('channels')}
            className="soft-btn"
            style={{ background: mode === 'channels' ? 'var(--primary-light)' : 'var(--bg-surface)', color: mode === 'channels' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700 }}
          >
            📺 Compare Channels ({items.length})
          </button>
          <button
            onClick={() => setMode('playlists')}
            className="soft-btn"
            style={{ background: mode === 'playlists' ? 'var(--primary-light)' : 'var(--bg-surface)', color: mode === 'playlists' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700 }}
          >
            📚 Compare Playlists
          </button>
        </div>
      </div>

      {/* Winner Highlight Card */}
      {winner && (
        <div className="soft-card-static" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--primary-light) 100%)', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '36px' }}>🏆</span>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                OVERALL WINNER (HIGHEST METRIC RELIABILITY)
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0 4px 0' }}>
                {winner.name || winner.title}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                Outperforms compared candidates in engagement rate ({winner.engagementRate || '94%'}), consistency, and viewer satisfaction.
              </p>
            </div>
          </div>

          <QualityGauge score={winner.qualityScore} size={70} strokeWidth={8} />
        </div>
      )}

      {/* Side-by-Side Comparison Table */}
      <div className="soft-card-static" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg-surface-soft)' }}>
              <th style={{ padding: '18px 24px', fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', width: '220px' }}>Metric</th>
              {items.map(item => (
                <th key={item.id} style={{ padding: '18px 24px', fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={item.avatar || item.thumbnail} alt={item.name || item.title} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span>{item.name || item.title}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ fontSize: '14px' }}>
            {mode === 'channels' ? (
              <>
                <TableRow label="Quality Score" values={items.map(i => `${i.qualityScore} / 100`)} highlightIndex={getBestIndex(items.map(i => i.qualityScore))} />
                <TableRow label="Subscribers" values={items.map(i => i.subscribers)} highlightIndex={getBestIndex(items.map(i => i.subscribersCount))} />
                <TableRow label="Avg Views / Video" values={items.map(i => i.avgViews)} highlightIndex={getBestIndex(items.map(i => i.avgViewsCount))} />
                <TableRow label="Engagement Rate" values={items.map(i => i.engagementRate)} highlightIndex={getBestIndex(items.map(i => i.engagementValue))} />
                <TableRow label="Upload Frequency" values={items.map(i => i.uploadConsistency)} highlightIndex={getBestIndex(items.map(i => i.consistencyScore))} />
                <TableRow label="Channel Age" values={items.map(i => i.channelAge)} />
                <TableRow label="Category" values={items.map(i => i.category)} />
                <TableRow label="Country" values={items.map(i => i.country)} />
              </>
            ) : (
              <>
                <TableRow label="Quality Score" values={items.map(i => `${i.qualityScore} / 100`)} highlightIndex={getBestIndex(items.map(i => i.qualityScore))} />
                <TableRow label="Video Count" values={items.map(i => `${i.videoCount} Videos`)} />
                <TableRow label="Total Duration" values={items.map(i => i.totalDuration)} />
                <TableRow label="Completion Time" values={items.map(i => i.estimatedCompletion)} />
                <TableRow label="Difficulty" values={items.map(i => i.difficulty)} />
                <TableRow label="Creator" values={items.map(i => i.creator)} />
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Side-by-Side Growth Charts */}
      {mode === 'channels' && items.length >= 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          <ChartCard title={`${items[0].name} View Trend`} data={items[0].viewsHistory} color="#4f46e5" />
          <ChartCard title={`${items[1].name} View Trend`} data={items[1].viewsHistory} color="#10b981" />
        </div>
      )}
    </div>
  );
}

function TableRow({ label, values, highlightIndex = -1 }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
      <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-surface-inset)' }}>
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
              color: isWinning ? '#10b981' : 'var(--text-main)',
              background: isWinning ? 'var(--success-bg)' : 'transparent'
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
    if (val > max) {
      max = val;
      bestIdx = idx;
    }
  });
  return bestIdx;
}
