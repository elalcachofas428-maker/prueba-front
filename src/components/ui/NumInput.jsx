import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function NumInput({ label, value, onChange, min = 0, max = 100 }) {
  const numValue = Number(value) || 0;

  const handleMinus = () => {
    if (numValue > min) onChange(numValue - 1);
  };

  const handlePlus = () => {
    if (numValue < max) onChange(numValue + 1);
  };

  return (
    <div className="input-wrapper">
      <label className="input-label">{label}</label>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        border: '1px solid var(--border-subtle)', 
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        height: 44,
        background: 'var(--bg-card)'
      }}>
        <button 
          type="button" 
          onClick={handleMinus}
          style={{ 
            width: 44, height: '100%', border: 'none', background: 'transparent', 
            cursor: 'pointer', color: 'var(--text-tertiary)', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
        >
          <Minus size={16} />
        </button>
        <div style={{ 
          flex: 1, textAlign: 'center', fontFamily: 'DM Sans', fontSize: 15, 
          fontWeight: 600, color: 'var(--text-primary)' 
        }}>
          {numValue}
        </div>
        <button 
          type="button" 
          onClick={handlePlus}
          style={{ 
            width: 44, height: '100%', border: 'none', background: 'transparent', 
            cursor: 'pointer', color: 'var(--text-tertiary)', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
