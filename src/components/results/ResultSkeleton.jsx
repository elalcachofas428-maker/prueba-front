import React from 'react';

export default function ResultSkeleton({ height = 400, lines = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="skeleton" style={{ width: '100%', height, borderRadius: 'var(--radius-lg)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 20, width: `${100 - (i * 15)}%`, borderRadius: 'var(--radius-sm)' }} />
        ))}
      </div>
    </div>
  );
}
