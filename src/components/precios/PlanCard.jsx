import React, { useState } from 'react';
import { Check, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { crearCheckoutSession } from '../../services/api';
import { useAppStore } from '../../store/useAppStore';

export default function PlanCard({ plan, billingPeriod, isCurrentPlan }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useAppStore();
  const [loading, setLoading] = useState(false);
  
  const isScale = plan.id === 'scale';
  const price = billingPeriod === 'anual' ? plan.precioAnual : plan.precioMensual;
  
  const handleClick = async () => {
    if (isCurrentPlan) return;
    
    if (plan.ctaLink.startsWith('mailto:')) {
      window.location.href = plan.ctaLink;
      return;
    }
    
    if (plan.id === 'free') {
      navigate(user ? '/dashboard' : '/login');
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const data = await crearCheckoutSession(plan.id, billingPeriod);
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (e) {
      addToast({ type: 'error', title: 'Error', message: 'Error al iniciar el pago. Intentá de nuevo.' });
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      borderRadius: 'var(--radius-lg)',
      background: plan.destacado ? 'linear-gradient(180deg, rgba(0,196,212,0.06) 0%, var(--bg-card) 40%)' : 'var(--bg-card)',
      border: plan.destacado ? '1px solid var(--accent)' : isScale ? '1px solid rgba(180,126,255,0.3)' : '1px solid var(--border-subtle)',
      boxShadow: plan.destacado ? '0 0 0 1px rgba(0,196,212,0.2), 0 8px 32px rgba(0,196,212,0.08)' : isScale ? '0 8px 32px rgba(180,126,255,0.05)' : 'none',
      position: 'relative',
      paddingTop: plan.badge ? 14 : 0
    }}>
      {plan.badge && (
        <div style={{
          position: 'absolute', top: -1, left: '50%', transform: 'translate(-50%, -50%)',
          background: 'var(--accent)', color: '#070B14', fontSize: 10, fontWeight: 700,
          textTransform: 'uppercase', padding: '4px 14px', borderRadius: 'var(--radius-full)', letterSpacing: '0.05em'
        }}>
          {plan.badge}
        </div>
      )}

      <div style={{ padding: 28, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: plan.color, fontFamily: 'Syne' }}>
            {plan.nombre}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            {plan.descripcion}
          </p>
        </div>

        <div style={{ margin: '24px 0' }}>
          {plan.precioMensual === 0 ? (
            <div style={{ fontSize: 40, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Syne', lineHeight: 1 }}>
              Gratis
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 40, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Syne', lineHeight: 1 }}>
                  ${price}
                </span>
                <span style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
                  {billingPeriod === 'anual' ? '/año' : '/mes'}
                </span>
              </div>
              {billingPeriod === 'anual' && (
                <span style={{ fontSize: 12, background: 'rgba(29, 158, 117, 0.12)', color: 'var(--success)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                  -25%
                </span>
              )}
            </div>
          )}
        </div>

        <div style={{ height: 1, background: 'var(--border-subtle)', width: '100%' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '20px 0', flex: 1 }}>
          {plan.features.map((ft, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '2px 0' }}>
              {ft.incluido ? (
                <Check size={16} color={plan.id === 'pro' ? 'var(--accent)' : plan.color} style={{ flexShrink: 0, marginTop: 2 }} />
              ) : (
                <Minus size={16} color="var(--text-tertiary)" style={{ flexShrink: 0, opacity: 0.4, marginTop: 2 }} />
              )}
              <span style={{ fontSize: 14, color: ft.incluido ? 'var(--text-primary)' : 'var(--text-tertiary)', lineHeight: 1.4 }}>
                {ft.texto}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto' }}>
          {isCurrentPlan ? (
            <button className="btn" disabled style={{ width: '100%', borderRadius: 24, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
              Plan actual ✓
            </button>
          ) : plan.destacado ? (
            <button className="btn btn-primary" style={{ width: '100%', borderRadius: 24, backgroundColor: 'var(--accent)' }} onClick={handleClick} disabled={loading}>
              {loading ? 'Redirigiendo...' : plan.cta}
            </button>
          ) : plan.btnStyle === 'outline-violet' ? (
            <button className="btn" style={{ width: '100%', borderRadius: 24, border: '1px solid #b47eff', background: 'transparent', color: '#b47eff' }} onClick={handleClick} disabled={loading}>
              {loading ? 'Redirigiendo...' : plan.cta}
            </button>
          ) : isScale ? (
            <button className="btn" style={{ width: '100%', borderRadius: 24, background: '#b47eff', color: '#070B14' }} onClick={handleClick} disabled={loading}>
              {loading ? 'Redirigiendo...' : plan.cta}
            </button>
          ) : (
            <button className="btn btn-secondary" style={{ width: '100%', borderRadius: 24 }} onClick={handleClick} disabled={loading}>
              {loading ? 'Redirigiendo...' : plan.cta}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
