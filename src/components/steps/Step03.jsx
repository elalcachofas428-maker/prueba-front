import { useState, useEffect } from 'react';
import { useFormContext } from '../../context/FormContext';
import { API_BASE_URL } from '../../services/api';

const AMENIDADES_LIST = [
  'Estacionamiento','Alberca','Jardín','Terraza',
  'Gimnasio','Seguridad 24h','Elevador','Cuarto de servicio',
  'Bodega','Roof Garden','Área de juegos','Pet Friendly',
  'Amueblado','Aire acondicionado','Calefacción','Cocina integral',
];

const DEFAULT_AMENIDADES_SUGERIDAS = [
  'Vista al mar', 'Vista a la montaña', 'Acceso privado',
  'Smart home', 'Paneles solares', 'Cisterna',
  'Generador eléctrico', 'Cuarto de juegos', 'Cava de vinos',
  'Spa', 'Sauna', 'Cancha de tenis', 'Cancha de paddle',
  'Pileta climatizada', 'Quincho', 'Parrilla',
  'Portería 24h', 'Cámaras de seguridad', 'Alarma',
];

export default function Step03({ onNext, onPrev }) {
  const { formData, updateFormData } = useFormContext();
  const selected = formData.amenidades || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [amenidadesSugeridas, setAmenidadesSugeridas] = useState(DEFAULT_AMENIDADES_SUGERIDAS);

  useEffect(() => {
    const token = localStorage.getItem('subzero_access');
    fetch(`${API_BASE_URL}/amenidades-presets/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => {
      const guardadas = data.presets || [];
      setAmenidadesSugeridas([
        ...new Set([...DEFAULT_AMENIDADES_SUGERIDAS, ...guardadas])
      ]);
    })
    .catch(() => {}); // silencioso si falla
  }, []);

  const handleAgregarAmenidad = async (nombre) => {
    updateFormData({ amenidades: [...selected, nombre] });
    
    const token = localStorage.getItem('subzero_access');
    fetch(`${API_BASE_URL}/amenidades-presets/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nombre })
    }).catch(() => {});
  };

  const toggle = (item) => {
    const updated = selected.includes(item)
      ? selected.filter(a => a !== item)
      : [...selected, item];
    updateFormData({ amenidades: updated });
  };

  const selectAll = () => updateFormData({ amenidades: [...AMENIDADES_LIST] });
  const clearAll  = () => updateFormData({ amenidades: [] });

  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        <span className="text-label" style={{ color: 'var(--accent)', marginBottom: 8, display: 'block' }}>PASO 03</span>
        <h2 className="text-h2" style={{ marginBottom: 8 }}>Amenidades</h2>
        <p style={{ fontFamily: 'DM Sans', fontSize: 15, color: 'var(--text-secondary)' }}>
          Seleccioná las características del producto o servicio
        </p>
      </div>

      {/* Acciones rápidas */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={selectAll}>Seleccionar todas</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={clearAll}
          style={{ color: 'var(--text-tertiary)' }}>Limpiar</button>
        <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-tertiary)', marginLeft: 'auto', alignSelf: 'center' }}>
          {selected.length} seleccionadas
        </span>
      </div>

      {/* Grid de amenidades */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginBottom: 24 }}>
        {[...new Set([...AMENIDADES_LIST, ...selected])].map(item => {
          const isSelected = selected.includes(item);
          return (
            <div key={item} onClick={() => toggle(item)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 'var(--radius-md)',
              border: isSelected ? '1px solid var(--border-accent)' : '1px solid var(--border-subtle)',
              background: isSelected ? 'var(--accent-dim)' : 'var(--bg-card)',
              cursor: 'pointer', transition: 'all 0.15s ease',
              height: 44,
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                border: isSelected ? 'none' : '1.5px solid var(--border-default)',
                background: isSelected ? 'var(--accent)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s', animation: isSelected ? 'checkPop 0.2s ease' : 'none',
              }}>
                {isSelected && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#070B14" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
              </div>
              <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: isSelected ? 'var(--accent)' : 'var(--text-secondary)', lineHeight: 1.2 }}>
                {item}
              </span>
            </div>
          );
        })}
      </div>

      {/* Otras amenidades */}
      <div className="input-wrapper" style={{ marginBottom: 16, position: 'relative' }}>
        <label className="input-label">OTRAS AMENIDADES</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input 
            className="input" 
            placeholder="Buscar o escribir nueva amenidad..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ width: "auto" }}
            onClick={() => {
              if (searchTerm.trim() && !selected.includes(searchTerm.trim())) {
                handleAgregarAmenidad(searchTerm.trim());
              }
              setSearchTerm('');
              setShowDropdown(false);
            }}
          >
            Agregar
          </button>
        </div>
        
        {showDropdown && (
          <div style={{ 
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, 
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', 
            borderRadius: 'var(--radius-md)', marginTop: 4, maxHeight: 200, overflowY: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {amenidadesSugeridas.filter(a => a.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 ? (
              amenidadesSugeridas.filter(a => a.toLowerCase().includes(searchTerm.toLowerCase())).map(sug => (
                <div 
                  key={sug} 
                  style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s', fontFamily: 'DM Sans', fontSize: 14 }}
                  onClick={() => {
                    if (!selected.includes(sug)) {
                      handleAgregarAmenidad(sug);
                    }
                    setSearchTerm('');
                    setShowDropdown(false);
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--accent-dim)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  {sug}
                </div>
              ))
            ) : (
              <div style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontFamily: 'DM Sans', fontSize: 13 }}>
                No hay sugerencias. Hacé clic en "Agregar" para guardarla.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notas adicionales */}
      <div className="input-wrapper">
        <label className="input-label">NOTAS ADICIONALES</label>
        <textarea className="textarea" rows={3}
          placeholder="Ej: Recién remodelada, cerca de escuelas, excelente vista panorámica..."
          value={formData.notas || ''}
          onChange={e => updateFormData({ notas: e.target.value })} />
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
        <button type="button" className="btn btn-secondary" onClick={onPrev}>← Anterior</button>
        <button type="button" className="btn btn-primary" onClick={onNext}>Siguiente →</button>
      </div>
    </div>
  );
}
