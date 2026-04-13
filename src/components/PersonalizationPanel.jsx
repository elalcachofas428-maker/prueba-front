import React, { useState, useEffect } from 'react';
import { Settings, X, Palette, Type } from 'lucide-react';
import { usePersonalization } from '../hooks/usePersonalization';
import DynamicComboBox from './ui/DynamicComboBox';

const PersonalizationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, updateTheme, resetTheme } = usePersonalization();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-personalization', handleOpen);
    return () => window.removeEventListener('open-personalization', handleOpen);
  }, []);

  if (!isOpen) return null; // Eliminado el boton flotante por requerimiento

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: '350px',
      backgroundColor: 'var(--bg-main)', borderLeft: '1px solid var(--border)',
      zIndex: 200, padding: '2rem', boxShadow: '-10px 0 30px rgba(0,0,0,0.8)',
      overflowY: 'auto'
    }} className="animate-fade-in">
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Palette size={20} /> Personalización</h3>
        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
          <X size={24} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* COLORES */}
        <div>
          <label className="field-label" style={{ marginBottom: '1rem' }}><Palette size={14} style={{ display: 'inline', marginRight: '4px' }}/> Colores de Fondo</label>
          <div style={{ display: 'grid', gap: '1rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem' }}>Fondo Principal</span>
              <input 
                type="color" 
                value={theme.bgMain}
                onChange={(e) => updateTheme({ bgMain: e.target.value })}
                style={{ cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)', padding: '2px', borderRadius: '4px' }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem' }}>Fondo de Paneles/Inputs</span>
              <input 
                type="color" 
                value={theme.bgPanel}
                onChange={(e) => updateTheme({ bgPanel: e.target.value })}
                style={{ cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)', padding: '2px', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem' }}>Color de Acento</span>
              <input 
                type="color" 
                value={theme.accent}
                onChange={(e) => updateTheme({ accent: e.target.value })}
                style={{ cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)', padding: '2px', borderRadius: '4px' }}
              />
            </div>

          </div>
        </div>

        <hr style={{ borderColor: 'var(--border)' }} />

        {/* TIPOGRAFÍA */}
        <div>
          <label className="field-label" style={{ marginBottom: '1rem' }}><Type size={14} style={{ display: 'inline', marginRight: '4px' }}/> Tipografías</label>
          
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.5rem' }}>Cuerpo y Labels (Sans-Serif)</span>
            <DynamicComboBox 
               storageKey="fontSans"
               value={theme.fontSans}
               onChange={(val) => updateTheme({ fontSans: val })}
               defaultOptions={["'Outfit', sans-serif", "'Inter', sans-serif", "'Roboto', sans-serif", "'Montserrat', sans-serif", "'Lato', sans-serif", "'Poppins', sans-serif", "'Open Sans', sans-serif"]}
               placeholder="Ej: 'Inter', sans-serif"
            />
          </div>

          <div>
             <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.5rem' }}>Títulos y Destacados (Serif/Display)</span>
             <DynamicComboBox 
               storageKey="fontSerif"
               value={theme.fontSerif}
               onChange={(val) => updateTheme({ fontSerif: val })}
               defaultOptions={["'Playfair Display', serif", "'Cinzel', serif", "'Georgia', serif", "'Merriweather', serif", "'Lora', serif", "'Oswald', sans-serif", "'Bebas Neue', sans-serif"]}
               placeholder="Ej: 'Playfair Display', serif"
            />
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <button className="btn btn-secondary" style={{ width: '100%' }} onClick={resetTheme}>
            Revertir por Defecto
          </button>
        </div>

      </div>
    </div>
  );
};

export default PersonalizationPanel;
