import React from 'react';

export default function MetricCard({ label, value, icon, trend, subtitle }) {
  return (
    <div className="soft-card-static" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
        {icon && <span style={{ fontSize: '18px' }}>{icon}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>{value}</span>
        {trend && (
          <span style={{ fontSize: '12px', fontWeight: 700, color: trend.startsWith('+') ? '#10b981' : '#ef4444' }}>
            {trend}
          </span>
        )}
      </div>
      {subtitle && (
        <span style={{ fontSize: '11.5px', color: 'var(--text-subtle)' }}>{subtitle}</span>
      )}
    </div>
  );
}
