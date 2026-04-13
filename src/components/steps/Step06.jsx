import { useState, useRef, useEffect } from 'react';
import { useFormContext } from '../../context/FormContext';
import { Upload, X, RotateCcw, GripVertical } from 'lucide-react';

export default function Step06({ onNext, onPrev }) {
  const { formData, updateFormData } = useFormContext();
  const portadaRef = useRef();
  const recorridoRef = useRef();

  useEffect(() => {
    const escenas = formData.escenas || [];
    
    // Si no hay portada cargada, usar la foto de la primera escena
    if (!formData.portadaUrl && escenas[0]?.fotoUrl) {
      updateFormData({ portadaUrl: escenas[0].fotoUrl });
    }
    
    // Si no hay fotos del recorrido, usar las fotos de todas las escenas
    if (!formData.fotosRecorrido || formData.fotosRecorrido.length === 0) {
      const fotosDeEscenas = escenas
        .map(e => e.fotoUrl)
        .filter(Boolean);
      if (fotosDeEscenas.length > 0) {
        updateFormData({ fotosRecorrido: fotosDeEscenas });
      }
    }
  }, []);

  const handlePortada = (file) => {
    if (!file) return;
    const MAX_W = 800;
    const QUALITY = 0.7;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, MAX_W / img.width);
      const canvas = document.createElement('canvas');
      canvas.width  = img.width  * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL('image/jpeg', QUALITY);
      URL.revokeObjectURL(url);
      updateFormData({ portadaUrl: compressed });
    };
    img.src = url;
  };

  const handleFotosRecorrido = (files) => {
    const current = formData.fotosRecorrido || [];
    const nuevas = Array.from(files).slice(0, 9 - current.length);
    let acumuladas = [...current];
    
    nuevas.forEach(file => {
      const MAX_W = 800;
      const QUALITY = 0.7;
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const scale = Math.min(1, MAX_W / img.width);
        const canvas = document.createElement('canvas');
        canvas.width  = img.width  * scale;
        canvas.height = img.height * scale;
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL('image/jpeg', QUALITY);
        URL.revokeObjectURL(url);
        acumuladas = [...acumuladas, compressed];
        updateFormData({ fotosRecorrido: acumuladas });
      };
      img.src = url;
    });
  };

  const removeRecorrido = (idx) => {
    const updated = (formData.fotosRecorrido || []).filter((_, i) => i !== idx);
    updateFormData({ fotosRecorrido: updated });
  };

  const formatos = [
    { key: 'generarStory',    label: 'Instagram Story (1080×1920)' },
    { key: 'generarCarrusel', label: 'Carrusel Instagram (5-7 slides)' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        <span className="text-label" style={{ color: 'var(--accent)', marginBottom: 8, display: 'block' }}>PASO 06</span>
        <h2 className="text-h2" style={{ marginBottom: 8 }}>Fotos y formatos</h2>
        <p style={{ fontFamily: 'DM Sans', fontSize: 15, color: 'var(--text-secondary)' }}>
          Imágenes para PDF, video e Instagram
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Portada */}
        <div>
          <label className="input-label" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            PORTADA
            <span className="badge badge-accent" style={{ fontSize: 9 }}>Principal</span>
          </label>
          <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 10 }}>
            Imagen principal del PDF y video
          </p>
          {formData.portadaUrl ? (
            <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <img src={formData.portadaUrl} alt="portada"
                style={{ width: '100%', height: 200, objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
                <button onClick={() => portadaRef.current?.click()} style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'rgba(7,11,20,0.8)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RotateCcw size={12} color="white" />
                </button>
                <button onClick={() => updateFormData({ portadaUrl: null })} style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'rgba(7,11,20,0.8)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={12} color="white" />
                </button>
              </div>
            </div>
          ) : (
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, border: '2px dashed var(--border-default)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', gap: 10, transition: 'all 0.15s', background: 'var(--bg-card)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-dim)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'var(--bg-card)'; }}>
              <Upload size={24} color="var(--text-tertiary)" />
              <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-secondary)' }}>Subir portada</span>
              <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'var(--text-tertiary)' }}>JPG, PNG hasta 10MB</span>
              <input type="file" accept="image/*" style={{ display: 'none' }} ref={portadaRef}
                onChange={e => handlePortada(e.target.files[0])} />
            </label>
          )}
          <input type="file" accept="image/*" style={{ display: 'none' }} ref={portadaRef}
            onChange={e => handlePortada(e.target.files[0])} />
        </div>

        {/* Fotos recorrido */}
        <div>
          <label className="input-label" style={{ marginBottom: 10, display: 'block' }}>
            FOTOS DEL RECORRIDO
          </label>
          <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 10 }}>
            Mín. 4, máx. 9 — ordenalas en secuencia del tour
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {/* Fotos subidas */}
            {(formData.fotosRecorrido || []).map((foto, idx) => (
              <div key={idx} style={{ position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <img src={foto} alt={`foto ${idx + 1}`}
                  style={{ width: '100%', height: 80, objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 2, left: 4, fontFamily: 'Syne', fontSize: 10, fontWeight: 700, color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{idx + 1}</div>
                <button onClick={() => removeRecorrido(idx)} style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: 'rgba(7,11,20,0.8)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={9} color="white" />
                </button>
              </div>
            ))}

            {/* Agregar más */}
            {(formData.fotosRecorrido || []).length < 9 && (
              <label style={{ height: 80, border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 4, transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}>
                <Upload size={14} color="var(--text-tertiary)" />
                <span style={{ fontFamily: 'DM Sans', fontSize: 10, color: 'var(--text-tertiary)' }}>Agregar</span>
                <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                  onChange={e => handleFotosRecorrido(e.target.files)} />
              </label>
            )}
          </div>

          <div style={{ marginTop: 8, fontFamily: 'DM Sans', fontSize: 11, color: 'var(--text-tertiary)' }}>
            {(formData.fotosRecorrido || []).length}/9 fotos
          </div>
        </div>
      </div>

      {/* Formatos adicionales */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <label className="input-label" style={{ marginBottom: 14, display: 'block' }}>FORMATOS ADICIONALES (OPCIONAL)</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {formatos.map(f => {
            const isSelected = formData[f.key] || false;
            return (
              <label key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                onClick={() => updateFormData({ [f.key]: !isSelected })}>
                <div style={{ width: 20, height: 20, borderRadius: 4, border: isSelected ? 'none' : '1.5px solid var(--border-default)', background: isSelected ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                  {isSelected && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#070B14" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
                </div>
                <span style={{ fontFamily: 'DM Sans', fontSize: 14, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{f.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
        <button type="button" className="btn btn-secondary" onClick={onPrev}>← Anterior</button>
        <button type="button" className="btn btn-primary" onClick={onNext} style={{ gap: 8 }}>Siguiente →</button>
      </div>
    </div>
  );
}
