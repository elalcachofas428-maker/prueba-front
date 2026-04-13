import React from 'react';
import { Check, Minus } from 'lucide-react';

export default function ComparativaTable({ billingPeriod }) {
  const groups = [
    {
      label: 'GENERACIÓN DE CONTENIDO',
      rows: [
        { feature: 'Publicaciones / mes', free: '5 / mes', starter: '15 / mes', pro: '60 / mes', scale: 'Ilimitados' },
        { feature: 'PDF profesional', free: 'Básico', starter: 'Completo', pro: 'Completo', scale: 'Completo' },
        { feature: 'Post Instagram', free: true, starter: true, pro: true, scale: true },
        { feature: 'Story Instagram', free: false, starter: true, pro: true, scale: true },
        { feature: 'Carrusel Instagram', free: false, starter: false, pro: true, scale: true },
        { feature: 'Email marketing', free: false, starter: true, pro: true, scale: true },
        { feature: 'Video con IA', free: false, starter: false, pro: true, scale: true },
      ]
    },
    {
      label: 'AGENCIA Y EQUIPO',
      rows: [
        { feature: 'Logo en PDF', free: false, starter: true, pro: true, scale: true },
        { feature: 'Múltiples nichos', free: false, starter: false, pro: true, scale: true },
        { feature: 'Múltiples usuarios', free: false, starter: false, pro: false, scale: 'Hasta 10' },
        { feature: 'Panel de admin', free: false, starter: false, pro: false, scale: true },
        { feature: 'Branding personalizable', free: false, starter: false, pro: true, scale: true },
      ]
    },
    {
      label: 'SOPORTE',
      rows: [
        { feature: 'Soporte', free: 'Email', starter: 'Prioritario', pro: 'Prioritario', scale: 'Personalizado' },
        { feature: 'Onboarding', free: false, starter: false, pro: false, scale: 'Asistido' },
      ]
    }
  ];

  const renderCell = (val) => {
    if (typeof val === 'boolean') {
      return val ? <Check size={16} color="var(--accent)" /> : <Minus size={16} color="var(--text-tertiary)" style={{ opacity: 0.4 }} />;
    }
    return <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{val}</span>;
  };

  const getPrice = (id) => {
    if (id === 'free') return '0';
    if (id === 'starter') return billingPeriod === 'anual' ? '35' : '39';
    if (id === 'pro') return billingPeriod === 'anual' ? '80' : '89';
    if (id === 'scale') return billingPeriod === 'anual' ? '134' : '149';
  };

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr>
            <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', width: '28%' }}></th>
            <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', width: '18%', textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Free</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 400, marginTop: 4 }}>$0</div>
            </th>
            <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', width: '18%', textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Starter</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 400, marginTop: 4 }}>${getPrice('starter')}/mes</div>
            </th>
            <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', width: '18%', textAlign: 'center', background: 'rgba(0,196,212,0.04)', borderLeft: '1px solid rgba(0,196,212,0.15)', borderRight: '1px solid rgba(0,196,212,0.15)' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Pro</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 400, marginTop: 4 }}>${getPrice('pro')}/mes</div>
            </th>
            <th style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', width: '18%', textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Scale</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 400, marginTop: 4 }}>${getPrice('scale')}/mes</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, gidx) => (
            <React.Fragment key={gidx}>
              <tr>
                <td colSpan={5} style={{ background: 'var(--bg-surface)', padding: '8px 16px', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border-subtle)' }}>
                  {group.label}
                </td>
              </tr>
              {group.rows.map((row, ridx) => (
                <tr key={`${gidx}-${ridx}`} style={{ borderBottom: '1px solid var(--border-subtle)', '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                    {row.feature}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>{renderCell(row.free)}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>{renderCell(row.starter)}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', background: 'rgba(0,196,212,0.04)', borderLeft: '1px solid rgba(0,196,212,0.15)', borderRight: '1px solid rgba(0,196,212,0.15)' }}>{renderCell(row.pro)}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>{renderCell(row.scale)}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
