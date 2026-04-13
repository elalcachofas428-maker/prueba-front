import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Home, Utensils, ShoppingBag, Dumbbell, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL, actualizarPerfil } from '../services/api';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  
  const [step, setStep] = useState(() => {
    const saved = sessionStorage.getItem('onboarding_step');
    return saved ? parseInt(saved) : 1;
  });

  useEffect(() => {
    sessionStorage.setItem('onboarding_step', step);
  }, [step]);
  const [agencyName, setAgencyName] = useState('');
  const [pais, setPais] = useState('Argentina');
  const [nicho, setNicho] = useState('inmobiliaria');
  
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');

  const countries = ['Argentina', 'México', 'Colombia', 'Chile', 'Uruguay', 'España', 'Perú'];
  
  const niches = [
    { id: 'inmobiliaria', label: 'Inmobiliaria', icon: Home, active: true },
    { id: 'restaurante', label: 'Restaurante', icon: Utensils, active: false, info: 'próximamente' },
    { id: 'retail', label: 'Retail', icon: ShoppingBag, active: false, info: 'próximamente' },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell, active: false, info: 'próximamente' }
  ];

  const handleNextStep = () => {
    if (!agencyName.trim()) return;
    setStep(2);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setLogoFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const planesData = [
    {
      id: 'free',
      nombre: 'Free',
      precioMensual: 0,
      precioAnual: 0,
      descripcion: 'Para probar la plataforma',
      popular: false,
      features: [
        '10 publicaciones / mes',
        '1 video con IA',
        '3 PDFs descargables',
        '1 red social conectada',
        '1 nicho',
        'Generación básica de contenido',
      ],
      noIncluye: [
        'Story ni carrusel',
        'Alta calidad',
        'Branding personalizable',
        'Multi-nicho',
        'Publicación automática',
      ],
      cta: 'Continuar gratis',
      variante: 'free'
    },
    {
      id: 'starter',
      nombre: 'Starter',
      precioMensual: 34000,
      precioAnual: 25500,
      descripcion: 'Para arrancar',
      popular: false,
      features: ['15 publicaciones / mes','1 nicho','PDF profesional','Post + Story','Imágenes en alta calidad','Copy optimizado para redes','Descarga completa'],
      noIncluye: ['Carrusel','Video con IA','Multi-nicho','Publicación automática'],
      cta: 'Empezar con Starter',
      variante: 'pago'
    },
    {
      id: 'pro',
      nombre: 'Pro ⭐',
      precioMensual: 70000,
      precioAnual: 52500,
      descripcion: 'Para agentes o negocios activos',
      popular: true,
      features: ['60 publicaciones / mes','Multi-nicho','Todos los formatos (Post, Story, Carrusel)','Video con IA (reels automáticos)','PDF profesional completo','Copy + captions + hashtags','Descargas ilimitadas','Publicación automática (Instagram)','Edición básica de contenido','Branding personalizable'],
      noIncluye: [],
      cta: 'Empezar con Pro',
      variante: 'pago'
    },
    {
      id: 'scale',
      nombre: 'Scale 🔥',
      precioMensual: 143000,
      precioAnual: 107000,
      descripcion: 'Para equipos y agencias',
      popular: false,
      features: ['Publicaciones ilimitadas','Multi-nicho','Todos los formatos + prioridad de render','Video con IA (render rápido)','Multi-usuario (hasta 10)','Panel de equipo','API access','White label (marca propia)','Publicación automática avanzada','Branding completo personalizable','Soporte prioritario','Onboarding asistido'],
      noIncluye: [],
      cta: 'Empezar con Scale',
      variante: 'pago'
    }
  ];

  const getPrecio = (plan) => {
    return billingCycle === 'annual' ? plan.precioAnual : plan.precioMensual;
  };

  const handleElegirPlan = async (plan) => {
    if (plan.variante === 'free') {
      localStorage.removeItem('leadbook_needs_onboarding');
      navigate('/dashboard');
      return;
    }
    
    try {
      setLoadingPlan(plan.id);
      const token = localStorage.getItem('subzero_access');
      const response = await fetch(`${API_BASE_URL}/mp/checkout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: plan.id, ciclo: billingCycle })
      });
      
      const data = await response.json();
      
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Error al procesar el pago. Intentá de nuevo.');
      }
    } catch (error) {
      console.error('Error MP:', error);
      alert('Error de conexión. Intentá de nuevo.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const irAlDashboard = () => {
    localStorage.removeItem('leadbook_needs_onboarding');
    navigate('/dashboard');
  };

  const finishOnboarding = async (skipLogo = false) => {
    setIsSubmitting(true);
    try {
      const finalLogo = skipLogo ? null : logoFile;
      
      const payload = {
        nombre_inmobiliaria: agencyName,
        pais: pais,
        nicho: nicho,
        logo_url: finalLogo
      };

      const token = localStorage.getItem('subzero_access');
      await fetch(`${API_BASE_URL}/auth/onboarding/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const dataToSend = {
          nombre_inmobiliaria: agencyName,
          nicho: nicho,
          pais: pais,
          logo_url: finalLogo
      }
      await actualizarPerfil(dataToSend)

      await updateProfile({ agencyName, agencyLogo: finalLogo });
      
      // En lugar de ir al dashboard, vamos al paso de precios
      setStep(3);

    } catch (e) {
      console.error("Error completando onboarding", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: '"DM Sans", sans-serif'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 24,
        padding: '40px 32px',
        maxWidth: step === 3 ? 1200 : 500,
        width: '100%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        border: '1px solid var(--border-subtle)',
        transition: 'max-width 0.4s ease-in-out'
      }}>
        {step === 1 && (
          <div className="fade-in">
            <h1 style={{ fontFamily: '"Syne", sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#fff' }}>
              Contanos sobre tu negocio
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
              Personalizá tu experiencia en LeadBook.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: 'var(--text-primary)' }}>Nombre de la inmobiliaria / agencia *</label>
                <input 
                  type="text" 
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="Ej: Inmobiliaria López"
                  className="input"
                  style={{ width: '100%', padding: '12px 16px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: 'var(--text-primary)' }}>País</label>
                <select 
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  className="input"
                  style={{ width: '100%', padding: '12px 16px', appearance: 'none' }}
                >
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 12, fontWeight: 500, color: 'var(--text-primary)' }}>Nicho de negocio</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {niches.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => n.active && setNicho(n.id)}
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        background: n.id === nicho ? 'var(--bg-card-hover)' : 'var(--bg-surface)',
                        border: `2px solid ${n.id === nicho ? 'var(--accent)' : 'var(--border-default)'}`,
                        cursor: n.active ? 'pointer' : 'not-allowed',
                        opacity: n.active ? 1 : 0.5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'all 0.2s'
                      }}
                    >
                      <n.icon size={24} color={n.id === nicho ? 'var(--accent)' : 'var(--text-primary)'} />
                      <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{n.label}</span>
                      {!n.active && <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{n.info}</span>}
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleNextStep}
                disabled={!agencyName.trim()}
                className="btn btn-primary"
                style={{ width: '100%', padding: 14, fontSize: 16, marginTop: 8 }}
              >
                Siguiente <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <h1 style={{ fontFamily: '"Syne", sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#fff' }}>
              Subí el logo de tu agencia
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
              Aparece en el PDF, posts e Instagram.
            </p>

            <div style={{ marginBottom: 32 }}>
              {!logoPreview ? (
                <div style={{
                  border: '2px dashed var(--border-default)',
                  borderRadius: 16,
                  padding: 40,
                  textAlign: 'center',
                  background: 'var(--bg-surface)',
                  position: 'relative',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%'
                    }}
                  />
                  <Upload size={32} color="var(--accent)" style={{ margin: '0 auto 16px' }} />
                  <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Hacé clic o arrastrá un archivo</p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>PNG o JPG (Max 2MB)</p>
                </div>
              ) : (
                <div style={{ textAlign: 'center', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24, background: 'var(--bg-surface)' }}>
                  <div style={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 16 }}>
                    <img src={logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: 200 }} />
                  </div>
                  <button onClick={() => { setLogoPreview(null); setLogoFile(null); }} className="btn btn-secondary btn-sm">
                    Cambiar logo
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button 
                onClick={() => finishOnboarding(false)}
                disabled={isSubmitting || !logoFile}
                className="btn btn-primary"
                style={{ width: '100%', padding: 14, fontSize: 16 }}
              >
                {isSubmitting ? 'Guardando...' : 'Continuar'} <ArrowRight size={18} />
              </button>
              
              <button 
                onClick={() => finishOnboarding(true)}
                disabled={isSubmitting}
                className="btn btn-ghost"
                style={{ width: '100%' }}
              >
                Saltar por ahora
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in" style={{ width: '100%', margin: '0 auto', overflowX: 'auto', paddingBottom: 20 }}>
            <h2 style={{ fontFamily: 'Syne', color: 'var(--text-primary)', textAlign: 'center', fontSize: 28, marginBottom: 8 }}>
              Elegí tu plan
            </h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: 14, marginBottom: 24 }}>
              Empezá gratis o elegí el plan que mejor se adapta a tu negocio.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
              <span onClick={() => setBillingCycle('monthly')} style={{
                cursor: 'pointer', fontSize: 14, fontWeight: billingCycle === 'monthly' ? 700 : 400,
                color: billingCycle === 'monthly' ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}>Mensual</span>

              <div onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                style={{
                  width: 48, height: 26, background: billingCycle === 'annual' ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                  borderRadius: 13, cursor: 'pointer', position: 'relative', transition: 'background 0.2s'
                }}>
                <div style={{
                  position: 'absolute', top: 3, left: billingCycle === 'annual' ? 25 : 3,
                  width: 20, height: 20, background: '#fff', borderRadius: '50%', transition: 'left 0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
              </div>

              <span onClick={() => setBillingCycle('annual')} style={{
                cursor: 'pointer', fontSize: 14, fontWeight: billingCycle === 'annual' ? 700 : 400,
                color: billingCycle === 'annual' ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}>
                Anual
                <span style={{
                  marginLeft: 8, background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80',
                  padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                  border: '1px solid rgba(74, 222, 128, 0.2)'
                }}>
                  -25%
                </span>
              </span>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: 12, 
              maxWidth: 1100, 
              margin: '0 auto',
              minWidth: 800 // Asegura que no se colapsen demasiado en pantallas pequeñas antes del scroll
            }}>
              {planesData.map(plan => (
                <div key={plan.id} style={{
                  background: 'var(--bg-card)',
                  border: plan.popular ? '2px solid var(--accent)' : '1px solid var(--border-subtle)',
                  borderRadius: 20,
                  padding: 24,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 420,
                  boxShadow: plan.popular ? '0 0 30px rgba(0,212,255,0.1)' : 'none',
                  transition: 'transform 0.2s ease',
                }}>
                  {plan.popular && (
                    <div style={{
                      position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                      background: 'var(--accent)', color: '#000', padding: '4px 14px',
                      borderRadius: 20, fontSize: 10, fontWeight: 800, whiteSpace: 'nowrap',
                      letterSpacing: '0.05em', zIndex: 10
                    }}>
                      MÁS POPULAR
                    </div>
                  )}
                  
                  <h3 style={{ color: 'var(--text-primary)', fontFamily: 'Syne', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>{plan.nombre}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 12, margin: '0 0 20px', lineHeight: 1.5 }}>{plan.descripcion}</p>
                  
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent)' }}>
                        {getPrecio(plan) === 0 ? 'Gratis' : `$${getPrecio(plan).toLocaleString('es-AR')}`}
                      </span>
                      {getPrecio(plan) > 0 && <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>/mes</span>}
                    </div>
                    {billingCycle === 'annual' && plan.precioAnual > 0 && (
                      <div style={{ fontSize: 11, color: '#4ade80', marginTop: 4, fontWeight: 600 }}>
                        Facturado anualmente (ARS)
                      </div>
                    )}
                    {billingCycle === 'monthly' && plan.precioMensual > 0 && (
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
                        ARS / mes
                      </div>
                    )}
                  </div>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', fontSize: 12, flex: 1 }}>
                    {plan.features.map((f, i) => (
                      <li key={i} style={{ color: 'var(--text-secondary)', marginBottom: 10, display: 'flex', gap: 8, lineHeight: 1.4 }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span> {f}
                      </li>
                    ))}
                    {plan.noIncluye.map((f, i) => (
                      <li key={i} style={{ color: 'var(--text-tertiary)', marginBottom: 10, display: 'flex', gap: 8, textDecoration: 'line-through', opacity: 0.6 }}>
                        <span style={{ color: 'var(--text-tertiary)' }}>✗</span> {f}
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleElegirPlan(plan)}
                    disabled={loadingPlan === plan.id}
                    className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'}`}
                    style={{
                      width: '100%', padding: '12px',
                      fontSize: 14, fontWeight: 700
                    }}>
                    {loadingPlan === plan.id ? 'Procesando...' : plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
