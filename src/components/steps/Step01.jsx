import { useState } from 'react';
import { useFormContext } from '../../context/FormContext';

const TIPOS = ['Casa', 'Departamento', 'PH', 'Local comercial', 'Oficina', 'Terreno', 'Bodega', 'Cochera'];
const OPERACIONES = ['Venta', 'Alquiler', 'Alquiler temporario', 'Preventa'];
const PAISES = ['Argentina', 'México', 'Colombia', 'Chile', 'Uruguay', 'España', 'Perú', 'Ecuador'];
const IDIOMAS = ['Español', 'Inglés', 'Portugués'];

const CIUDADES_SUGERIDAS = [
  'Palermo, CABA', 'Recoleta, CABA', 'Belgrano, CABA',
  'Núñez, CABA', 'Puerto Madero, CABA', 'San Telmo, CABA',
  'Caballito, CABA', 'Villa Crespo, CABA',
  'San Isidro, GBA', 'Vicente López, GBA', 'Tigre, GBA',
  'Olivos, GBA', 'Martínez, GBA', 'Nordelta, GBA',
  'Córdoba Capital', 'Nueva Córdoba', 'Rosario',
  'Mendoza Capital', 'Palermo, Buenos Aires',
  'Polanco, Mexico', 'Santa Fe, CABA',
];

export default function Step01({ onNext }) {
  const { formData, updateFormData } = useFormContext();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.tipoPropiedad || !formData.operacion || !formData.ciudad) return;
    onNext();
  };

  const filtradas = CIUDADES_SUGERIDAS.filter(c => 
    c.toLowerCase().includes((formData.ciudad || '').toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <span className="text-label" style={{ color: 'var(--accent)', marginBottom: 8, display: 'block' }}>PASO 01</span>
        <h2 className="text-h2" style={{ marginBottom: 8 }}>Datos del producto o servicio</h2>
        <p style={{ fontFamily: 'DM Sans', fontSize: 15, color: 'var(--text-secondary)' }}>
          Tipo, ubicación y operación
        </p>
      </div>

      <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Tipo + Operación */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="input-wrapper">
            <label className="input-label">TIPO DE PRODUCTO O SERVICIO <span className="required">*</span></label>
            <select className="input select" value={formData.tipoPropiedad || ''}
              onChange={e => updateFormData({ tipoPropiedad: e.target.value })} required>
              <option value="">Seleccionar...</option>
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="input-wrapper">
            <label className="input-label">OPERACIÓN <span className="required">*</span></label>
            <select className="input select" value={formData.operacion || ''}
              onChange={e => updateFormData({ operacion: e.target.value })} required>
              <option value="">Seleccionar...</option>
              {OPERACIONES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* País + Idioma */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="input-wrapper">
            <label className="input-label">PAÍS</label>
            <select className="input select" value={formData.pais || ''}
              onChange={e => updateFormData({ pais: e.target.value })}>
              <option value="">Seleccionar país...</option>
              {PAISES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="input-wrapper">
            <label className="input-label">IDIOMA DEL CONTENIDO</label>
            <select className="input select" value={formData.idioma || ''}
              onChange={e => updateFormData({ idioma: e.target.value })}>
              <option value="">Seleccionar idioma...</option>
              {IDIOMAS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>

        {/* Ciudad */}
        <div className="input-wrapper" style={{ position: 'relative' }}>
          <label className="input-label">CIUDAD / ZONA <span className="required">*</span></label>
          <input className="input" placeholder="Ej: Palermo, Buenos Aires"
            value={formData.ciudad || ''}
            onChange={e => {
              updateFormData({ ciudad: e.target.value });
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            required />
          
          {showDropdown && (
            <div style={{ 
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, 
              background: 'var(--bg-card)', border: '1px solid var(--border)', 
              borderRadius: 8, marginTop: 4, maxHeight: 200, overflowY: 'auto',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {filtradas.length > 0 ? (
                filtradas.slice(0, 6).map(sug => (
                  <div 
                    key={sug} 
                    style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s', fontFamily: 'DM Sans', fontSize: 14 }}
                    onClick={() => {
                      updateFormData({ ciudad: sug });
                      setShowDropdown(false);
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'var(--accent-dim)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    {sug}
                  </div>
                ))
              ) : null}
              {formData.ciudad && formData.ciudad.trim().length > 0 && (
                <div
                  onClick={() => { updateFormData({ ciudad: formData.ciudad.trim() }); setShowDropdown(false); }}
                  style={{ 
                    padding: '10px 14px', 
                    color: '#00d4ff', 
                    cursor: 'pointer',
                    borderTop: filtradas.length > 0 ? '1px solid #374151' : 'none',
                    fontFamily: 'DM Sans', 
                    fontSize: 13 
                  }}
                >
                  ✚ Usar "{formData.ciudad.trim()}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dirección */}
        <div className="input-wrapper">
          <label className="input-label">DIRECCIÓN</label>
          <input className="input" placeholder="Calle, número, piso (opcional para el listado público)"
            value={formData.direccion || ''}
            onChange={e => updateFormData({ direccion: e.target.value })} />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
          <button type="submit" className="btn btn-primary" style={{ gap: 8 }}>
            Siguiente →
          </button>
        </div>
      </form>
    </div>
  );
}
