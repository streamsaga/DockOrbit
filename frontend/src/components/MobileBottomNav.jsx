import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function MobileBottomNav() {
  const { bookmarks } = useApp();

  const items = [
    { to: '/', label: 'Home', icon: '🧭' },
    { to: '/channels', label: 'Explore', icon: '📺' },
    { to: '/analyzer', label: 'Analyze', icon: '⚡' },
    { to: '/compare', label: 'Compare', icon: '📊' },
    { to: '/bookmarks', label: 'Library', icon: '🔖', badge: bookmarks.length }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            fontSize: '11px',
            fontWeight: isActive ? 700 : 500,
            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
            position: 'relative',
            textDecoration: 'none'
          })}
        >
          <span style={{ fontSize: '18px' }}>{item.icon}</span>
          <span>{item.label}</span>
          {item.badge > 0 && (
            <span style={{ position: 'absolute', top: '-2px', right: '4px', background: 'var(--primary)', color: '#ffffff', fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '9999px' }}>
              {item.badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
