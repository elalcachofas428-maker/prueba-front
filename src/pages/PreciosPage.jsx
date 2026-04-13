import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PlanCard from '../components/precios/PlanCard';
import ToggleBillingPeriod from '../components/precios/ToggleBillingPeriod';
import FaqAccordion from '../components/precios/FaqAccordion';
import ComparativaTable from '../components/precios/ComparativaTable';
import LandingNavbar from '../components/landing/LandingNavbar';

export default function PreciosPage() {
  const [billingPeriod, setBillingPeriod] = useState('mensual');
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const checkoutStatus = searchParams.get('checkout');

  const [currentPlan, setCurrentPlan] = useState('free');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('subzero_user') || '{}');
    console.log('Plan del localStorage:', user.plan_nombre);
    console.log('Usuario completo:', user);
    setCurrentPlan(user.plan_nombre?.toLowerCase() || 'free');
  }, []);

  const planes = [
    {
      id: 'free',
      nombre: 'Free',
      descripcion: 'Para probar la plataforma',
      precioMensual: 0,
      precioAnual: 0,
      moneda: 'USD',
      badge: null,
      destacado: false,
      cta: 'Empezar gratis',
      ctaLink: '/register',
      color: 'var(--text-tertiary)',
      features: [
        { texto: '5 publicaciones / mes', incluido: true },
        { texto: 'PDF básico', incluido: true },
        { texto: '1 imagen (post simple)', incluido: true },
        { texto: '1 nicho', incluido: true },
        { texto: 'Generación básica de contenido', incluido: true },
        { texto: 'Sin story ni carrusel', incluido: false },
        { texto: 'Sin video con IA', incluido: false },
        { texto: 'Sin alta calidad', incluido: false },
        { texto: 'Sin branding personalizable', incluido: false },
        { texto: 'Sin publicación automática', incluido: false },
      ]
    },
    {
      id: 'starter',
      nombre: 'Starter',
      descripcion: 'Para arrancar',
      precioMensual: 39,
      precioAnual: 351,
      moneda: 'USD',
      badge: null,
      destacado: false,
      cta: 'Empezar con Starter',
      ctaLink: '/register?plan=starter',
      color: '#00D4FF',
      features: [
        { texto: '15 publicaciones / mes', incluido: true },
        { texto: '1 nicho', incluido: true },
        { texto: 'PDF profesional', incluido: true },
        { texto: 'Post + Story', incluido: true },
        { texto: 'Imágenes en alta calidad', incluido: true },
        { texto: 'Copy optimizado para redes', incluido: true },
        { texto: 'Descarga completa', incluido: true },
        { texto: 'Sin carrusel', incluido: false },
        { texto: 'Sin video con IA', incluido: false },
        { texto: 'Sin multi-nicho', incluido: false },
        { texto: 'Sin publicación automática', incluido: false },
      ]
    },
    {
      id: 'pro',
      nombre: 'Pro ⭐',
      descripcion: 'Para agentes o negocios activos',
      precioMensual: 89,
      precioAnual: 801,
      moneda: 'USD',
      badge: 'MÁS POPULAR',
      destacado: true,
      cta: 'Empezar con Pro',
      ctaLink: '/register?plan=pro',
      color: 'var(--accent)',
      features: [
        { texto: '60 publicaciones / mes', incluido: true },
        { texto: 'Multi-nicho', incluido: true },
        { texto: 'Todos los formatos (Post, Story, Carrusel)', incluido: true },
        { texto: 'Video con IA (reels automáticos)', incluido: true },
        { texto: 'PDF profesional completo', incluido: true },
        { texto: 'Copy + captions + hashtags', incluido: true },
        { texto: 'Descargas ilimitadas', incluido: true },
        { texto: 'Publicación automática (Instagram)', incluido: true },
        { texto: 'Edición básica de contenido', incluido: true },
        { texto: 'Branding personalizable', incluido: true },
      ]
    },
    {
      id: 'scale',
      nombre: 'Scale 🔥',
      descripcion: 'Para equipos y agencias',
      precioMensual: 149,
      precioAnual: 1341,
      moneda: 'USD',
      badge: null,
      destacado: false,
      cta: 'Contactar ventas',
      btnStyle: 'outline-violet',
      ctaLink: 'mailto:hola@leadbook.app',
      color: '#b47eff',
      features: [
        { texto: 'Publicaciones ilimitadas', incluido: true },
        { texto: 'Multi-nicho', incluido: true },
        { texto: 'Todos los formatos + prioridad de render', incluido: true },
        { texto: 'Video con IA (render rápido)', incluido: true },
        { texto: 'Multi-usuario (hasta 10)', incluido: true },
        { texto: 'Panel de equipo', incluido: true },
        { texto: 'API access', incluido: true },
        { texto: 'White label (marca propia)', incluido: true },
        { texto: 'Publicación automática avanzada', incluido: true },
        { texto: 'Branding completo personalizable', incluido: true },
        { texto: 'Soporte prioritario', incluido: true },
        { texto: 'Onboarding asistido', incluido: true },
      ]
    }
  ];

  const testimonios = [
    { nombre: 'Martina G.', rol: 'Dueña de negocio · Buenos Aires', texto: 'Antes me llevaba 3 horas preparar el material de un producto. Ahora en 10 minutos tengo todo listo para publicar.', avatar: 'M' },
    { nombre: 'Carlos R.', rol: 'Director de marca', texto: 'El PDF que genera es más profesional que lo que hacíamos con diseñador. El equipo quedó impresionado.', avatar: 'C' },
    { nombre: 'Sofía L.', rol: 'Emprendedora', texto: 'Los posts de Instagram generados con IA tienen más engagement que los que hacía manualmente. Vale cada peso.', avatar: 'S' },
  ];

  const hashName = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash);
  };
  const COLORS = ['#00D4FF', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', paddingTop: 64 }}>
      <LandingNavbar />
      
      {checkoutStatus === 'success' && (
        <div style={{ background: 'var(--success)', color: '#fff', padding: '12px 24px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          <span style={{ fontWeight: 500 }}>¡Suscripción activada! Tu plan ya está al día.</span>
          <Link to="/dashboard" className="btn" style={{ background: '#fff', color: 'var(--success)', padding: '6px 16px', borderRadius: 24, fontSize: 13, border: 'none' }}>Ir al dashboard</Link>
        </div>
      )}
      {checkoutStatus === 'cancelled' && (
        <div style={{ background: 'var(--warning)', color: '#000', padding: '12px 24px', textAlign: 'center', fontWeight: 500 }}>
          Pago cancelado. Podés intentarlo cuando quieras.
        </div>
      )}

      {/* SECCIÓN 1 — Hero */}
      <section style={{ padding: '80px 24px 48px', textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-block', background: 'rgba(0,196,212,0.1)', border: '1px solid rgba(0,196,212,0.2)',
          color: 'var(--accent)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em',
          padding: '4px 12px', borderRadius: 'var(--radius-full)', marginBottom: 24
        }}>
          PLANES Y PRECIOS
        </div>
        
        <h1 style={{ 
          fontSize: 'calc(32px + 1vw)', fontWeight: 700, color: 'var(--text-primary)', 
          lineHeight: 1.15, margin: '0 auto 16px', maxWidth: 800, fontFamily: 'Syne' 
        }}>
          El marketing de tu negocio, <span style={{ color: 'var(--accent)' }}>automatizado</span>
        </h1>
        
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto', lineHeight: 1.6 }}>
          Generá PDF, posts, stories, carruseles y emails profesionales con IA. Sin diseñador, sin agencia.
        </p>

        <div style={{ marginTop: 32 }}>
          <ToggleBillingPeriod value={billingPeriod} onChange={setBillingPeriod} />
          {billingPeriod === 'anual' && (
            <div style={{ fontSize: 13, color: 'var(--success)', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <Tag size={12} /> Ahorrás 2 meses con el plan anual
            </div>
          )}
        </div>
      </section>

      {/* Wrapper rest of content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        
        {/* SECCIÓN 2 — Cards de planes */}
        <section style={{ padding: '0 0 80px' }}>
          <div className="pricing-grid" style={{ display: 'grid', gap: 24, alignItems: 'stretch', width: '100%', maxWidth: 1400, margin: '0 auto' }}>
            {planes.map(plan => (
              <PlanCard 
                key={plan.id}
                plan={plan}
                billingPeriod={billingPeriod}
                isCurrentPlan={currentPlan === plan.id}
              />
            ))}
          </div>
        </section>

        {/* SECCIÓN 3 — Tabla comparativa */}
        <section style={{ padding: '0 0 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 8px 0', fontFamily: 'Syne' }}>Comparativa completa</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>Todo lo que incluye cada plan, sin letra chica</p>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <ComparativaTable billingPeriod={billingPeriod} />
          </div>
        </section>

        {/* SECCIÓN 4 — Social proof */}
        <section style={{ padding: '0 0 80px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 8px 0', fontFamily: 'Syne' }}>Más de 500 negocios ya usan LeadBook</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>Ahorrá horas cada semana en la creación de marketing</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 40, textAlign: 'left' }}>
            {testimonios.map((t, idx) => {
              const bgColor = COLORS[hashName(t.nombre) % COLORS.length];
              return (
                <div key={idx} className="card" style={{ padding: 24, position: 'relative' }}>
                  <div style={{ fontSize: 60, position: 'absolute', top: 0, left: 16, color: 'var(--accent)', opacity: 0.2, fontFamily: 'serif', lineHeight: 1 }}>&ldquo;</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', position: 'relative', zIndex: 1, margin: '16px 0 24px' }}>
                    {t.texto}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 600 }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{t.nombre}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{t.rol}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECCIÓN 5 — FAQ */}
        <section style={{ padding: '0 0 80px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 40px 0', fontFamily: 'Syne', textAlign: 'center' }}>Preguntas frecuentes</h2>
          <FaqAccordion openIndex={faqOpenIndex} onToggle={setFaqOpenIndex} />
        </section>

        {/* SECCIÓN 6 — CTA final */}
        <section style={{ 
          padding: '80px 24px', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(0,196,212,0.06) 0%, transparent 60%)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: 80
        }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, margin: '0 0 12px 0', fontFamily: 'Syne' }}>
            Empezá hoy, sin tarjeta de crédito
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', margin: 0 }}>
            Probá el plan Free hasta que estés listo para escalar.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
            <Link to="/registro" className="btn btn-primary" style={{ padding: '14px 32px', borderRadius: 30, fontSize: 16 }}>
              Crear cuenta gratis &rarr;
            </Link>
            <Link to="/" className="btn btn-secondary" style={{ padding: '14px 32px', borderRadius: 30, fontSize: 16 }}>
              Ver demo &nearr;
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
