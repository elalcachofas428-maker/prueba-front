import React from 'react';
import Logo from '../Logo';

export default function LandingFooter() {
  return (
    <footer style={{
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '48px 24px 32px'
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        
        {/* Superior */}
        <div className="footer-top" style={{
          display: 'grid',
          gap: 40
        }}>
          {/* Col 1 - Marca */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Logo size="footer" />
              <span style={{
                marginLeft: 8,
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                LeadBook
              </span>
            </div>
            <p style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginTop: 12,
              marginBottom: 16,
              maxWidth: 220
            }}>
              Marketing con IA para tu negocio.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="#" style={{ fontSize: 12, color: 'var(--text-tertiary)', textDecoration: 'none' }} className="hover-primary">Instagram</a>
              <a href="#" style={{ fontSize: 12, color: 'var(--text-tertiary)', textDecoration: 'none' }} className="hover-primary">LinkedIn</a>
            </div>
          </div>

          {/* Col 2 - Producto */}
          <div>
            <h4 style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
              marginTop: 0
            }}>
              PRODUCTO
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="#" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }} className="hover-primary">Funciones</a>
              <a href="#" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }} className="hover-primary">Precios</a>
              <a href="#" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }} className="hover-primary">Cómo funciona</a>
              <a href="#" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }} className="hover-primary">Changelog</a>
            </div>
          </div>

          {/* Col 3 - Empresa */}
          <div>
            <h4 style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
              marginTop: 0
            }}>
              EMPRESA
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="#" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }} className="hover-primary">Acerca de</a>
              <a href="#" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }} className="hover-primary">Blog</a>
              <a href="#" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }} className="hover-primary">Contacto</a>
              <a href="#" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }} className="hover-primary">Trabaja con nosotros</a>
            </div>
          </div>

          {/* Col 4 - Legal */}
          <div>
            <h4 style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
              marginTop: 0
            }}>
              LEGAL
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="#" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }} className="hover-primary">Términos de uso</a>
              <a href="#" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }} className="hover-primary">Política de privacidad</a>
              <a href="#" style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }} className="hover-primary">Cookies</a>
            </div>
          </div>

        </div>

        {/* Separador */}
        <div style={{
          height: 1,
          background: 'var(--border-subtle)',
          margin: '40px 0 0'
        }} />

        {/* Inferior */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 24,
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            © 2025 LeadBook. Todos los derechos reservados.
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            Hecho con IA ✦
          </div>
        </div>

      </div>

      <style>{`
        .footer-top {
          grid-template-columns: 2fr 1fr 1fr 1fr;
        }
        .hover-primary:hover {
          color: var(--text-primary) !important;
        }
        @media (max-width: 900px) {
          .footer-top {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 600px) {
          .footer-top {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
