import React from 'react';
import { Trash2 } from 'lucide-react';

export default function EliminarModal({ listado, onConfirmar, onCancelar, loading, error }) {
  if (!listado) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={onCancelar}>
      <div 
        style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)', padding: 32, maxWidth: 420, width: '90%',
          boxShadow: 'var(--shadow-lg)', animation: 'modalIn 0.2s ease', position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          width: 48, height: 48, borderRadius: '50%', background: 'rgba(226,75,74,0.1)',
          border: '1px solid rgba(226,75,74,0.2)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 16px'
        }}>
          <Trash2 size={24} color="#E24B4A" />
        </div>
        
        <h3 style={{ fontSize: 20, fontWeight: 600, textAlign: 'center', margin: '0 0 8px 0', fontFamily: 'Syne' }}>
          ¿Eliminar este listado?
        </h3>
        
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
          {listado.tipoPropiedad || 'Propiedad'} en {listado.ciudad || 'Ubicación'}
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 4 }}>
          Esta acción no se puede deshacer.
        </p>

        {error && (
          <div style={{
            background: 'rgba(226,75,74,0.08)', border: '1px solid var(--error)',
            color: 'var(--error)', padding: '10px 14px', borderRadius: 8,
            marginTop: 16, fontSize: 13, textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button 
            className="btn btn-secondary" 
            style={{ flex: 1 }} 
            onClick={onCancelar}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            className="btn btn-danger" 
            style={{ flex: 1, backgroundColor: '#E24B4A', color: 'white', borderRadius: 24 }} 
            onClick={() => onConfirmar(listado.id)}
            disabled={loading}
          >
            {loading ? <div className="btn-spinner" style={{ margin: '0 auto' }} /> : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
