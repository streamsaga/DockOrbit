import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  return (
    <div className="soft-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700 }}>
          {getCategoryIcon(category.id)}
        </div>
        <span className="quality-chip quality-chip-excellent">
          Top Score {category.topScore}
        </span>
      </div>

      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
          {category.name}
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--text-subtle)', fontWeight: 600 }}>
          {category.channelCount} Channels & Playlists
        </span>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
        {category.description}
      </p>

      <Link to={`/channels?category=${category.name}`} className="soft-btn-primary" style={{ marginTop: 'auto', justifyContent: 'center', fontSize: '12.5px', padding: '8px 12px' }}>
        Explore {category.name}
      </Link>
    </div>
  );
}

function getCategoryIcon(id) {
  switch (id) {
    case 'programming': return '💻';
    case 'cybersecurity': return '🛡️';
    case 'technology': return '⚡';
    case 'education': return '🎓';
    case 'design': return '🎨';
    case 'finance': return '📈';
    case 'science': return '🧪';
    case 'business': return '💼';
    case 'gaming': return '🎮';
    case 'entertainment': return '🎬';
    default: return '📁';
  }
}
