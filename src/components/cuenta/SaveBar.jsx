import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SaveBar({ visible, saving, onSave, onDiscard, saveSuccess, saveError }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 500,
      background: 'rgba(19, 29, 48, 0.85)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '16px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transform: visible ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.25s ease',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <div>
        {saveSuccess ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--success)', fontWeight: 500 }}>
            <CheckCircle2 size={18} />
            Cambios guardados
          </div>
        ) : saveError ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--error)', fontWeight: 500 }}>
            <AlertCircle size={18} />
            {saveError}
          </div>
        ) : (
          <div style={{ color: 'var(--text-secondary)' }}>
            Tenés cambios sin guardar
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button 
          className="btn btn-ghost" 
          onClick={onDiscard} 
          disabled={saving}
          style={{ cursor: saving ? 'not-allowed' : 'pointer' }}
        >
          Descartar
        </button>
        <button 
          className="btn btn-primary" 
          onClick={onSave} 
          disabled={saving}
          style={{ width: 150 }}
        >
          {saving ? <div className="btn-spinner" /> : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
}
