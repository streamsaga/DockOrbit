import React from 'react';

export default function ChartCard({ title, data = [30, 45, 60, 50, 75, 90], labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], color = '#4f46e5' }) {
  const maxVal = Math.max(...data, 1);
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * 260 + 20;
    const y = 140 - (val / maxVal) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="soft-card-static" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{title}</h4>
        <span style={{ fontSize: '12px', color: 'var(--text-subtle)', fontWeight: 600 }}>Last 6 Months</span>
      </div>

      <div style={{ width: '100%', height: '160px', position: 'relative' }}>
        <svg viewBox="0 0 300 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          {/* Subtle horizontal grid lines */}
          <line x1="20" y1="40" x2="280" y2="40" stroke="var(--border-light)" strokeDasharray="3 3" />
          <line x1="20" y1="90" x2="280" y2="90" stroke="var(--border-light)" strokeDasharray="3 3" />
          <line x1="20" y1="140" x2="280" y2="140" stroke="var(--border-light)" />

          {/* Area fill gradient */}
          <defs>
            <linearGradient id={`grad-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <polygon
            points={`20,140 ${points} 280,140`}
            fill={`url(#grad-${title.replace(/\s+/g, '')})`}
          />

          {/* Trend Polyline */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Data Points */}
          {data.map((val, idx) => {
            const x = (idx / (data.length - 1)) * 260 + 20;
            const y = 140 - (val / maxVal) * 100;
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="4"
                fill="var(--bg-surface)"
                stroke={color}
                strokeWidth="2.5"
              />
            );
          })}
        </svg>
      </div>

      {/* Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', fontSize: '11.5px', color: 'var(--text-subtle)' }}>
        {labels.map((lbl, idx) => (
          <span key={idx}>{lbl}</span>
        ))}
      </div>
    </div>
  );
}
