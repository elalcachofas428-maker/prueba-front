import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqAccordion({ openIndex, onToggle }) {
  const faqs = [
    { q: '¿Puedo cancelar en cualquier momento?', r: 'Sí, podés cancelar tu suscripción cuando quieras. No hay contratos ni penalizaciones. Al cancelar, tu plan sigue activo hasta el final del período pagado.' },
    { q: '¿Qué pasa cuando llego al límite del plan Free?', r: 'Cuando alcanzás los 10 listados del mes, podés seguir usando la app pero no podés generar nuevos listados hasta que empiece el siguiente mes o que actualices al plan Pro.' },
    { q: '¿Los listados generados son míos?', r: 'Sí, todo el contenido generado por LeadBook es tuyo. Podés descargarlo, modificarlo y usarlo como quieras sin restricciones.' },
    { q: '¿Necesito saber de diseño o IA para usar LeadBook?', r: 'No. LeadBook está diseñado para que cualquier agente lo use sin conocimientos técnicos. Solo completás el formulario y la IA hace el resto.' },
    { q: '¿Cómo funciona el plan Agencia?', r: 'El plan Agencia permite agregar hasta 10 usuarios bajo una misma cuenta. Cada usuario puede generar sus propios listados y el administrador tiene acceso a un panel con métricas de todo el equipo.' },
    { q: '¿Puedo cambiar de plan en cualquier momento?', r: 'Sí. Podés subir o bajar de plan cuando quieras. El cambio se aplica de forma inmediata y el precio se prorratea automáticamente.' },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} style={{ borderBottom: '1px solid var(--border-subtle)', padding: '20px 0' }}>
            <div 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', group: 'faq' }}
              onClick={() => onToggle(isOpen ? null : idx)}
              className="faq-header"
            >
              <h3 style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', margin: 0, transition: 'color 0.15s' }}>
                {faq.q}
              </h3>
              <ChevronDown 
                size={18} 
                color="var(--text-tertiary)" 
                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }} 
              />
            </div>
            <div style={{ 
              maxHeight: isOpen ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease',
              paddingBottom: isOpen ? 16 : 0, marginTop: isOpen ? 12 : 0
            }}>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {faq.r}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
