import React, { useState, useEffect } from 'react';
import { Check, Receipt, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPlanStatus } from '../../services/api';
import { Skeleton } from '../ui/Skeleton';

export default function TabPlan({ profileData }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState(null);

  useEffect(() => {
    getPlanStatus().then(data => {
      setPlanData(data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="card"><Skeleton height="200px" width="100%" /></div>
        <div className="card"><Skeleton height="200px" width="100%" /></div>
      </div>
    );
  }

  const planName = (planData?.plan_nombre || profileData?.plan_nombre || 'free').toLowerCase();
  const isPro = planName !== 'free' && planName !== 'starter';

  const usedListings = planData?.properties_used || 0;
  const maxListings = planData?.properties_per_month || (isPro ? '∞' : 10);
  
  const aiUsed = planData?.ai_used || 0;
  const aiMax = planData?.ai_generations || 10;
  const aiPct = Math.min((aiUsed / aiMax) * 100, 100);

  const imgUsed = planData?.images_used || 0;
  const imgMax = planData?.image_generations || 10;
  const imgPct = Math.min((imgUsed / imgMax) * 100, 100);

  let percentage = 0;
  if (maxListings !== '∞' && maxListings > 0) {
    percentage = Math.min((usedListings / maxListings) * 100, 100);
  }

  let limitReached = false;
  if (maxListings !== '∞' && usedListings >= maxListings) {
    limitReached = true;
  }

  const getBarColor = (pct) => pct > 90 ? 'var(--error)' : (pct > 70 ? '#F5A623' : 'var(--success)');
  const barColor = getBarColor(percentage);

  const getBadgeColor = () => {
    if (planName === 'starter') return 'badge-info';
    if (planName === 'pro') return 'badge-accent';
    if (planName === 'premium') return 'badge-violet';
    return '';
  };

  const status = planData?.mp_status;
  
  const featuresFree = [
    "10 listados por mes",
    "PDF básico",
    "Post Instagram"
  ];
  const featuresPro = [
    "Listados ilimitados",
    "Todos los formatos",
    "Video con IA",
    "Soporte prioritario"
  ];

  const features = isPro ? featuresPro : featuresFree;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in-up">
      {/* Aviso de cancelado */}
      {status === 'cancelled' && (
        <div style={{ background: 'var(--error-dim)', padding: '16px 20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--error)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertCircle color="var(--error)" size={20} />
            <span style={{ color: 'var(--error)', fontWeight: 500, fontSize: 14 }}>Tu suscripción fue cancelada. Renovate para seguir generando.</span>
          </div>
          <button className="btn btn-sm" style={{ background: 'var(--error)', color: '#fff', border: 'none' }} onClick={() => navigate('/precios')}>Ver planes</button>
        </div>
      )}

      {/* Plan Activo */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="text-label">PLAN ACTIVO</div>
          {status === 'active' && <span className="badge badge-success">Activo</span>}
          {status === 'cancelled' && <span className="badge badge-error">Cancelado</span>}
          {status === 'free' && <span className="badge" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>Plan gratuito</span>}
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,196,212,0.06), transparent)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 24
        }}>
          {planName !== 'free' ? (
            <div className={`badge ${getBadgeColor()}`} style={{ marginBottom: 16, textTransform: 'uppercase' }}>{planName}</div>
          ) : (
            <div className="badge" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', marginBottom: 16 }}>FREE</div>
          )}

          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, fontFamily: 'Syne', textTransform: 'capitalize' }}>
            Plan {planName}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {features.map((ft, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={14} color="var(--accent)" />
                <span style={{ fontSize: 14 }}>{ft}</span>
              </div>
            ))}
          </div>

          <button className={isPro ? "btn btn-secondary" : "btn btn-primary"} onClick={() => navigate('/precios')}>Cambiar plan &rarr;</button>
        </div>
      </div>

      {/* Uso del mes */}
      <div className="card">
        <div className="text-label" style={{ marginBottom: 16 }}>USO DEL MES</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Listados */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14 }}>Listados generados</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{usedListings} / {maxListings}</span>
            </div>
            {maxListings !== '∞' && (
              <>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-base)', overflow: 'hidden' }}>
                  <div style={{ width: `${percentage}%`, height: '100%', background: barColor, borderRadius: 3, transition: 'width 0.3s ease' }} />
                </div>
                {limitReached && (
                  <div style={{ fontSize: 12, color: 'var(--error)', marginTop: 8 }}>
                    Límite alcanzado — no podés generar más listados este mes
                  </div>
                )}
              </>
            )}
          </div>

          {/* AI */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14 }}>Generaciones AI (textos)</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{aiUsed} / {aiMax === -1 ? '∞' : aiMax}</span>
            </div>
            {aiMax !== -1 && (
              <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-base)', overflow: 'hidden' }}>
                <div style={{ width: `${aiPct}%`, height: '100%', background: getBarColor(aiPct), borderRadius: 3, transition: 'width 0.3s ease' }} />
              </div>
            )}
          </div>
          
          {/* Imagenes */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14 }}>Generaciones AI (imágenes/videos)</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{imgUsed} / {imgMax === -1 ? '∞' : imgMax}</span>
            </div>
            {imgMax !== -1 && (
              <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-base)', overflow: 'hidden' }}>
                <div style={{ width: `${imgPct}%`, height: '100%', background: getBarColor(imgPct), borderRadius: 3, transition: 'width 0.3s ease' }} />
              </div>
            )}
          </div>

          {/* Renovación */}
          {planData?.periodo_fin && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>Próxima renovación</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {new Date(planData.periodo_fin).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Facturación */}
      <div className="card">
        <div className="text-label" style={{ marginBottom: 24 }}>FACTURACIÓN</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
          <Receipt size={32} color="var(--text-tertiary)" style={{ marginBottom: 16 }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, textAlign: 'center' }}>
            El historial de pagos y facturas estará disponible próximamente.
          </p>
        </div>
      </div>
      
    </div>
  );
}
