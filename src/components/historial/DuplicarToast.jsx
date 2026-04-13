import React from 'react';
import { Copy } from 'lucide-react';

export default function DuplicarToast({ visible, mensaje }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: visible ? 'translate(-50%, 0)' : 'translate(-50%, 16px)',
      opacity: visible ? 1 : 0,
      zIndex: 2000,
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-accent)',
      borderRadius: 'var(--radius-full)',
      padding: '10px 20px',
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      transition: 'all 0.25s ease',
      pointerEvents: 'none',
      boxShadow: 'var(--shadow-md)'
    }}>
      <Copy size={14} color="var(--accent)" />
      <span style={{ fontSize: 14, fontFamily: 'DM Sans', color: 'var(--text-primary)' }}>
        {mensaje || 'Listado duplicado'}
      </span>
    </div>
  );
}
