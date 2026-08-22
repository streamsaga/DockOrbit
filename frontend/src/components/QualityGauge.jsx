import React from 'react';

export default function QualityGauge({ score = 87, size = 120, strokeWidth = 10, showLabel = true, label = '' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = '#4f46e5';
  let labelText = 'Strong';
  let bgClass = 'rgba(79, 70, 229, 0.1)';

  if (score >= 95) {
    colorClass = '#10b981';
    labelText = 'Exceptional';
    bgClass = 'rgba(16, 185, 129, 0.1)';
  } else if (score >= 85) {
    colorClass = '#4f46e5';
    labelText = 'Strong';
    bgClass = 'rgba(79, 70, 229, 0.1)';
  } else if (score >= 70) {
    colorClass = '#06b6d4';
    labelText = 'Good';
    bgClass = 'rgba(6, 182, 212, 0.1)';
  } else if (score >= 50) {
    colorClass = '#f59e0b';
    labelText = 'Moderate';
    bgClass = 'rgba(245, 158, 11, 0.1)';
  } else {
    colorClass = '#ef4444';
    labelText = 'Needs Review';
    bgClass = 'rgba(239, 68, 68, 0.1)';
  }

  const activeLabel = label || labelText;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--border-light)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </svg>

        {/* Score Text Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span style={{ fontSize: size > 100 ? '28px' : '20px', fontWeight: 800, color: 'var(--text-main)' }}>
            {score}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>/ 100</span>
        </div>
      </div>

      {showLabel && (
        <span
          style={{
            marginTop: '8px',
            padding: '3px 10px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            backgroundColor: bgClass,
            color: colorClass,
            border: `1px solid ${colorClass}33`
          }}
        >
          {activeLabel}
        </span>
      )}
    </div>
  );
}
