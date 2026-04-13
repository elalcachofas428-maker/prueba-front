import React from 'react';

export default function ToggleBillingPeriod({ value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 14, color: value === 'mensual' ? 'var(--text-primary)' : 'var(--text-tertiary)', transition: 'color 0.2s', fontWeight: value === 'mensual' ? 500 : 400 }}>
        Mensual
      </span>
      
      <div 
        style={{
          width: 48, height: 26, borderRadius: 13,
          background: value === 'anual' ? 'var(--accent)' : 'var(--border-default)',
          position: 'relative', cursor: 'pointer',
          transition: 'background 0.2s'
        }}
        onClick={() => onChange(value === 'mensual' ? 'anual' : 'mensual')}
      >
        <div style={{
          width: 20, height: 20, borderRadius: '50%', background: 'white',
          position: 'absolute', top: 3, left: value === 'anual' ? 25 : 3,
          transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }} />
      </div>

      <span style={{ fontSize: 14, color: value === 'anual' ? 'var(--text-primary)' : 'var(--text-tertiary)', transition: 'color 0.2s', fontWeight: value === 'anual' ? 500 : 400 }}>
        Anual
      </span>

      <div style={{
        background: 'rgba(29, 158, 117, 0.12)', border: '1px solid rgba(29, 158, 117, 0.25)',
        color: 'var(--success)', fontSize: 11, padding: '2px 8px', borderRadius: 'var(--radius-full)',
        opacity: value === 'anual' ? 1 : 0, transition: 'opacity 0.2s',
        pointerEvents: 'none', userSelect: 'none'
      }}>
        2 meses gratis
      </div>
    </div>
  );
}
