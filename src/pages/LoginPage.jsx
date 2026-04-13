import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppStore } from '../store/useAppStore';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';

export default function LoginPage() {
  const { login } = useAuth();
  const { addToast } = useAppStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Bloquear scroll al montar
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const needsOnboarding = localStorage.getItem('leadbook_needs_onboarding');
      navigate(needsOnboarding ? '/onboarding' : '/dashboard');
      addToast({ type: 'success', title: '¡Bienvenido!', message: 'Inicio de sesión exitoso' });
    } catch (err) {
      console.error('Login error:', err);
      setError('Email o contraseña incorrectos');
      addToast({ type: 'error', title: 'Error al iniciar sesión', message: 'Verificá tus credenciales' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: '#070B14', display: 'flex', zIndex: 9999, overflow: 'hidden'
    }}>
      {/* Botón Volver */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute', top: 24, left: 24, background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '8px 12px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.6)',
          transition: 'all 0.2s ease', zIndex: 100
        }}
      >
        <ArrowLeft size={16} /> <span style={{ fontSize: 12 }}>Volver</span>
      </button>

      {/* Columna Izquierda — Visual */}
      <div style={{
        flex: 1, background: 'var(--bg-surface)', borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 60, position: 'relative', overflow: 'hidden',
      }} className="auth-left">
        <div style={{ position:'relative', zIndex:1, maxWidth:400, width:'100%' }}>
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
        </div>
      </div>

      {/* Columna Derecha — Formulario */}
      <div style={{
        flex: 1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'50px 40px',
      }}>
        <div style={{ width:'100%', maxWidth: 500 }}>
          <div style={{ marginBottom:32 }}>
            <h2 style={{ fontFamily:'Syne', fontSize:28, fontWeight:700, marginBottom:8 }}>Bienvenido de vuelta</h2>
            <p style={{ fontFamily:'DM Sans', fontSize:14, color:'var(--text-secondary)' }}>Ingresá a tu cuenta de LeadBook</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div className="input-wrapper">
              <label className="input-label">EMAIL</label>
              <div style={{ position:'relative' }}>
                <Mail size={16} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'var(--text-tertiary)' }} />
                <input
                  className={`input ${error ? 'error' : ''}`}
                  style={{ padding: '14px 16px', paddingLeft: 42 }}
                  type="email" placeholder="tu@email.com"
                  value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                  required
                />
              </div>
            </div>

            <div className="input-wrapper">
              <label className="input-label">CONTRASEÑA</label>
              <div style={{ position:'relative' }}>
                <Lock size={16} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'var(--text-tertiary)' }} />
                <input
                  className={`input ${error ? 'error' : ''}`}
                  style={{ padding: '14px 16px', paddingLeft: 42, paddingRight: 44 }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && <div className="input-error-msg">{error}</div>}
            </div>

            <button type="submit" className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
              style={{ width:'100%', marginTop:4, padding: '14px 16px' }} disabled={loading}>
              {loading ? <><div className="btn-spinner" /> Cargando...</> : 'Iniciar sesión'}
            </button>
          </form>

          <p style={{ fontFamily:'DM Sans', fontSize:13, color:'var(--text-secondary)', textAlign:'center', marginTop:24 }}>
            ¿No tenés cuenta?{' '}
            <Link to="/register" style={{ color:'var(--accent)', textDecoration:'none', fontWeight:500 }}>Registrate gratis</Link>
          </p>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { .auth-left { display: none !important; } }
      `}</style>
    </div>
  );
}
