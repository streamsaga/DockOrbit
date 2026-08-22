import React from 'react';

export default function WarningCard({ title, description, type = 'warning' }) {
  const isError = type === 'error';
  const bgColor = isError ? 'var(--error-bg)' : 'var(--warning-bg)';
  const borderColor = isError ? 'var(--error)' : 'var(--warning)';
  const icon = isError ? '🚨' : '⚠️';

  return (
    <div style={{ padding: '14px 16px', borderRadius: '12px', background: bgColor, border: `1px solid ${borderColor}44`, display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '18px', lineHeight: 1 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <h5 style={{ margin: '0 0 4px 0', fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
          {title}
        </h5>
        <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          {description}
        </p>
      </div>
    </div>
  );
}
