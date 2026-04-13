import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo';

const NAV_LINKS = [
  { label: 'Inicio',        id: 'inicio' },
  { label: 'Funciones',     id: 'funciones' },
  { label: 'Cómo funciona', id: 'como-funciona' },
  { label: 'Formatos',      id: 'formatos' },
  { label: 'Nosotros',      id: 'nosotros' },
  { label: 'Precios',       id: 'precios' },
];

const LandingNavbar = ({ seccionActiva, setSeccionActiva }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Sincronizar hash → sección al navegar hacia atrás/adelante
  useEffect(() => {
    const onPop = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && NAV_LINKS.find(l => l.id === hash)) setSeccionActiva(hash);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [setSeccionActiva]);

  const navegarA = (seccion) => {
    if (seccion === 'precios') {
      navigate('/precios');
      return;
    }
    if (location.pathname === '/') {
      setSeccionActiva(seccion);
      window.history.pushState({}, '', `#${seccion}`);
      document.getElementById(seccion)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(seccion)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '80px',
      background: 'rgba(7, 11, 20, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 196, 212, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      zIndex: 1000,
      transition: 'all 0.2s ease',
    }}>
      {/* Logo */}
      <button
        onClick={() => navegarA('inicio')}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
        }}
      >
        <Logo size="small" />
        <span style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff' }}>
          LeadBook
        </span>
      </button>

      {/* Links - Desktop */}
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
        {NAV_LINKS.map(({ label, id }) => {
          const isActive = seccionActiva === id;
          return (
            <button
              key={id}
              onClick={() => navegarA(id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isActive ? '#00c4d4' : 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                padding: 0,
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={(e) => { e.target.style.color = '#00c4d4'; }}
              onMouseLeave={(e) => { e.target.style.color = isActive ? '#00c4d4' : 'rgba(255,255,255,0.7)'; }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Auth Buttons */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user.agencyLogo ? (
                <img src={user.agencyLogo} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: 'var(--accent)', color: '#070B14',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, fontFamily: 'Syne'
                }}>
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: 500 }}>
                {user.name || user.email}
              </span>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'var(--accent)', color: '#070B14',
                border: 'none', padding: '8px 20px',
                borderRadius: '24px', fontSize: '14px',
                fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 4px 12px rgba(0,196,212,0.2)'; }}
              onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
            >
              Dashboard →
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)', fontSize: '13px',
                padding: '8px 16px', borderRadius: '20px',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = 'rgba(255,255,255,0.7)'; }}
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent', border: 'none',
                color: 'rgba(255,255,255,0.7)', fontSize: '14px',
                cursor: 'pointer', transition: 'color 0.2s ease', padding: 0, fontWeight: 400,
              }}
              onMouseEnter={(e) => { e.target.style.color = '#00c4d4'; }}
              onMouseLeave={(e) => { e.target.style.color = 'rgba(255,255,255,0.7)'; }}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                background: '#00c4d4', color: '#070B14', border: 'none',
                padding: '10px 24px', borderRadius: '24px',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 30px rgba(0,196,212,0.2)'; }}
              onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
            >
              Empezar gratis →
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default LandingNavbar;
