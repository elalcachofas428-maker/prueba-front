import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Check, Send, Rocket, Zap, Crown, Building2, ArrowRight, ArrowLeft } from 'lucide-react';
import { seleccionarPlanFree, crearPreferenciaMP } from '../services/api';
import Logo from '../components/Logo';

const PLANES = [
  {
    id: 'free',
    nombre: 'Free',
    desc: 'Probá la IA sin costo.',
    precio: '0',
    features: [
      '3 listados por mes',
      'Guiones IA',
      'PDF básicos',
      { text: 'Video (Watermark)', disabled: true },
    ],
    cta: 'Elegir Free',
    icon: <Rocket size={20} />,
    color: 'var(--text-secondary)'
  },
  {
    id: 'starter',
    nombre: 'Starter',
    desc: 'Agentes independientes.',
    precio: '39',
    features: [
      '10 listados por mes',
      'Guiones avanzados',
      'PDF personalizados',
      'Video sin marca',
    ],
    cta: 'Ir a Starter',
    icon: <Send size={20} />,
    color: '#38BDF8'
  },
  {
    id: 'pro',
    nombre: 'Pro',
    desc: 'Éxito garantizado.',
    precio: '89',
    popular: true,
    features: [
      'Listados ilimitados',
      'Guiones Pro',
      'PDF premium',
      'Video IA 4K',
      'Soporte 24/7',
    ],
    cta: 'El más elegido',
    icon: <Zap size={20} />,
    color: 'var(--accent)'
  },
  {
    id: 'scale',
    nombre: 'Scale',
    desc: 'Equipos en escala.',
    precio: '149',
    features: [
      'Todo lo de Pro',
      'Hasta 5 usuarios',
      'API integrada',
      'Manager dedicado',
    ],
    cta: 'Subir a Scale',
    icon: <Crown size={20} />,
    color: '#A855F7'
  },
  {
    id: 'business',
    nombre: 'Business',
    desc: 'Soluciones a medida.',
    precio: 'Ventas',
    business: true,
    features: [
      'Todo lo de Scale',
      'Usuarios ilimitados',
      'Desarrollo custom',
      'SLA garantizado',
    ],
    cta: 'Contactar',
    icon: <Building2 size={20} />,
    color: '#F472B6'
  }
];

