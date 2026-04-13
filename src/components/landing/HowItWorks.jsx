import React from 'react';

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#070B14',
      padding: '100px 24px',
      gap: '60px'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px' }}>
        <div style={{
          display: 'inline-block',
          padding: '8px 16px',
          border: '1px solid rgba(0, 196, 212, 0.3)',
          borderRadius: '24px',
          color: '#00c4d4',
          fontSize: '11px',
          marginBottom: '24px',
          letterSpacing: '0.05em',
          fontWeight: 500
        }}>
          ✦ CÓMO FUNCIONA
        </div>
        
        <h2 style={{
          fontSize: 'clamp(32px, 6vw, 48px)',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '16px',
          lineHeight: 1.2
        }}>
          Creá marketing que atrae clientes en 3 pasos
        </h2>
        
        <p style={{
          fontSize: '16px',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.6
        }}>
          Pasá de idea a contenido listo para vender sin equipo ni herramientas.
        </p>
      </div>

      {/* Steps Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        width: '100%',
        maxWidth: '1200px'
      }}>
        {[
          {
            number: '01',
            icon: '📋',
            title: 'Cargás la información',
            description: 'Tu producto, servicio o propiedad en un formulario simple.'
          },
          {
            number: '02',
            icon: '⚡',
            title: 'LeadBook genera todo',
            description: 'Contenido completo listo para publicar en segundos.'
          },
          {
            number: '03',
            icon: '🚀',
            title: 'Publicás y convertís',
            description: 'Salís al mercado con contenido profesional que genera resultados.'
          }
        ].map((step, idx) => (
          <div
            key={idx}
            style={{
              background: '#12121e',
              border: '1px solid rgba(0, 196, 212, 0.2)',
              borderRadius: '12px',
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#00c4d4';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 196, 212, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 196, 212, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '48px', fontWeight: 700, color: '#00c4d4' }}>
              {step.number}
            </div>
            <div style={{ fontSize: '28px' }}>{step.icon}</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', margin: 0 }}>
              {step.title}
            </h3>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.6)',
              margin: 0,
              lineHeight: 1.6
            }}>
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
