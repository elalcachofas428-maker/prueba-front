import { useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import { useAppStore } from '../../store/useAppStore';
import { API_BASE_URL } from '../../services/api';
import Toggle from '../ui/Toggle';

const TIPOS_VIDEO = [
  { value: 'reel',  label: 'Reel rápido',    desc: '15-25 seg · Showcase rápido',       emoji: '⚡' },
  { value: 'tour',  label: 'Tour narrado',    desc: '45-60 seg · Recorrido detallado',   emoji: '🏠' },
];
const VOCES = [
  { value: 'femenina',  label: 'Femenina',  emoji: '👩' },
  { value: 'masculina', label: 'Masculina', emoji: '👨' },
];
const TONOS = [
  { value: 'profesional', label: 'Profesional', emoji: '💼' },
  { value: 'lujo',        label: 'Lujo',        emoji: '✨' },
  { value: 'energetico',  label: 'Energético',  emoji: '🔥' },
];

export default function Step04({ onNext, onPrev }) {
  const { formData, updateFormData } = useFormContext();
  const { addToast } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // TAREA 5 — el usuario debe elegir explícitamente un tipo de video
  const tipoVideoSeleccionado = formData.tipoVideo; // sin fallback
  const canProceed = !!tipoVideoSeleccionado && !loading;

  const handleNext = async () => {
    if (!tipoVideoSeleccionado) {
      setError('Elegí el tipo de video antes de continuar.');
      return;
    }
    setError('');

    // Si ya hay escenas generadas para este tipo, saltear la llamada
    if (formData.escenas && formData.escenas.length > 0) {
      onNext();
      return;
    }

    setLoading(true);
    updateFormData({ escenas: [] });

    const controller = new AbortController();
    // TAREA 3a — timeout de 30 segundos
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      // TAREA 3b — fetch solo en handleNext, nunca en useEffect
      // TAREA 3c — token key: 'subzero_access'
      const response = await fetch(`${API_BASE_URL}/generar-guion/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('subzero_access')}`
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 403) throw new Error('LIMITE_ALCANZADO');
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result?.escenas?.length) {
        updateFormData({ escenas: result.escenas });
        addToast({
          type: 'success',
          title: 'Guión generado',
          message: `${result.escenas.length} escenas listas para revisar`
        });
        onNext();
      } else {
        throw new Error('Sin escenas');
      }

    } catch (err) {
      // TAREA 4 — manejo diferenciado de errores
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError('El servidor tardó demasiado. Hacé click en Siguiente de nuevo.');
        addToast({
          type: 'warning',
          title: 'Tiempo agotado',
          message: 'El servidor tardó demasiado. Intentá de nuevo.'
        });
      } else if (err.message === 'LIMITE_ALCANZADO' || err.message?.includes('403')) {
        setError('');
        addToast({
          type: 'error',
          title: '¡Límite de tu plan alcanzado!',
          message: 'Actualizá tu plan en /precios para seguir generando contenido.'
        });
      } else {
        setError('Error al generar guión. Intentá de nuevo.');
        addToast({
          type: 'error',
          title: 'Error al generar guión',
          message: 'Revisá tu conexión e intentá de nuevo.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        <span className="text-label" style={{ color: 'var(--accent)', marginBottom: 8, display: 'block' }}>PASO 04</span>
        <h2 className="text-h2" style={{ marginBottom: 8 }}>Video y voiceover</h2>
        <p style={{ fontFamily: 'DM Sans', fontSize: 15, color: 'var(--text-secondary)' }}>Configurá tu video con IA</p>
      </div>

      {/* Tipo de video — TAREA 5: sin fallback para forzar elección explícita */}
      <div style={{ marginBottom: 24 }}>
        <label className="input-label" style={{ marginBottom: 12, display: 'block' }}>
          TIPO DE VIDEO <span style={{ color: 'var(--accent)' }}>*</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {TIPOS_VIDEO.map(tipo => {
            const isSelected = tipoVideoSeleccionado === tipo.value;
            return (
              <div key={tipo.value}
                onClick={() => updateFormData({ tipoVideo: tipo.value, escenas: [] })}
                className={isSelected ? 'card card-selected' : 'card card-hover'}
                style={{ padding: '20px 24px', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{tipo.emoji}</div>
                <div style={{
                  fontFamily: 'Syne', fontSize: 15, fontWeight: 600,
                  color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                  marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  {tipo.label}
                </div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--text-secondary)' }}>{tipo.desc}</div>
              </div>
            );
          })}
        </div>
        {/* Mensaje de validación TAREA 5 */}
        {error && (
          <p style={{
            fontFamily: 'DM Sans', fontSize: 13,
            color: 'var(--error, #ef4444)',
            marginTop: 8
          }}>
            {error}
          </p>
        )}
      </div>

      {/* Toggle voiceover */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 20 }}>
        <Toggle
          value={formData.voiceover || false}
          onChange={v => updateFormData({ voiceover: v })}
          label="¿Agregar voiceover al video?"
          subtitle="La IA narrará el guión con voz sintética"
        />
      </div>

      {/* Opciones de voz (condicional) */}
      {formData.voiceover && (
        <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
          {/* Voz */}
          <div>
            <label className="input-label" style={{ marginBottom: 10, display: 'block' }}>VOZ</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {VOCES.map(v => {
                const isSelected = (formData.voz || 'femenina') === v.value;
                return (
                  <div key={v.value} onClick={() => updateFormData({ voz: v.value })}
                    className={isSelected ? 'card card-selected' : 'card card-hover'}
                    style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{v.emoji}</span>
                    <span style={{
                      fontFamily: 'DM Sans', fontSize: 14, fontWeight: 500,
                      color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                      textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>
                      {v.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tono */}
          <div>
            <label className="input-label" style={{ marginBottom: 10, display: 'block' }}>TONO</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {TONOS.map(t => {
                const isSelected = (formData.tono || 'profesional') === t.value;
                return (
                  <div key={t.value} onClick={() => updateFormData({ tono: t.value })}
                    className={isSelected ? 'card card-selected' : 'card card-hover'}
                    style={{ padding: '16px', cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{t.emoji}</div>
                    <div style={{
                      fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500,
                      color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                      textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>
                      {t.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contexto adicional */}
          <div className="input-wrapper">
            <label className="input-label">CONTEXTO ADICIONAL (OPCIONAL)</label>
            <textarea className="textarea" rows={2}
              placeholder="Ej: Mencionar que es esquina, enfatizar la vista al mar, destacar cercanía a escuelas..."
              value={formData.contextoAdicional || ''}
              onChange={e => updateFormData({ contextoAdicional: e.target.value })} />
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
        <button type="button" className="btn btn-secondary" onClick={onPrev} disabled={loading}>← Anterior</button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!canProceed}
          title={!tipoVideoSeleccionado ? 'Elegí el tipo de video primero' : ''}
          style={{ gap: 8, minWidth: 160 }}
        >
          {loading ? (
            <>
              <div className="btn-spinner" />
              ✨ La IA está escribiendo tu guión...
            </>
          ) : (
            'Siguiente →'
          )}
        </button>
      </div>
    </div>
  );
}
