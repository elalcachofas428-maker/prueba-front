import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Clock, Link2, ChevronDown, User, CreditCard, LogOut, Menu, X, Bell } from 'lucide-react';
import Logo from './Logo';

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Inicio',      icon: <LayoutDashboard size={15} /> },
    { to: '/historial', label: 'Historial',   icon: <Clock size={15} /> },
    { to: '/cuenta/conexiones', label: 'Conexiones', icon: <Link2 size={15} /> },
    { to: '/precios', label: 'Precios', icon: <CreditCard size={15} /> },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  const initials = (user?.name || user?.email || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 60, zIndex: 1000,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center',
        padding: '0 40px',
        gap: 24,
      }}>
        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <Logo size="small" />
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: 'var(--accent)', letterSpacing: -0.5, marginLeft: 10 }}>
            Lead<span style={{ color: 'var(--text-primary)' }}>Book</span>
          </span>
        </div>

        {/* Nav links (desktop) */}
        <div style={{ display: 'flex', gap: 4, flex: 1 }} className="desktop-nav">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              fontFamily: 'DM Sans', fontSize: 14,
              color: isActive(link.to) ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive(link.to) ? 'rgba(255,255,255,0.06)' : 'transparent',
              transition: 'all 0.15s ease',
            }}>
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Derecha */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          {/* Bell */}
          <button className="btn-icon">
            <Bell size={18} />
          </button>

          {/* Dropdown cuenta */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '4px 8px', borderRadius: 'var(--radius-md)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Avatar */}
              {user?.agencyLogo ? (
                <img 
                  src={user.agencyLogo} 
                  alt="Avatar" 
                  style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} 
                />
              ) : (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), var(--violet))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Syne', fontWeight: 700, fontSize: 12, color: 'white',
                  flexShrink: 0,
                }}>{initials}</div>
              )}
              <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--text-secondary)' }}>
                {user?.name || user?.email?.split('@')[0]}
              </span>
              <ChevronDown size={14} color="var(--text-tertiary)" style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>

            {dropdownOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setDropdownOpen(false)} />
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: 'var(--bg-panel)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '8px',
                  minWidth: 200,
                  zIndex: 100,
                  boxShadow: 'var(--shadow-lg)',
                  animation: 'fadeIn 0.15s ease',
                }}>
                  {/* Header */}
                  <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 4 }}>
                    <div style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>
                      {user?.name || 'Usuario'}
                    </div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                      {user?.email}
                    </div>
                  </div>

                  {user?.is_staff && (
                    <Link to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 12px', borderRadius: 'var(--radius-sm)',
                        textDecoration: 'none', fontSize: 13,
                        fontFamily: 'DM Sans',
                        color: 'var(--text-secondary)',
                        transition: 'all 0.15s',
                        marginBottom: 4,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      <LayoutDashboard size={15} /> Admin
                    </Link>
                  )}

                  {[
                    { icon: <User size={15} />, label: 'Mi perfil',    to: '/cuenta' },
                    { icon: <CreditCard size={15} />, label: 'Mi plan', to: '/cuenta' },
                    { icon: <Link2 size={15} />, label: 'Conexiones',  to: '/cuenta/conexiones' },
                  ].map(item => (
                    <Link key={item.to + item.label} to={item.to}
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 12px', borderRadius: 'var(--radius-sm)',
                        textDecoration: 'none', fontSize: 13,
                        fontFamily: 'DM Sans',
                        color: 'var(--text-secondary)',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      {item.icon}{item.label}
                    </Link>
                  ))}

                  <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 4, paddingTop: 4 }}>
                    <button onClick={handleLogout} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '9px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'transparent', border: 'none',
                      cursor: 'pointer', fontSize: 13,
                      fontFamily: 'DM Sans',
                      color: 'var(--error)',
                      transition: 'background 0.15s',
                      textAlign: 'left',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--error-dim)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={15} /> Cerrar sesión
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Hamburger mobile */}
          <button className="btn-icon mobile-only" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(7,11,20,0.85)', backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }} onClick={() => setMobileOpen(false)}>
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 280,
            background: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border-subtle)',
            padding: 24, display: 'flex', flexDirection: 'column', gap: 8,
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, color: 'var(--accent)' }}>LeadBook</span>
              <button className="btn-icon" onClick={() => setMobileOpen(false)}><X size={18} /></button>
            </div>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 16px', borderRadius: 'var(--radius-md)',
                  textDecoration: 'none', fontFamily: 'DM Sans', fontSize: 15,
                  color: isActive(link.to) ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive(link.to) ? 'var(--accent-dim)' : 'transparent',
                }}
              >
                {link.icon}{link.label}
              </Link>
            ))}
            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
              <button onClick={handleLogout} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '12px 16px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans', fontSize: 15, color: 'var(--error)',
              }}>
                <LogOut size={16} /> Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } .mobile-only { display: flex !important; } }
        @media (min-width: 769px) { .mobile-only { display: none !important; } }
      `}</style>
    </>
  );
}
