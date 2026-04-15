import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Zap, Settings, Layers, CreditCard, Menu, X } from 'lucide-react'
import Logo from '../Logo'
import GlassSurface from '../ui/GlassSurface'


const NAV_LINKS = [
  { id: 'inicio',        label: 'Inicio',        icon: Home,       gradientFrom: '#a955ff', gradientTo: '#ea51ff' },
  { id: 'funciones',     label: 'Funciones',     icon: Zap,        gradientFrom: '#00D4FF', gradientTo: '#7C3AED' },
  { id: 'como-funciona', label: 'Cómo funciona', icon: Settings,   gradientFrom: '#56CCF2', gradientTo: '#2F80ED' },
  { id: 'formatos',      label: 'Formatos',      icon: Layers,     gradientFrom: '#80FF72', gradientTo: '#7EE8FA' },
  { id: 'precios',       label: 'Precios',       icon: CreditCard, gradientFrom: '#ffa9c6', gradientTo: '#f434e2' },
]

export default function NavBar({ user, onLogout, activeSection, onNavigate }) {
  const [menuOpen, setMenuOpen] = React.useState(false)

  const handleNav = (id) => {
    onNavigate(id)
    setMenuOpen(false)
  }

  return (
    <header style={{ position: 'absolute', top: '20px', left: 0, right: 0, zIndex: 50, padding: '0 20px' }}>
      {/* CSS — ultra-smooth GPU-composited hover animations */}
      <style>{`
        .gradient-pill {
          position: relative;
          width: 50px;
          height: 50px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
          /* Force GPU compositing layer */
          transform: translate3d(0,0,0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          contain: layout style;
          /* LEAVE — close smoothly */
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.4s ease;
        }
        .gradient-pill:hover {
          width: 160px;
          box-shadow: none;
          /* ENTER — slow unfold with delay */
          transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.12s,
                      box-shadow 0.5s ease 0.12s;
        }

        .gradient-pill .gp-gradient {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: linear-gradient(45deg, var(--gf), var(--gt));
          opacity: 0;
          transform: translate3d(0,0,0);
          transition: opacity 0.3s ease;
        }
        .gradient-pill:hover .gp-gradient {
          opacity: 1;
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
        }

        .gradient-pill .gp-glow {
          position: absolute;
          top: 10px;
          left: 0;
          right: 0;
          height: 100%;
          border-radius: 9999px;
          background: linear-gradient(45deg, var(--gf), var(--gt));
          filter: blur(15px);
          opacity: 0;
          z-index: -1;
          transform: translate3d(0,0,0);
          transition: opacity 0.3s ease;
        }
        .gradient-pill:hover .gp-glow {
          opacity: 0.5;
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.25s;
        }

        .gradient-pill .gp-circle {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          opacity: 1;
          transform: translate3d(0,0,0);
          transition: opacity 0.25s ease;
        }
        .gradient-pill:hover .gp-circle {
          opacity: 0;
          transition: opacity 0.6s ease 0.12s;
        }

        .gradient-pill .gp-icon {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: scale(1) translate3d(0,0,0);
          backface-visibility: hidden;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .gradient-pill:hover .gp-icon {
          transform: scale(0) translate3d(0,0,0);
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.18s;
        }

        .gradient-pill .gp-label {
          position: absolute;
          z-index: 10;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          white-space: nowrap;
          pointer-events: none;
          transform: scale(0) translate3d(0,0,0);
          backface-visibility: hidden;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .gradient-pill:hover .gp-label {
          transform: scale(1) translate3d(0,0,0);
          transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.45s;
        }
      `}</style>

      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: '1rem',
      }}>

        {/* --- 1. Logo --- */}
        <button
          onClick={() => handleNav('inicio')}
          style={{
            display: 'flex', alignItems: 'center',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            marginLeft: '60px',
          }}
        >
          <Logo size="huge" />
        </button>

        {/* --- Hamburger (mobile) --- */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="nav-hamburger"
          style={{
            display: 'none',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'white', padding: '8px',
          }}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* --- 2. Gradient Menu (Desktop) --- */}
        <nav className="nav-desktop-links" style={{ display: 'flex' }}>
          <ul style={{
            display: 'flex',
            gap: '8px',
            listStyle: 'none',
            margin: 0,
            padding: '8px',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {NAV_LINKS.map(({ id, label, icon: Icon, gradientFrom, gradientTo }) => (
              <li
                key={id}
                className="gradient-pill"
                onClick={() => handleNav(id)}
                style={{ '--gf': gradientFrom, '--gt': gradientTo }}
              >
                <span className="gp-gradient" />
                <span className="gp-glow" />
                <span className="gp-circle" />
                <span className="gp-icon">
                  <Icon size={20} color="rgba(255,255,255,0.6)" />
                </span>
                <span className="gp-label">{label}</span>
              </li>
            ))}
          </ul>
        </nav>

        {/* --- 3. Auth Buttons --- */}
        <div className="nav-desktop-auth" style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '6px 8px',
          borderRadius: '9999px',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {user ? (
            <>
              {user.agencyLogo ? (
                <img src={user.agencyLogo} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} alt="" />
              ) : (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: '#00D4FF', color: '#000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700,
                }}>
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <Link to="/dashboard" style={{
                background: '#00D4FF', color: '#000',
                padding: '8px 20px', borderRadius: '9999px',
                fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}>Dashboard</Link>
              <button onClick={onLogout} style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600,
                padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}>Salir</button>
            </>
          ) : (
            <>
              {/* Iniciar sesión — glass pill oscuro */}
              <GlassSurface
                width="auto"
                height="auto"
                borderRadius={9999}
                brightness={30}
                opacity={0.7}
                blur={14}
                distortionScale={-160}
                displace={0.4}
              >
                <Link to="/login" style={{
                  color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem',
                  padding: '8px 16px', textDecoration: 'none',
                  fontWeight: 600, whiteSpace: 'nowrap',
                  fontFamily: 'DM Sans, sans-serif',
                }}>Iniciar sesión</Link>
              </GlassSurface>

              {/* Empezar gratis → — glass pill con gradiente cyan */}
              <GlassSurface
                width="auto"
                height="auto"
                borderRadius={9999}
                brightness={55}
                opacity={0.93}
                blur={12}
                distortionScale={-180}
                redOffset={0}
                greenOffset={10}
                blueOffset={20}
                displace={0.5}
                mixBlendMode="screen"
              >
                <Link to="/register" style={{
                  background: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '0.85rem', fontWeight: 700,
                  padding: '8px 18px', textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  fontFamily: 'DM Sans, sans-serif',
                }}>Empezar gratis →</Link>
              </GlassSurface>
            </>
          )}
        </div>

      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '64px', left: 0, right: 0,
          background: 'rgba(0, 0, 0, 0.97)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '1.5rem 2rem',
          zIndex: 49,
        }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {NAV_LINKS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => handleNav(id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '0.95rem', fontFamily: 'DM Sans, sans-serif',
                    color: activeSection === id ? '#00D4FF' : 'rgba(255,255,255,0.6)',
                    fontWeight: activeSection === id ? 600 : 400,
                    display: 'flex', alignItems: 'center', gap: '10px',
                  }}
                >
                  <Icon size={18} />
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            {user ? (
              <>
                <Link to="/dashboard" style={{
                  background: '#00D4FF', color: '#000',
                  padding: '10px 24px', borderRadius: '9999px',
                  fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
                }}>Dashboard →</Link>
                <button onClick={onLogout} style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem',
                  padding: '10px 20px', borderRadius: '9999px', cursor: 'pointer',
                }}>Cerrar sesión</button>
              </>
            ) : (
              <>
                <GlassSurface
                  width="auto"
                  height="auto"
                  borderRadius={9999}
                  brightness={30}
                  opacity={0.7}
                  blur={14}
                  distortionScale={-160}
                  displace={0.4}
                >
                  <Link to="/login" style={{
                    color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem',
                    padding: '10px 20px', textDecoration: 'none',
                    fontWeight: 600, whiteSpace: 'nowrap',
                    fontFamily: 'DM Sans, sans-serif',
                  }}>Iniciar sesión</Link>
                </GlassSurface>

                <GlassSurface
                  width="auto"
                  height="auto"
                  borderRadius={9999}
                  brightness={55}
                  opacity={0.93}
                  blur={12}
                  distortionScale={-180}
                  redOffset={0}
                  greenOffset={10}
                  blueOffset={20}
                  displace={0.5}
                  mixBlendMode="screen"
                >
                  <Link to="/register" style={{
                    background: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontSize: '0.85rem', fontWeight: 700,
                    padding: '10px 24px', textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    fontFamily: 'DM Sans, sans-serif',
                  }}>Empezar gratis →</Link>
                </GlassSurface>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
