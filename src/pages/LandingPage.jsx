import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tag } from 'lucide-react';

// Secciones
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import FormatsSection from '../components/landing/FormatsSection';
import PlanCard from '../components/precios/PlanCard';
import ToggleBillingPeriod from '../components/precios/ToggleBillingPeriod';

const SECCIONES = ['inicio', 'funciones', 'como-funciona', 'formatos', 'nosotros', 'precios'];

const PLANES = [
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
    cta: 'Empezar con Scale',
    ctaLink: '/register?plan=scale',
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
    ]
  },
  {
    id: 'business',
    nombre: 'Business 🏢',
    descripcion: 'Para grandes empresas',
    precioMensual: null,
    precioAnual: null,
    moneda: 'USD',
    badge: 'EMPRESAS',
    destacado: false,
    cta: 'Contactar ventas',
    ctaLink: 'mailto:hola@leadbook.app',
    color: '#e2e8f0',
    btnStyle: 'outline-white',
    features: [
      { texto: 'Todo de Scale incluido', incluido: true },
      { texto: 'Usuarios ilimitados', incluido: true },
      { texto: 'API dedicada', incluido: true },
      { texto: 'SLA garantizado', incluido: true },
      { texto: 'Onboarding personalizado', incluido: true },
      { texto: 'Soporte prioritario 24/7', incluido: true },
    ]
  },
];

const STATS = [
  { valor: '500+', label: 'negocios activos' },
  { valor: '10.000+', label: 'contenidos generados' },
  { valor: '4.9/5', label: 'calificación promedio' },
];

const VALORES = [
  { icono: '🎯', titulo: 'Misión', desc: 'Automatizar el marketing de cualquier negocio con IA accesible y profesional' },
  { icono: '👁️', titulo: 'Visión', desc: 'Ser la plataforma #1 de contenido con IA en Latinoamérica' },
  { icono: '💡', titulo: 'Valores', desc: 'Velocidad, simplicidad y resultados reales para nuestros usuarios' },
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState('inicio');
  const [billingPeriod, setBillingPeriod] = useState('mensual');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && SECCIONES.includes(hash)) setSeccionActiva(hash);
  }, []);

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg-base)' }}>
        <div style={{ width:32, height:32, border:'2px solid var(--border-default)', borderTop:'2px solid var(--accent)', borderRadius:'50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const pantallaStyle = (id) => ({
    display: seccionActiva === id ? 'flex' : 'none',
    width: '100vw',
    height: 'calc(100vh - 80px)',
    overflow: 'hidden',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '80px',
  });

  const scrollStyle = (id) => ({
    display: seccionActiva === id ? 'flex' : 'none',
    width: '100vw',
    height: 'calc(100vh - 80px)',
    marginTop: '80px',
    overflowY: 'auto',
    overflowX: 'hidden',
    flexDirection: 'column',
    alignItems: 'center',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  });

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'fixed', top: 0, left: 0, background: 'var(--bg-base)' }}>
      <LandingNavbar seccionActiva={seccionActiva} setSeccionActiva={setSeccionActiva} />

      <div style={pantallaStyle('inicio')}>
        <HeroSection />
      </div>

      <div style={pantallaStyle('funciones')}>
        <FeaturesSection />
      </div>

      <div style={pantallaStyle('como-funciona')}>
        <HowItWorks />
      </div>

      <div style={pantallaStyle('formatos')}>
        <FormatsSection />
      </div>

      {/* NOSOTROS */}
      <div style={pantallaStyle('nosotros')}>
        <div style={{ maxWidth: 900, width: '100%', padding: '0 32px', textAlign: 'center' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-block', background: 'rgba(0,196,212,0.1)',
            border: '1px solid rgba(0,196,212,0.2)', color: 'var(--accent)',
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.1em', padding: '4px 12px',
            borderRadius: 'var(--radius-full)', marginBottom: 20,
          }}>
            QUIÉNES SOMOS
          </div>

          <h2 style={{ fontFamily: 'Syne', fontSize: 'clamp(28px, 3.5vw, 52px)', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 16px', lineHeight: 1.1 }}>
            Quiénes somos
          </h2>
          <p style={{ fontSize: 'clamp(15px, 1.2vw, 18px)', color: 'var(--text-secondary)', maxWidth: 580, margin: '0 auto 48px', lineHeight: 1.7 }}>
            Construimos herramientas de IA para que los negocios crezcan sin depender de agencias
          </p>

          {/* Cards de valores */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 48, textAlign: 'left' }}>
            {VALORES.map(v => (
              <div key={v.titulo} style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '28px 24px',
                transition: 'border-color 0.2s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{v.icono}</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 }}>{v.titulo}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{v.desc}</div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{s.valor}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRECIOS — scrolleable internamente, sin scrollbar visible */}
      <div className="seccion-precios" style={scrollStyle('precios')}>
        {/* Header */}
        <div style={{ textAlign: 'center', padding: '48px 24px 32px' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(0,196,212,0.1)',
            border: '1px solid rgba(0,196,212,0.2)', color: 'var(--accent)',
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.1em', padding: '4px 12px',
            borderRadius: 'var(--radius-full)', marginBottom: 20,
          }}>
            PLANES Y PRECIOS
          </div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>
            El marketing de tu negocio, <span style={{ color: 'var(--accent)' }}>automatizado</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', margin: '0 auto', maxWidth: 480, lineHeight: 1.6 }}>
            Generá PDF, posts, stories y emails profesionales con IA. Sin diseñador, sin agencia.
          </p>
          <div style={{ marginTop: 24 }}>
            <ToggleBillingPeriod value={billingPeriod} onChange={setBillingPeriod} />
            {billingPeriod === 'anual' && (
              <div style={{ fontSize: 13, color: 'var(--success)', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Tag size={12} /> Ahorrás 2 meses con el plan anual
              </div>
            )}
          </div>
        </div>

        {/* Cards de planes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
          width: '100%',
          maxWidth: 1200,
          padding: '0 24px 48px',
          alignItems: 'stretch',
        }}>
          {PLANES.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingPeriod={billingPeriod}
              isCurrentPlan={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
