import React from 'react';

export default function SentimentCard({ sentiment }) {
  const { positive = 92, neutral = 6, negative = 2, keyThemes = [] } = sentiment || {};

  return (
    <div className="soft-card-static" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
        Viewer Sentiment Analysis
      </h4>

      {/* Segmented Progress Bar */}
      <div style={{ width: '100%', height: '12px', borderRadius: '6px', background: 'var(--bg-surface-soft)', overflow: 'hidden', display: 'flex' }}>
        <div style={{ width: `${positive}%`, background: '#10b981' }} title={`Positive ${positive}%`} />
        <div style={{ width: `${neutral}%`, background: '#f59e0b' }} title={`Neutral ${neutral}%`} />
        <div style={{ width: `${negative}%`, background: '#ef4444' }} title={`Negative ${negative}%`} />
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px', fontWeight: 600 }}>
        <span style={{ color: '#10b981' }}>🟢 Positive ({positive}%)</span>
        <span style={{ color: '#f59e0b' }}>🟡 Neutral ({neutral}%)</span>
        <span style={{ color: '#ef4444' }}>🔴 Negative ({negative}%)</span>
      </div>

      {/* Themes */}
      {keyThemes.length > 0 && (
        <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-subtle)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            Recurring Feedback Themes:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {keyThemes.map((theme, i) => (
              <div key={i} style={{ fontSize: '12.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--primary)' }}>💬</span>
                <span>"{theme}"</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
