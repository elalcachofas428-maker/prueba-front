import { useRef, useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import { useAppStore } from '../../store/useAppStore';
import { generarGuion } from '../../services/api';
import { RefreshCw, Upload, X } from 'lucide-react';

const ESCENA_ICONS = { Fachada: '🏠', Sala: '🛋️', Cocina: '🍳', Recámara: '🛏️', Jardín: '🌿', Cierre: '📞', default: '📍' };

export default function Step05({ onNext, onPrev }) {
  const { formData, updateFormData } = useFormContext();
  const { addToast } = useAppStore();
  const [loadingGuion, setLoadingGuion] = useState(false);
  const escenas = formData.escenas || [];
  const totalPalabras = escenas.reduce((sum, e) => {
    const texto = e.texto || '';
    return sum + texto.trim().split(/\s+/).filter(Boolean).length;
  }, 0);
  const palabrasPorSegundo = 2.17;
  const duracionSeg = Math.max(0, Math.round(totalPalabras / palabrasPorSegundo));
  const duracionDisplay = duracionSeg >= 60
    ? `${Math.floor(duracionSeg / 60)}m ${duracionSeg % 60}s`
    : `${duracionSeg}s`;
  const fotosListas = escenas.filter(e => e.fotoUrl && e.fotoUrl !== 'null' && e.fotoUrl !== null).length;

  const updateEscena = (idx, field, value) => {
    const updated = escenas.map((e, i) => i === idx ? { ...e, [field]: value } : e);
    updateFormData({ escenas: updated });
  };

  const handleFoto = (idx, file) => {
    if (!file) return;
    const MAX_W = 800;
    const QUALITY = 0.7;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, MAX_W / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL('image/jpeg', QUALITY);
      URL.revokeObjectURL(url);
      updateEscena(idx, 'fotoUrl', compressed);
    };
    img.src = url;
  };

  const handleRegenerar = async () => {
    setLoadingGuion(true);
    try {
      addToast({ type: 'info', title: 'Regenerando...', message: 'Generando nuevo guión con IA' });
      const result = await generarGuion(formData);
      if (result?.escenas?.length) {
        updateFormData({ escenas: result.escenas });
        addToast({ type: 'success', title: 'Guión regenerado', message: 'Escenas actualizadas correctamente' });
      }
    } catch (e) {
      addToast({ type: 'error', title: 'Error', message: 'Revisá tu conexión e intentá de nuevo' });
    } finally {
      setLoadingGuion(false);
    }
  };

  if (escenas.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
        <h3 className="text-h3" style={{ marginBottom: 8 }}>No hay guión generado</h3>
        <p style={{ fontFamily: 'DM Sans', color: 'var(--text-secondary)', marginBottom: 24 }}>Volvé al paso anterior y generá el guión primero.</p>
        <button className="btn btn-secondary" onClick={onPrev}>← Volver</button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <span className="text-label" style={{ color: 'var(--accent)', marginBottom: 8, display: 'block' }}>PASO 05</span>
          <h2 className="text-h2" style={{ marginBottom: 8 }}>Revisá tu guión</h2>
          <p style={{ fontFamily: 'DM Sans', fontSize: 15, color: 'var(--text-secondary)' }}>
            Editá el texto y subí la foto de cada escena
          </p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={handleRegenerar} disabled={loadingGuion} style={{ gap: 6, flexShrink: 0 }}>
          <RefreshCw size={14} className={loadingGuion ? "spinner" : ""} /> 
          {loadingGuion ? 'Regenerando...' : 'Regenerar'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { value: totalPalabras, label: 'PALABRAS TOTALES', color: 'var(--accent)' },
          { value: duracionDisplay, label: 'DURACIÓN ESTIMADA', color: 'var(--text-primary)' },
          { value: `${fotosListas}/${escenas.length}`, label: 'FOTOS LISTAS', color: fotosListas === escenas.length ? 'var(--success)' : 'var(--warning)' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Syne', fontSize: 26, fontWeight: 800, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
            <div className="text-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Escenas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
        {escenas.map((escena, idx) => {
          const palabras = escena.texto?.trim().split(/\s+/).filter(Boolean).length || 0;
          const seg = Math.max(0, Math.round(palabras / 2.17));
          const segDisplay = seg >= 60 ? `${Math.floor(seg / 60)}m ${seg % 60}s` : `${seg}s`;
          const icon = ESCENA_ICONS[escena.nombre] || ESCENA_ICONS.default;

          return (
            <div key={idx} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Header de escena */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-panel)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, marginRight: 12 }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <input
                    type="text"
                    value={escena.nombre || ''}
                    onChange={(e) => updateEscena(idx, 'nombre', e.target.value)}
                    placeholder={`Escena ${idx + 1}`}
                    style={{ 
                      fontFamily: 'Syne', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
                      background: 'transparent', border: 'none', borderBottom: '1px solid transparent',
                      width: '100%', outline: 'none'
                    }}
                    onFocus={e => e.target.style.borderBottom = '1px solid var(--accent)'}
                    onBlur={e => e.target.style.borderBottom = '1px solid transparent'}
                  />
                </div>
                <span className="badge badge-accent" style={{ fontSize: 10 }}>ESCENA {idx + 1}</span>
              </div>

              {/* Cuerpo */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 0 }}>
                {/* Texto editable */}
                <div style={{ padding: '16px' }}>
                  <textarea
                    className="textarea"
                    style={{ minHeight: 90, resize: 'none', fontSize: 14 }}
                    value={escena.texto || ''}
                    onChange={e => updateEscena(idx, 'texto', e.target.value)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                    <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: 'var(--text-tertiary)' }}>
                      {palabras} palabras · ~{segDisplay}
                    </span>
                  </div>
                </div>

                {/* Upload foto */}
                <div style={{ borderLeft: '1px solid var(--border-subtle)', padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {escena.fotoUrl && escena.fotoUrl !== 'null' ? (
                    <div style={{ position: 'relative', width: '100%' }}>
                      <img src={escena.fotoUrl} alt={`Escena ${idx + 1}`}
                        style={{ width: '100%', height: 'auto', borderRadius: 8, objectFit: 'cover' }} />
                      <button onClick={() => updateEscena(idx, 'fotoUrl', null)}
                        style={{ position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={14} color="white" />
                      </button>
                    </div>
                  ) : (
                    <label style={{ width: '100%', textAlign: 'center', padding: 20, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
                      <p style={{ fontFamily: 'DM Sans', fontSize: 13 }}>Click aquí para agregar foto</p>
                      <input type="file" accept="image/*" style={{ display: 'none' }}
                        onChange={e => handleFoto(idx, e.target.files[0])} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
        <button type="button" className="btn btn-secondary" onClick={onPrev}>← Anterior</button>
        <button type="button" className="btn btn-primary" onClick={onNext}>Siguiente →</button>
      </div>
    </div>
  );
}
