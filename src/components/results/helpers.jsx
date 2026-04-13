import React from 'react';
import { AlertCircle } from 'lucide-react';

export function HeaderTab({ icon: Icon, title, subtitle, actions, accentColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', background: `${accentColor}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, border: `1px solid ${accentColor}33`
        }}>
          <Icon size={24} />
        </div>
        <div>
          <h2 className="text-h3">{title}</h2>
          <p className="text-body-sm text-secondary" style={{ marginTop: 4 }}>{subtitle}</p>
        </div>
      </div>
      <div>{actions}</div>
    </div>
  );
}

import { Link } from 'react-router-dom';

export function ErrorState({ error, onRetry, label, isLimitError }) {
  const isLimit = isLimitError || (error && error.isLimit);

  if (isLimit) {
    return (
      <div style={{ padding: 40, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(245, 166, 35, 0.1)', color: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <AlertCircle size={24} />
        </div>
        <h3 className="text-h4" style={{ marginBottom: 8 }}>Alcanzaste el límite de tu plan</h3>
        <p className="text-body-sm text-secondary" style={{ marginBottom: 24 }}>Expandí tu plan para seguir generando contenido con IA y conseguir más clientes.</p>
        <Link to="/precios" className="btn btn-primary">
          Actualizar plan
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--error-dim)', color: 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <AlertCircle size={24} />
      </div>
      <h3 className="text-h4" style={{ marginBottom: 8 }}>Error al generar {label}</h3>
      <p className="text-body-sm text-secondary" style={{ marginBottom: 24 }}>{error?.message || 'Ocurrió un error inesperado al conectar con el servidor.'}</p>
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export function EmptyState({ label, aspectRatio = 'auto' }) {
  return (
    <div style={{
      width: '100%', aspectRatio, minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.02)'
    }}>
      <span className="text-body-sm text-tertiary">{label}</span>
    </div>
  );
}

export function InfoRow({ items }) {
  return (
    <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {items.map((item, i) => (
        <div key={i}>
          <div className="text-label" style={{ marginBottom: 4 }}>{item.label}</div>
          <div className="text-body-sm">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
