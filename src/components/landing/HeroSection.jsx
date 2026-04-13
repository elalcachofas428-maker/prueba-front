import { useEffect, useState } from 'react';
import Logo from '../Logo';

const HeroSection = () => {
  return (
    <section 
      id="inicio"
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#070B14',
        padding: '0 24px',
        textAlign: 'center'
      }}
    >
      {/* Logo LB */}
      <div style={{ marginBottom: '40px' }}>
        <Logo size="xlarge" />
      </div>

      {/* Badge */}
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
        ✦ GENERACIÓN AUTOMÁTICA DE LEADS CON IA
      </div>

      {/* Headline */}
      <h1 style={{
        fontSize: 'clamp(32px, 8vw, 56px)',
        fontWeight: 700,
        color: '#ffffff',
        marginBottom: '16px',
        lineHeight: 1.2,
        maxWidth: '900px'
      }}>
        Convertí cualquier producto o servicio en{' '}
        <span style={{ color: '#00c4d4' }}>contenido que atrae clientes</span>
      </h1>

      {/* Subheadline */}
      <p style={{
        fontSize: '16px',
        color: 'rgba(255,255,255,0.6)',
        marginBottom: '32px',
        lineHeight: 1.6,
        maxWidth: '800px'
      }}>
        Automatizá la creación de posts, carruseles, PDFs, emails y videos en segundos. Todo listo para publicar y generar leads.
      </p>

      {/* CTA */}
      <p style={{
        fontSize: '16px',
        color: '#ffffff',
        fontWeight: 600,
        marginBottom: '32px'
      }}>
        Menos trabajo. Más clientes.
      </p>

      {/* Buttons */}
      <div style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '48px'
      }}>
        <button style={{
          padding: '12px 32px',
          background: '#00c4d4',
          color: '#070B14',
          border: 'none',
          borderRadius: '24px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '14px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 10px 30px rgba(0, 196, 212, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
        >
          Crear cuenta gratis →
        </button>
        <button style={{
          padding: '12px 32px',
          background: 'transparent',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '14px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = '#00c4d4';
          e.target.style.color = '#00c4d4';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'rgba(255,255,255,0.2)';
          e.target.style.color = '#ffffff';
        }}
        >
          Ver cómo funciona
        </button>
      </div>

      {/* Social Proof - AVATARS AQUÍ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Avatars */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0',
          marginBottom: '8px'
        }}>
          {['A', 'M', 'C', 'S'].map((letter, idx) => (
            <div
              key={idx}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: ['#00D4FF', '#7C3AED', '#06B6D4', '#14B8A6'][idx],
                color: '#070B14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px',
                marginLeft: idx > 0 ? '-12px' : 0,
                border: '2px solid #070B14',
                zIndex: 10 - idx,
                position: 'relative'
              }}
            >
              {letter}
            </div>
          ))}
        </div>

        {/* Texto */}
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.7)',
          margin: 0
        }}>
          Más de 500 negocios ya usan LeadBook
        </p>

        {/* Rating */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          color: '#00c4d4'
        }}>
          ⭐⭐⭐⭐⭐ 4.9/5
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
