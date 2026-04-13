import React from 'react';
import { Zap, FileText, Image as ImageIcon, Mail, Play, Shield } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    { icon: Zap, titulo: 'Generación automática', desc: 'Completás el formulario y la IA genera todo el material en menos de 2 minutos. Sin esperas, sin iteraciones.' },
    { icon: ImageIcon, titulo: 'Contenido para redes', desc: 'Posts, stories y carruseles optimizados, listos para publicar y atraer clientes.' },
    { icon: Play, titulo: 'Videos sin editar', desc: 'Creá videos con voz en off y estructura profesional sin tocar un editor.' },
    { icon: FileText, titulo: 'Presentación que vende', desc: 'Generá fichas tipo PDF con diseño premium, listas para enviar y cerrar clientes.' },
    { icon: Mail, titulo: 'Emails que convierten', desc: 'Emails profesionales listos para enviar y generar consultas o ventas.' },
    { icon: Shield, titulo: 'Tu marca integrada', desc: 'Todos los contenidos incluyen tu logo, colores y datos para mantener consistencia.' },
  ];

  return (
    <section id="funciones" style={{ 
      padding: '100px 24px', 
      background: 'var(--bg-surface)', 
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
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
            POR QUÉ LEADBOOK
          </div>
          <h2 style={{
            fontSize: 40,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginTop: 24,
            marginBottom: 16,
            fontFamily: 'Syne, sans-serif'
          }}>
            Todo tu marketing listo para atraer clientes
          </h2>
          <p style={{
            fontSize: 16,
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            Creá contenido profesional, consistente y listo para publicar sin herramientas extra ni procesos manuales.
          </p>
        </div>

        {/* Grid */}
        <div className="features-grid" style={{
          marginTop: 64,
          display: 'grid',
          gap: 24
        }}>
          {features.map((f, i) => (
            <div key={i} className="feature-card" style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
              transition: 'all 0.2s ease',
              cursor: 'default'
            }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(0,196,212,0.1)',
                border: '1px solid rgba(0,196,212,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)'
              }}>
                <f.icon size={20} />
              </div>
              <h3 style={{
                fontSize: 17,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginTop: 16,
                marginBottom: 8
              }}>
                {f.titulo}
              </h3>
              <p style={{
                fontSize: 14,
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                margin: 0
              }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .features-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        .feature-card:hover {
          border-color: var(--accent) !important;
          transform: translateY(-2px);
        }
        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
          .features-header h2 {
            font-size: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}
