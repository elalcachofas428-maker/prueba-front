import React from 'react';
import { SearchX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HistorialEmptyState({ hasFilters, onLimpiar }) {
  const navigate = useNavigate();

  if (hasFilters) {
    return (
      <div style={{ padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <SearchX size={40} color="var(--text-tertiary)" style={{ marginBottom: 16 }} />
        <h3 style={{ fontSize: 18, marginBottom: 8, fontWeight: 500 }}>Sin resultados</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          Ningún listado coincide con los filtros aplicados
        </p>
        <button className="btn btn-secondary" onClick={onLimpiar}>
          Limpiar filtros
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--border-default)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
      <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Todavía no generaste ningún listado</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Cuando generes tu primer listado aparecerá acá
      </p>
      <button className="btn btn-primary" onClick={() => navigate('/nuevo')}>
        Crear primer listado &rarr;
      </button>
    </div>
  );
}
