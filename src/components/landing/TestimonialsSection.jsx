import React from 'react';

export default function TestimonialsSection() {
  const testimonios = [
    { nombre: 'Martina G.', rol: 'Dueña de negocio · Buenos Aires', texto: 'Antes me llevaba 3 horas preparar el material de un producto. Ahora en 10 minutos tengo todo listo para publicar.', avatar: 'M' },
    { nombre: 'Carlos R.', rol: 'Director de marca', texto: 'El PDF que genera es más profesional que lo que hacíamos con diseñador. El equipo quedó impresionado.', avatar: 'C' },
    { nombre: 'Sofía L.', rol: 'Emprendedora', texto: 'Los posts de Instagram generados con IA tienen más engagement que los que hacía manualmente. Vale cada peso.', avatar: 'S' },
  ];

  const hashName = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash);
  };
  const COLORS = ['#00D4FF', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

  const plataformas = ['Instagram', 'Mailchimp', 'Brevo', 'Gmail', 'WhatsApp'];

  return (
    <section id="testimonios" style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
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
            TESTIMONIOS
          </div>
          <h2 style={{
            fontSize: 40,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginTop: 24,
            marginBottom: 64,
            fontFamily: 'Syne, sans-serif'
          }}>
            Lo que dicen nuestros clientes
          </h2>
        </div>

        {/* Testimonios Grid */}
        <div className="testim-grid" style={{ display: 'grid', gap: 20 }}>
          {testimonios.map((t, idx) => {
            const bgColor = COLORS[hashName(t.nombre) % COLORS.length];
            return (
              <div key={idx} className="card" style={{ padding: 24, position: 'relative', background: 'var(--bg-card)' }}>
                <div style={{ fontSize: 60, position: 'absolute', top: 0, left: 16, color: 'var(--accent)', opacity: 0.2, fontFamily: 'serif', lineHeight: 1 }}>&ldquo;</div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', position: 'relative', zIndex: 1, margin: '16px 0 24px' }}>
                  {t.texto}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 600 }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{t.nombre}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{t.rol}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Plataformas */}
        <div style={{
          marginTop: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>Compatible con</span>
          <div style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {plataformas.map((p, i) => (
              <span key={i} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: 12,
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)'
              }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .testim-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 900px) {
          .testim-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .testim-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
