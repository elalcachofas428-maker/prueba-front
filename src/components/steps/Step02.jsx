import { useFormContext } from '../../context/FormContext';
import NumInput from '../ui/NumInput';

const MONEDAS = ['USD', 'ARS', 'MXN', 'CLP', 'COP'];

export default function Step02({ onNext, onPrev }) {
  const { formData, updateFormData } = useFormContext();

  const handlePrecioChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const formatted = raw ? Number(raw).toLocaleString('en-US') : '';
    e.target.value = formatted;
    updateFormData({ precio: raw });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.precio || !formData.superficieCubierta) return;
    onNext();
  };

  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        <span className="text-label" style={{ color: 'var(--accent)', marginBottom: 8, display: 'block' }}>PASO 02</span>
        <h2 className="text-h2" style={{ marginBottom: 8 }}>Precio y características</h2>
        <p style={{ fontFamily: 'DM Sans', fontSize: 15, color: 'var(--text-secondary)' }}>Especificaciones y superficie</p>
      </div>

      <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Precio */}
        <div className="input-wrapper">
          <label className="input-label">PRECIO <span className="required">*</span></label>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="input select" style={{ width: 110, flexShrink: 0 }}
              value={formData.moneda || 'USD'}
              onChange={e => updateFormData({ moneda: e.target.value })}>
              {MONEDAS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input className="input" type="text" placeholder="Ej: 250,000" required
              value={formData.precio ? Number(formData.precio).toLocaleString('en-US') : ''}
              onChange={handlePrecioChange} />
          </div>
        </div>

        {/* Grid de specs con Steppers +/- */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <NumInput 
            label="RECÁMARAS" 
            value={formData.recamaras} 
            onChange={val => updateFormData({ recamaras: val })} 
          />
          <NumInput 
            label="BAÑOS" 
            value={formData.banos} 
            onChange={val => updateFormData({ banos: val })} 
          />

          <div className="input-wrapper">
            <label className="input-label">SUPERFICIE CONSTRUIDA (M²) <span className="required">*</span></label>
            <input
              className="input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Ej: 180"
              required
              value={formData.superficieCubierta || ''}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                updateFormData({ superficieCubierta: val });
              }}
            />
          </div>

          <div className="input-wrapper">
            <label className="input-label">SUPERFICIE TERRENO (M²)</label>
            <input
              className="input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Ej: 250"
              value={formData.superficieTotal || ''}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                updateFormData({ superficieTotal: val });
              }}
            />
          </div>

          <NumInput 
            label="ESTACIONAMIENTOS" 
            value={formData.estacionamientos} 
            onChange={val => updateFormData({ estacionamientos: val })} 
          />
          <NumInput 
            label="PISOS / NIVELES" 
            value={formData.niveles} 
            onChange={val => updateFormData({ niveles: val })} 
          />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
          <button type="button" className="btn btn-secondary" onClick={onPrev} style={{ gap: 6 }}>← Anterior</button>
          <button type="submit" className="btn btn-primary" style={{ gap: 8 }}>Siguiente →</button>
        </div>
      </form>
    </div>
  );
}
