import { useState, useEffect } from 'react';
import { useFormContext } from '../../context/FormContext';
import { useAuth } from '../../context/AuthContext';
import { Zap } from 'lucide-react';

export default function Step07({ onPrev, onGenerar }) {
  const { formData, updateFormData } = useFormContext();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Pre-llenar con datos del usuario si están disponibles
  useEffect(() => {
    if (user) {
      const updates = {};
      if (!formData.agenteNombre) updates.agenteNombre = user.name || '';
      if (!formData.agenteEmail) updates.agenteEmail = user.email || '';
      if (!formData.agenciaNombre || formData.agenciaNombre === 'Tu Negocio') {
        updates.agenciaNombre = user.agencyName || '';
      }
      if (Object.keys(updates).length > 0) updateFormData(updates);
    }
  }, [user]);

  const handleGenerar = async (e) => {
    e.preventDefault();
    if (!formData.agenteNombre || !formData.agenteTelefono) return;

    const digits = formData.agenteTelefono.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
      setPhoneError('Ingresá un teléfono válido');
      return;
    }

    setLoading(true);
    try {
      await onGenerar();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        <span className="text-label" style={{ color: 'var(--accent)', marginBottom: 8, display: 'block' }}>PASO 07</span>
        <h2 className="text-h2" style={{ marginBottom: 8 }}>Contacto del responsable</h2>
        <p style={{ fontFamily: 'DM Sans', fontSize: 15, color: 'var(--text-secondary)' }}>
          Datos de contacto para el listado
        </p>
      </div>

      <form onSubmit={handleGenerar} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="input-wrapper">
            <label className="input-label">NOMBRE DEL RESPONSABLE <span className="required">*</span></label>
            <input className="input" placeholder="Ej: María García" required
              value={formData.agenteNombre || ''}
              onChange={e => updateFormData({ agenteNombre: e.target.value })} />
          </div>
          <div className="input-wrapper">
            <label className="input-label">TELÉFONO <span className="required">*</span></label>
            <input className="input" placeholder="Ej: 541112345678" required
              value={formData.agenteTelefono || ''}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '');
                updateFormData({ agenteTelefono: val });
                if (phoneError) setPhoneError('');
              }} />
            {phoneError && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block', fontFamily: 'DM Sans' }}>{phoneError}</span>}
          </div>
          <div className="input-wrapper">
            <label className="input-label">EMAIL</label>
            <input className="input" type="email" placeholder="Ej: tu@email.com"
              value={formData.agenteEmail || ''}
              onChange={e => updateFormData({ agenteEmail: e.target.value })} />
          </div>
          <div className="input-wrapper">
            <label className="input-label">NOMBRE DE LA EMPRESA</label>
            <input className="input" placeholder="Ej: Tu Negocio"
              value={formData.agenciaNombre || ''}
              onChange={e => updateFormData({ agenciaNombre: e.target.value })} />
          </div>
        </div>

        {/* Resumen */}
        <div className="card" style={{ padding: '20px 24px', background: 'linear-gradient(135deg, var(--accent-dim), transparent)' }}>
          <div className="text-label" style={{ marginBottom: 12 }}>RESUMEN DEL LISTADO</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {[
              { label: 'Tipo',        value: formData.tipoPropiedad || '—' },
              { label: 'Operación',   value: formData.operacion     || '—' },
              { label: 'Ciudad',      value: formData.ciudad        || '—' },
              { label: 'Precio',      value: formData.precio ? `${formData.moneda || 'USD'} ${Number(formData.precio).toLocaleString()}` : '—' },
              { label: 'Escenas',     value: `${(formData.escenas || []).length} escenas` },
              { label: 'Fotos',       value: `${(formData.fotosRecorrido || []).length} fotos` },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-tertiary)' }}>{item.label}</span>
                <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
          <button type="button" className="btn btn-secondary" onClick={onPrev} disabled={loading}>← Anterior</button>
          <button type="submit" className={`btn btn-primary btn-lg ${loading ? 'btn-loading' : ''}`} disabled={loading} style={{ gap: 10 }}>
            {loading ? (
              <><div className="btn-spinner" /> Generando...</>
            ) : (
              <><Zap size={18} /> Generar Listado Profesional</>
            )}
          </button>
        </div>
        <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: -8 }}>
          La generación toma aproximadamente 10-15 segundos
        </p>
      </form>
    </div>
  );
}