export default function SelectPlanPage() {
  const { addToast } = useAppStore();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [periodo, setPeriodo] = useState('mensual');

  const handleFree = async () => {
    try {
      setLoadingPlan('free');
      await seleccionarPlanFree()
      const user = JSON.parse(localStorage.getItem('subzero_user')) || {}
      user.plan_seleccionado = true
      user.plan_nombre = 'free'
      user.plan_activo = true
      localStorage.setItem('subzero_user', JSON.stringify(user))
      localStorage.removeItem('leadbook_needs_onboarding')
      window.location.href = '/onboarding'
    } catch (e) {
      addToast({ type: 'error', title: 'Error', message: e.message });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handlePago = async (planId) => {
    try {
      setLoadingPlan(planId);
      const data = await crearPreferenciaMP(planId)
      const user = JSON.parse(localStorage.getItem('subzero_user')) || {}
      user.plan_seleccionado = true
      user.plan_nombre = planId
      localStorage.setItem('subzero_user', JSON.stringify(user))
      window.location.href = data.checkout_url
    } catch (e) {
      console.error('ERROR COMPLETO:', e);
      addToast({ type: 'error', title: 'Error al procesar pago', message: e.message });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleSelect = (plan) => {
    if (plan.id === 'business') {
      window.location.href = 'mailto:ventas@leadbook.io';
      return;
    }
    if (plan.id === 'free') {
      handleFree();
    } else {
      handlePago(plan.id);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden',
      background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '20px', zIndex: 1
    }}>
      {/* BUG 1: Botón Volver Fijo */}
      <button
        onClick={() => {
          localStorage.removeItem('subzero_access')
          localStorage.removeItem('subzero_refresh')
          localStorage.removeItem('subzero_user')
          window.location.href = '/'
        }}
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          zIndex: 9999,
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          padding: '8px 16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '13px',
          fontFamily: 'DM Sans',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
      >
        <ArrowLeft size={16} />
        Volver al inicio
      </button>

      {/* Header compact */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Logo size="small" />
          <span style={{ fontFamily:'Syne', fontWeight:800, fontSize:22, color:'var(--accent)', marginLeft: 10 }}>Lead<span style={{ color:'var(--text-primary)' }}>Book</span></span>
        </div>
        <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Elegí tu plan de despegue</h1>
        <p style={{ fontFamily: 'DM Sans', fontSize: 14, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
          Potenciá tus resultados con herramientas Pro de última generación.
        </p>
      </div>

      {/* Switch periodo compact */}
      <div style={{ 
        display: 'flex', background: 'var(--bg-surface)', padding: 3, borderRadius: 10, 
        border: '1px solid var(--border-subtle)', marginBottom: 32 
      }}>
        <button 
          onClick={() => setPeriodo('mensual')}
          style={{ 
            padding: '6px 20px', borderRadius: 7, border: 'none', cursor: 'pointer',
            fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500,
            background: periodo === 'mensual' ? 'var(--bg-base)' : 'transparent',
            color: periodo === 'mensual' ? 'var(--text-primary)' : 'var(--text-tertiary)',
            transition: 'all 0.2s'
          }}
        >
          Mensual
        </button>
        <button 
          onClick={() => setPeriodo('anual')}
          style={{ 
            padding: '6px 20px', borderRadius: 7, border: 'none', cursor: 'pointer',
            fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500,
            background: periodo === 'anual' ? 'var(--bg-base)' : 'transparent',
            color: periodo === 'anual' ? 'var(--text-primary)' : 'var(--text-tertiary)',
            transition: 'all 0.2s'
          }}
        >
          Anual <span style={{ color: 'var(--accent)', fontSize: 10, fontWeight: 700, marginLeft: 3 }}>-20%</span>
        </button>
      </div>

      {/* Cards de planes scaling */}
      <div style={{ 
        display: 'flex', gap: 16, justifyContent: 'center', width: '100%', maxWidth: 1300,
        flexWrap: 'nowrap', padding: '0 10px'
      }}>
        {PLANES.map(plan => (
          <div 
            key={plan.id}
            style={{
              flex: '1 1 0', minWidth: 200, maxWidth: 240, background: 'var(--bg-surface)',
              borderRadius: 24, padding: '24px 18px', border: plan.popular ? '2px solid var(--accent)' : '1.5px solid var(--border-subtle)',
              display: 'flex', flexDirection: 'column', position: 'relative',
              transition: 'transform 0.3s ease',
              boxShadow: plan.popular ? '0 15px 30px -15px var(--accent-dim)' : 'none',
              height: 'fit-content'
            }}
            className="plan-card"
          >
            {plan.popular && (
              <div style={{ 
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                background: 'var(--accent)', color: 'var(--bg-base)', padding: '3px 10px',
                borderRadius: 20, fontSize: 10, fontWeight: 800, fontFamily: 'Syne', whiteSpace: 'nowrap'
              }}>
                MÁS POPULAR
              </div>
            )}
            
            <div style={{ color: plan.color, marginBottom: 12 }}>{plan.icon}</div>
            <h3 style={{ fontFamily: 'Syne', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{plan.nombre}</h3>
            <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 16, minHeight: 32, lineHeight: 1.4 }}>{plan.desc}</p>
            
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>
                {plan.precio === 'Ventas' ? 'Ventas' : `$${plan.precio}`}
              </span>
              {plan.precio !== 'Ventas' && <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}> /mes</span>}
            </div>

            <div style={{ flex: 1, marginBottom: 20 }}>
              {plan.features.map((f, i) => {
                const isString = typeof f === 'string';
                const text = isString ? f : f.text;
                const disabled = !isString && f.disabled;
                return (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10, opacity: disabled ? 0.35 : 1 }}>
                    <Check size={14} color={disabled ? 'var(--text-tertiary)' : 'var(--accent)'} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ 
                      fontFamily: 'DM Sans', fontSize: 11, color: disabled ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                      textDecoration: disabled ? 'line-through' : 'none'
                    }}>{text}</span>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => handleSelect(plan)}
              disabled={!!loadingPlan}
              style={{
                width: '100%', padding: '12px', borderRadius: 12, border: 'none',
                background: plan.popular ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                color: plan.popular ? 'var(--bg-base)' : 'var(--text-primary)',
                fontFamily: 'Syne', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.2s',
                opacity: loadingPlan && loadingPlan !== plan.id ? 0.5 : 1
              }}
            >
              {loadingPlan === plan.id ? '...' : plan.cta}
              {!loadingPlan && <ArrowRight size={14} />}
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .plan-card:hover {
          transform: translateY(-5px);
        }
        @media (max-height: 800px) {
          .plan-card { padding: 18px 14px; }
          .plan-card h3 { font-size: 16px; }
          .plan-card p { font-size: 11px; margin-bottom: 12px; }
        }
      `}</style>
    </div>
  );
}
