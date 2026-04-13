import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppStore } from '../store/useAppStore';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';

export default function LoginScreen() {
  const { login } = useAuth();
  const { addToast } = useAppStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Al montar, deshabilitá scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.width = '100%';
    document.documentElement.style.width = '100%';
    
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const needsOnboarding = localStorage.getItem('leadbook_needs_onboarding');
      navigate(needsOnboarding ? '/onboarding' : '/dashboard');
    } catch (err) {
      setError('Email o contraseña incorrectos');
      addToast({ type: 'error', title: 'Error al iniciar sesión', message: 'Verificá tus credenciales' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const API = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${API}/auth/google/`, { method: 'POST' }).catch(() => null);
      if (!res || !res.ok) throw new Error('Google login no implementado');
    } catch {
      addToast({ type: 'info', title: 'Próximamente', message: 'Google login próximamente' });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#070B14',
      display: 'flex',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {/* Botón volver atrás */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          padding: '8px 12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'rgba(255,255,255,0.6)',
          transition: 'all 0.2s ease',
          zIndex: 100
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = '#00c4d4';
          e.target.style.color = '#00c4d4';
          e.target.style.transform = 'translateX(-4px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'rgba(255,255,255,0.2)';
          e.target.style.color = 'rgba(255,255,255,0.6)';
          e.target.style.transform = 'translateX(0)';
        }}
      >
        <ArrowLeft size={16} />
        <span style={{ fontSize: '12px' }}>Volver</span>
      </button>

      {/* Columna izquierda — visual */}
      <div style={{
        flex: 1, background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 60, position: 'relative', overflow: 'hidden',
      }} className="auth-left">
        {/* Orbes decorativos */}
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'rgba(0,212,255,0.05)', filter:'blur(100px)', top:-100, right:-100, pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:350, height:350, borderRadius:'50%', background:'rgba(124,58,237,0.07)', filter:'blur(80px)', bottom:0, left:-50, pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:1, maxWidth:400, width:'100%' }}>
          {/* Logo */}
          <div style={{ marginBottom: 48, display: 'flex', alignItems: 'center' }}>
            <Logo size="large" />
            <span style={{ fontFamily:'Syne', fontWeight:800, fontSize:28, color:'var(--accent)', marginLeft: 12 }}>
              Lead<span style={{ color:'var(--text-primary)' }}>Book</span>
            </span>
          </div>

          <h2 style={{ fontFamily:'Syne', fontSize:28, fontWeight:700, color:'var(--text-primary)', marginBottom:12 }}>
            Generá tu marketing en 2 minutos
          </h2>
          <p style={{ fontFamily:'DM Sans', fontSize:15, color:'var(--text-secondary)', lineHeight:1.6, marginBottom:40 }}>
            PDF, posts, stories, video y más — todo desde un solo formulario.
          </p>

          {/* Features */}
          {[
            '📄 Ficha PDF profesional lista para compartir',
            '📸 Post + Story para Instagram generados con IA',
            '🎬 Video con voiceover sincronizado',
            '📧 Email de marketing listo para enviar',
          ].map((f, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--accent)', flexShrink:0 }} />
              <span style={{ fontFamily:'DM Sans', fontSize:14, color:'var(--text-secondary)' }}>{f}</span>
            </div>
          ))}

          {/* Testimonio */}
          <div style={{
            marginTop:40, padding:'20px 24px',
            background:'var(--bg-card)', border:'1px solid var(--border-subtle)',
            borderRadius:'var(--radius-lg)',
          }}>
            <p style={{ fontFamily:'DM Sans', fontSize:13, color:'var(--text-secondary)', lineHeight:1.6, marginBottom:12 }}>
              "Antes tardaba 2 horas en preparar el material de un producto o servicio. Ahora lo tengo en 2 minutos."
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg, var(--accent), var(--violet))', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne', fontWeight:700, fontSize:12, color:'white' }}>MG</div>
              <div>
                <div style={{ fontFamily:'DM Sans', fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>María González</div>
                <div style={{ fontFamily:'DM Sans', fontSize:11, color:'var(--text-tertiary)' }}>Dueña de negocio · Buenos Aires</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Columna derecha — formulario */}
      <div style={{
        width: '100%', maxWidth: 'auto', flex: 1, // Let flex box determine width and set padding properly
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'50px 40px', // FIX: Card padding 50px 40px
      }}>
        <div style={{ width:'100%', maxWidth: 500 }}> {/* FIX: Card width 500px */}
          {/* Header */}
          <div style={{ marginBottom:32 }}>
            <h2 style={{ fontFamily:'Syne', fontSize:28, fontWeight:700, marginBottom:8 }}>Bienvenido de vuelta</h2>
            <p style={{ fontFamily:'DM Sans', fontSize:14, color:'var(--text-secondary)' }}>Ingresá a tu cuenta de LeadBook</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* Email */}
            <div className="input-wrapper">
              <label className="input-label">EMAIL <span className="required">*</span></label>
              <div style={{ position:'relative' }}>
                <Mail size={16} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'var(--text-tertiary)', pointerEvents:'none' }} />
                <input
                  className={`input ${error ? 'error' : ''}`}
                  style={{ padding: '14px 16px', paddingLeft: 42 }} /* FIX: Input padding 14px 16px */
                  type="email" placeholder="tu@email.com"
                  value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="input-wrapper">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <label className="input-label">CONTRASEÑA <span className="required">*</span></label>
                <Link to="/recuperar-password" style={{ fontFamily:'DM Sans', fontSize:12, color:'var(--accent)', textDecoration:'none' }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div style={{ position:'relative' }}>
                <Lock size={16} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'var(--text-tertiary)', pointerEvents:'none' }} />
                <input
                  className={`input ${error ? 'error' : ''}`}
                  style={{ padding: '14px 16px', paddingLeft: 42, paddingRight: 44 }} /* FIX: Input padding 14px 16px */
                  type={showPass ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-tertiary)', display:'flex' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && <div className="input-error-msg">{error}</div>}
            </div>

            {/* Submit */}
            <button type="submit" className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
              style={{ width:'100%', marginTop:4, padding: '14px 16px' }} disabled={loading}> {/* FIX: Button padding 14px 16px */}
              {loading ? <><div className="btn-spinner" />Iniciando sesión...</> : 'Iniciar sesión'}
            </button>

            {/* Separador */}
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ flex:1, height:1, background:'var(--border-subtle)' }} />
              <span style={{ fontFamily:'DM Sans', fontSize:12, color:'var(--text-tertiary)' }}>o</span>
              <div style={{ flex:1, height:1, background:'var(--border-subtle)' }} />
            </div>

            {/* Google */}
            <button type="button" onClick={handleGoogleLogin} className="btn btn-secondary" style={{ width:'100%', gap:10, padding: '14px 16px' }}> {/* FIX: Button padding 14px 16px */}
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continuar con Google
            </button>
          </form>

          <p style={{ fontFamily:'DM Sans', fontSize:13, color:'var(--text-secondary)', textAlign:'center', marginTop:24 }}>
            ¿No tenés cuenta?{' '}
            <Link to="/register" style={{ color:'var(--accent)', textDecoration:'none', fontWeight:500 }}>Registrate gratis</Link>
          </p>
        </div>
      </div>

      {/* Ocultar columna izquierda en mobile */}
      <style>{`
        @media (max-width: 768px) { .auth-left { display: none !important; } }
      `}</style>
    </div>
  );
}
