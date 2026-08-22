import React from 'react';

export default function AIInsightCard({ title = "AI Content Insight", summary, keyPoints = [], tag = "AI Generated" }) {
  return (
    <div className="soft-card-static" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '4px solid var(--primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🤖</span> {title}
        </h4>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}>
          {tag}
        </span>
      </div>

      <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
        {summary}
      </p>

      {keyPoints.length > 0 && (
        <ul style={{ paddingLeft: '20px', margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {keyPoints.map((pt, idx) => (
            <li key={idx}>{pt}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
