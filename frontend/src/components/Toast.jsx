import React from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function Toast() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100,
        background: '#0f172a',
        color: '#ffffff',
        padding: '12px 20px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
        fontSize: '13.5px',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <span>✨</span>
      <span>{toastMessage}</span>
    </div>
  );
}
