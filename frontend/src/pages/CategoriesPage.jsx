import React from 'react';
import { CATEGORIES } from '../data/dockorbitData.js';
import CategoryCard from '../components/CategoryCard.jsx';

export default function CategoriesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>🏷️</span>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
            Browse by Category
          </h1>
        </div>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
          Explore evaluated YouTube domains across specialized fields of knowledge and creator content.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '22px' }}>
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}
