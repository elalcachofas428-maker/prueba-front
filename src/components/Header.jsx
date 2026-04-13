import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from '../context/FormContext';
import { useAuth } from '../context/AuthContext';
import { Database, LayoutTemplate, User, Settings, Link as LinkIcon, ChevronDown, UserSquare2, LogIn } from 'lucide-react';

const STEP_NAMES = [
  "Datos de la Propiedad",
  "Precio y Características",
  "Amenidades",
  "Video y Voiceover",
  "Revisar Guión",
  "Fotos y Formatos",
  "Contacto del Agente"
];

const Header = ({ isWizardActive, setIsWizardActive }) => {
  const { currentStep, goToStep, resetForm } = useFormContext();
  const { user } = useAuth();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // En base a 7 pasos
  const stepLabel = isWizardActive && currentStep >= 1 && currentStep <= 7 ? STEP_NAMES[currentStep - 1] : "";
  const progressPercent = isWizardActive && currentStep >= 1 && currentStep <= 7 ? ((currentStep) / 7) * 100 : 100;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openModal = (id) => {
    window.dispatchEvent(new CustomEvent('open-modal', { detail: id }));
    setDropdownOpen(false);
  };

  const handleGoHome = () => {
    setIsWizardActive(false);
    resetForm(); // Reset wizard state completely
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'var(--bg-navbar)', borderBottom: '1px solid var(--border-idle)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', height: '64px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleGoHome} title="Ir al Inicio">
           <div style={{ 
              width: '32px', height: '32px', background: 'rgba(0, 196, 212, 0.1)',
              border: '1px solid var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 600, color: 'var(--accent)'
            }}>SZ</div>
        </div>

        {/* MID/RIGHT NAV LINKS */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          
          {user && (
            <button 
              className="btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '13px', border: 'none', backgroundColor: !isWizardActive ? 'rgba(255,255,255,0.06)' : 'transparent', outline: !isWizardActive ? '1px solid var(--border-idle)' : 'none' }}
              onClick={handleGoHome}
            >
              Inicio
            </button>
          )}

          <button 
            className="btn-secondary" 
            style={{ padding: '8px 16px', fontSize: '13px', border: 'none' }}
            onClick={() => openModal('templates')}
          >
            Plantillas
          </button>
          
          <button 
            className="btn-secondary" 
            style={{ padding: '8px 16px', fontSize: '13px', border: 'none' }}
            onClick={() => openModal('history')}
          >
            Historial
          </button>

          {/* MENÚ DE USUARIO */}
          <div style={{ position: 'relative', marginLeft: '12px' }} ref={dropdownRef}>
            
            {!user ? (
               <button 
                className="btn-primary" 
                style={{ padding: '8px 20px', fontSize: '13px' }}
                onClick={() => openModal('account')}
              >
                Acceder
              </button>
            ) : (
                <button 
                  className="btn-secondary" 
                  style={{ 
                    padding: '8px 16px', fontSize: '13px', border: 'none',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    backgroundColor: dropdownOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
                    outline: dropdownOpen ? '1px solid var(--border-idle)' : 'none'
                  }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Cuenta
                  <ChevronDown size={14} style={{ transition: 'transform 0.2s ease', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
            )}

            {/* DROPDOWN MENU PARA USUARIOS LOGEADOS */}
            {dropdownOpen && user && (
              <div className="animate-fade-in" style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: '0',
                width: '260px', backgroundColor: 'var(--bg-panel)',
                border: '1px solid var(--border-idle)', borderRadius: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'hidden'
              }}>
                <div style={{ padding: '16px', borderBottom: '1px solid var(--border-idle)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => openModal('account')}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0, 196, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', overflow: 'hidden' }}>
                      {user.agencyLogo ? <img src={user.agencyLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover'}}/> : <UserSquare2 size={24} />}
                   </div>
                   <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                         {user.agents && user.agents.length > 0 ? user.agents[user.agents.length-1] : user.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.agencyName}</div>
                   </div>
                </div>

                <div style={{ padding: '8px' }}>
                  <button onClick={() => openModal('account')} style={{ width: '100%', textAlign: 'left', padding: '10px 14px', background: 'transparent', border: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <User size={16} color="var(--accent)"/> Mi Cuenta
                  </button>
                  <button onClick={() => { window.dispatchEvent(new Event('open-personalization')); setDropdownOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 14px', background: 'transparent', border: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <Settings size={16} color="var(--accent)"/> Configuración
                  </button>
                  <button onClick={() => openModal('connections')} style={{ width: '100%', textAlign: 'left', padding: '10px 14px', background: 'transparent', border: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <LinkIcon size={16} color="var(--accent)" /> Conexiones
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* BARRA DE PROGRESO */}
      {isWizardActive && (
        <div style={{ position: 'relative', width: '100%', borderTop: '1px solid var(--border-idle)'}}>
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0 8px 0'}}>
             <div style={{ fontSize: '11px', color: 'var(--text-hints)', fontWeight: 500 }}>
                 <span style={{ color: 'var(--text-primary)', marginRight: '6px' }}>{currentStep} / {7}</span> 
             </div>
             <div style={{ fontSize: '11px', color: 'var(--text-primary)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
                 {stepLabel}
             </div>
          </div>
          <div className="progress-container" style={{ position: 'absolute', bottom: -1, height: '2px', backgroundColor: 'var(--border-idle)', borderRadius: 0}}>
            <div className="progress-bar" style={{ width: `${progressPercent}%`, backgroundColor: 'var(--accent)' }}></div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
