import React from 'react';
import { Copy, Trash2, FileText, Image as ImageIcon, Film, LayoutTemplate, Mail, Play } from 'lucide-react';

const EMOJIS = {
  casa: '🏠',
  departamento: '🏢',
  local: '🏪',
  oficina: '🏪',
  terreno: '🌳',
  otro: '📍'
};

const FORMAT_ICONS = {
  pdf: { icon: FileText, label: 'PDF' },
  post: { icon: ImageIcon, label: 'Post' },
  story: { icon: Film, label: 'Story' },
  carrusel: { icon: LayoutTemplate, label: 'Carrusel' },
  email: { icon: Mail, label: 'Email' },
  video: { icon: Play, label: 'Video' }
};

export default function ListadoCard({ listado, onDuplicar, onEliminar }) {
  const tp = (listado.tipoPropiedad || 'otro').toLowerCase();
  const emoji = EMOJIS[tp] || EMOJIS.otro;
  
  const operacion = (listado.operacion || 'venta').toLowerCase();
  let pillStyle = {};
  if (operacion.includes('temporal')) {
    pillStyle = { background: 'rgba(29,158,117,0.15)', border: '1px solid var(--success)', color: 'var(--success)' };
  } else if (operacion === 'alquiler') {
    pillStyle = { background: 'rgba(180,126,255,0.15)', border: '1px solid var(--violet)', color: 'var(--violet-light)' };
  } else {
    pillStyle = { background: 'rgba(0,196,212,0.15)', border: '1px solid var(--accent)', color: 'var(--accent)' };
  }

  // formats: ["pdf", "post", "story", "carrusel", "email", "video"]
  const formatosGuardados = listado.formatos_generados || [];
  
  const priceParsed = parseFloat(listado.precio || 0);
  const formattedPrice = priceParsed > 0 
    ? `${listado.moneda || 'USD'} ${priceParsed.toLocaleString('es-AR')}`
    : '— Sin precio';

  let dateDisplay = 'Hace poco';
  if (listado.created_at) {
    const d = new Date(listado.created_at);
    const diffTime = Math.abs(new Date() - d);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) dateDisplay = 'Hoy';
    else if (diffDays === 1) dateDisplay = 'Ayer';
    else dateDisplay = `Hace ${diffDays} días`;
  }

  return (
    <div 
      className="hover-lift"
      style={{
        background: 'var(--bg-card)', 
        border: '1px solid var(--border-subtle)', 
        borderRadius: 'var(--radius-lg)', 
        display: 'flex', flexDirection: 'column', 
        overflow: 'hidden'
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
        {listado.fotoportada ? (
          <img src={listado.fotoportada} alt="Portada" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--bg-surface), #1a1a2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
            {emoji}
          </div>
        )}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '4px 10px', borderRadius: 'var(--radius-full)', 
          fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
          ...pillStyle
        }}>
          {listado.operacion || 'Venta'}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 16, flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {listado.tipoPropiedad || 'Propiedad'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {listado.ciudad || 'Sin ciudad'} {listado.pais ? `, ${listado.pais}` : ''}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', marginTop: 8 }}>
          {formattedPrice}
        </div>

        <div style={{ height: 1, margin: '12px 0', background: 'var(--border-subtle)' }} />

        {/* Chips de formatos generados */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {Object.entries(FORMAT_ICONS).map(([key, config]) => {
            const FIcon = config.icon;
            const hasFormat = formatosGuardados.includes(key);
            return (
              <div key={key} style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 4, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 4,
                color: hasFormat ? 'var(--accent)' : 'var(--text-tertiary)',
                opacity: hasFormat ? 1 : 0.4
              }}>
                <FIcon size={12} />
                <span style={{ fontSize: 10, fontFamily: 'DM Sans' }}>{config.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
          {dateDisplay}
        </div>
      </div>

      {/* Acciones */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', display: 'flex', overflow: 'hidden', background: 'rgba(255,255,255,0.01)' }}>
        <button 
          className="btn-ghost hover-lift-action"
          style={{ flex: 1, padding: '10px 0', borderRadius: 0, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          onClick={() => onDuplicar(listado)}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-dim)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <Copy size={14} /> Duplicar
        </button>
        <div style={{ width: 1, background: 'var(--border-subtle)' }} />
        <button 
          className="btn-ghost hover-lift-action"
          style={{ flex: 1, padding: '10px 0', borderRadius: 0, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--error)' }}
          onClick={() => onEliminar(listado)}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(226,75,74,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <Trash2 size={14} /> Eliminar
        </button>
      </div>
    </div>
  );
}
