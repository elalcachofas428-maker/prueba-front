import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

export default function CtaFinalSection() {
  return (
    <section id="precios" style={{
      padding: '100px 24px',
      width: '100%',
      background: 'linear-gradient(135deg, rgba(0,196,212,0.07) 0%, rgba(180,126,255,0.04) 100%)',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div style={{
        maxWidth: 640,
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {/* Isotipo grande */}
        <div style={{ margin: '0 auto', display: 'inline-block' }}>
          <Logo size="xlarge" />
        </div>

        {/* Textos */}
        <h2 style={{
          fontSize: 40,
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.2,
          marginTop: 24,
          marginBottom: 12,
          fontFamily: 'Syne, sans-serif'
        }}>
          Empezá hoy. Tu primer listado en 5 minutos.
        </h2>
        <p style={{
          fontSize: 16,
          color: 'var(--text-secondary)',
          margin: 0
        }}>
          Sin tarjeta de crédito. Sin instalación. Solo registrate y generá.
        </p>

        {/* Fila de CTAs */}
        <div style={{
          marginTop: 36,
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/registro" className="btn btn-primary" style={{
            borderRadius: 30,
            padding: '15px 36px',
            fontSize: 16
          }}>
            Crear cuenta gratis &rarr;
          </Link>
          <Link to="/precios" className="btn btn-secondary" style={{
            borderRadius: 30,
            padding: '15px 36px',
            fontSize: 16
          }}>
            Ver planes y precios
          </Link>
        </div>

        {/* Garantía */}
        <div style={{
          marginTop: 20,
          fontSize: 13,
          color: 'var(--text-tertiary)',
          fontWeight: 500
        }}>
          ✓ Plan Free para siempre <span style={{ margin: '0 8px' }}>·</span> ✓ Sin contrato <span style={{ margin: '0 8px' }}>·</span> ✓ Cancelá cuando quieras
        </div>
      </div>
    </section>
  );
}
