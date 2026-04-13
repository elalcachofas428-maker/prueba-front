import React from 'react';
import { FileText, Image as ImageIcon, Smartphone, LayoutTemplate, Mail, Play } from 'lucide-react';

export default function FormatsSection() {
  const formatos = [
    { icon: FileText, nombre: 'PDF Profesional', desc: 'Ficha A4 con fotos, datos completos y logo de agencia', badge: 'Siempre incluido', color: 'var(--accent)' },
    { icon: ImageIcon, nombre: 'Post Instagram', desc: '1080×1080px con caption con hashtags generado por IA', badge: 'Siempre incluido', color: 'var(--accent)' },
    { icon: Smartphone, nombre: 'Story Instagram', desc: '1080×1920px formato vertical para Stories', badge: 'Plan Pro', color: '#b47eff' },
    { icon: LayoutTemplate, nombre: 'Carrusel', desc: '5 a 7 slides secuenciales para engagement', badge: 'Plan Pro', color: '#b47eff' },
    { icon: Mail, nombre: 'Email HTML', desc: 'Compatible con Mailchimp, Brevo y Gmail', badge: 'Plan Pro', color: '#b47eff' },
    { icon: Play, nombre: 'Video con IA', desc: 'Video narrado con voiceover y música de fondo', badge: 'Plan Pro', color: '#b47eff' },
  ];

  return (
    <section id="formatos" style={{ 
      padding: '100px 24px', 
      background: 'linear-gradient(180deg, transparent, rgba(0,196,212,0.03) 50%, transparent)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(0,196,212,0.08)',
          border: '1px solid rgba(0,196,212,0.2)',
          color: 'var(--accent)',
          fontSize: 11,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)'
        }}>
          FORMATOS GENERADOS
        </div>
        <h2 style={{
          fontSize: 40,
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginTop: 24,
          marginBottom: 16,
          fontFamily: 'Syne, sans-serif'
        }}>
          Un formulario. Seis formatos listos.
        </h2>
        <p style={{
          fontSize: 16,
          color: 'var(--text-secondary)',
          margin: 0
        }}>
          LeadBook genera simultáneamente todo lo que necesitás para publicar en todos los canales.
        </p>
      </div>

      {/* Grid de formatos */}
      <div className="format-grid" style={{
        marginTop: 64,
        maxWidth: 1100,
        margin: '64px auto 0',
        display: 'grid',
        gap: 20
      }}>
        {formatos.map((f, i) => {
          const isAccent = f.color === 'var(--accent)';
          return (
            <div key={i} className="format-card" style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 24,
              transition: 'all 0.2s ease',
              cursor: 'default',
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = f.color}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              {/* Ícono */}
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: isAccent ? 'rgba(0,196,212,0.1)' : 'rgba(180,126,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: f.color
              }}>
                <f.icon size={20} />
              </div>
              
              {/* Contenido */}
              <h3 style={{
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginTop: 14,
                marginBottom: 6
              }}>
                {f.nombre}
              </h3>
              <p style={{
                fontSize: 13,
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                margin: 0
              }}>
                {f.desc}
              </p>
              
              {/* Badge */}
              <div style={{ marginTop: 12 }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 10,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  background: isAccent ? 'rgba(0,196,212,0.1)' : 'rgba(180,126,255,0.1)',
                  color: f.color
                }}>
                  {f.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      </div>
      <style>{`
        .format-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 900px) {
          .format-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .format-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
