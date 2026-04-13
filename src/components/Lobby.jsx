import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFormContext } from '../context/FormContext';
import { Sparkles, Home, Building2, Store, Video, Calendar, DollarSign } from 'lucide-react';
import { getDashboard, eliminarListado } from '../services/api';

const SKELETON_STYLE = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  borderRadius: '8px',
  position: 'relative',
  overflow: 'hidden'
};

const Lobby = ({ onStartWizard }) => {
  const { user } = useAuth();
  const { updateFormData, resetForm } = useFormContext();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [recent, setRecent] = useState([]);
  const [draft, setDraft] = useState(null);
  const [planData, setPlanData] = useState({ name: 'Free', used: 0, limit: 10 });

  useEffect(() => {
    const savedDraft = localStorage.getItem('subzero_draft');
    if (savedDraft) {
      try { setDraft(JSON.parse(savedDraft)); } catch(e) {}
    }
    async function loadDashboard() {
      try {
        const data = await getDashboard();
        setMetrics({
          monthListings: data.listados_este_mes || 0,
          totalGenerated: data.total_generados || 0,
          videosCreated: data.videos_creados || 0,
          rating: '4.8/5' // Default fallback since it's hardcoded in mockup
        });
        setRecent(data.listados_recientes || []);
        if (data.plan) {
          setPlanData({
            name: data.plan,
            used: data.uso_actual?.properties_used || 0,
            limit: data.plan_limites?.properties_per_month || 10
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard', err);
        // Fallbacks on error
        setMetrics({ monthListings: 0, totalGenerated: 0, videosCreated: 0, rating: '---' });
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const name = user?.agencyName || user?.name?.split(' ')[0] || (user?.email?.split('@')[0] || 'Agente');
  const currentDate = new Intl.DateTimeFormat('es-AR', { dateStyle: 'long' }).format(new Date());

  const handleQuickTemplate = (template) => {
    resetForm();
    updateFormData(template);
    onStartWizard();
  };

  const handleEliminarListado = async (id) => {
    try {
      await eliminarListado(id);
      setRecent(prev => prev.filter(item => item.id !== id));
      setMetrics(prev => ({
        ...prev,
        listados_este_mes: Math.max(0, (prev?.listados_este_mes || 1) - 1),
        total_generados: Math.max(0, (prev?.total_generados || 1) - 1)
      }));
    } catch(e) {
      console.error('Error al eliminar listado:', e);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* HEADER LOBBY */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Hola, {name} 👋
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          {currentDate} · Plan {planData.name.charAt(0).toUpperCase() + planData.name.slice(1)} Activo
        </p>
      </div>

      {/* METRICS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {['Listados este mes', 'Total generados', 'Videos creados', 'Calificación'].map((label, idx) => (
          <div key={idx} style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-idle)', borderRadius: '10px', padding: '16px' }}>
            {loading ? (
              <div className="skeleton" style={{ width: '40px', height: '28px', marginBottom: '8px' }}></div>
            ) : (
              <div style={{ fontSize: '28px', fontWeight: 600, color: 'var(--accent)', marginBottom: '4px' }}>
                {idx === 0 && metrics.monthListings}
                {idx === 1 && metrics.totalGenerated}
                {idx === 2 && metrics.videosCreated}
                {idx === 3 && metrics.rating}
              </div>
            )}
            <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <div>
        <button className="btn btn-primary" onClick={() => { resetForm(); onStartWizard(); }} style={{ padding: '12px 32px', fontSize: '15px' }}>
          + Nuevo listado &rarr;
        </button>
      </div>

      {/* RECENT SECTION */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Recientes</h2>
        
        {loading ? (
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="card-base" style={{ minWidth: '300px', flex: 1, padding: '16px' }}>
                <div className="skeleton" style={{ height: '140px', borderRadius: '8px', marginBottom: '16px' }}></div>
                <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '8px' }}></div>
                <div className="skeleton" style={{ height: '16px', width: '40%' }}></div>
              </div>
            ))}
          </div>
        ) : (recent.length === 0 && !draft) ? (
          /* EMPTY STATE */
          <div style={{ 
            backgroundColor: 'var(--bg-panel)', border: '1px dashed var(--border-idle)', borderRadius: '10px', 
            padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' 
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-hints)', marginBottom: '16px' }}>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <p style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: '8px', fontSize: '15px' }}>
              Todavía no generaste ningún listado
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Creá tu primer material de marketing en menos de 2 minutos.
            </p>
            <button className="btn btn-secondary" onClick={() => { resetForm(); onStartWizard(); }} style={{ fontSize: '13px', padding: '8px 20px' }}>
              Crear tu primer listado &rarr;
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', scrollSnapType: 'x mandatory' }}>
            {draft && (
              <div className="card-base card-hover" style={{ position: 'relative', minWidth: '280px', flex: 1, padding: '20px', cursor: 'pointer', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', border: '1px solid var(--accent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', backgroundColor: 'var(--accent)', color: '#000', textTransform: 'uppercase' }}>
                    📝 Borrador sin terminar
                  </span>
                  <button onClick={(e)=>{e.preventDefault(); e.stopPropagation(); localStorage.removeItem('subzero_draft'); setDraft(null);}} style={{position: 'absolute', top: '8px', right: '8px', background:'transparent', border:'none', color:'var(--text-secondary)', cursor:'pointer', fontSize:'1.25rem', zIndex: 10}}>&times;</button>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {draft.tipoPropiedad ? `${draft.tipoPropiedad} en ${draft.ciudad}` : 'Listado sin terminar'}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Quedaste en el Paso {draft.step || 1}
                </p>
                <div style={{ marginTop: 'auto' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => {
                        updateFormData(draft);
                        onStartWizard();
                    }}
                    style={{ width: '100%', padding: '8px', fontSize: '13px' }}
                  >
                    Continuar guardando &rarr;
                  </button>
                </div>
              </div>
            )}
            {recent.map((item, idx) => (
              <div key={idx} className="card-base card-hover" style={{ position: 'relative', minWidth: '280px', flex: 1, padding: '20px', cursor: 'pointer', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column' }}>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEliminarListado(item.id);
                  }}
                  style={{ position: 'absolute', top: '8px', right: '8px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem', zIndex: 10 }}
                >
                  &times;
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(0, 229, 255, 0.1)', color: 'var(--accent)', textTransform: 'uppercase' }}>
                    {item.tipo_propiedad || 'Propiedad'}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {new Date(item.creado_en).toLocaleDateString('es-AR')}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.titulo || 'Listado sin título'}
                </h3>
                
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  {item.ciudad || 'Sin ubicación'}
                </p>
                
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <DollarSign size={16} color="var(--accent)" /> {item.precio || 'Consultar'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QUICK TEMPLATES */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Plantillas rápidas</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          
          <div 
             className="card-base card-hover" 
             onClick={() => handleQuickTemplate({ tipoPropiedad: 'Casa', tono: 'acogedor' })}
             style={{ padding: '16px', cursor: 'pointer', borderColor: 'rgba(0, 196, 212, 0.15)', backgroundImage: 'linear-gradient(180deg, rgba(0, 196, 212, 0.03) 0%, transparent 100%)' }}>
             <Home size={20} color="var(--accent)" style={{ marginBottom: '12px' }} />
             <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Casa familiar</div>
             <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Tono acogedor</div>
          </div>
          <div 
             className="card-base card-hover" 
             onClick={() => handleQuickTemplate({ tipoPropiedad: 'Departamento', tono: 'lujo' })}
             style={{ padding: '16px', cursor: 'pointer', borderColor: 'rgba(0, 196, 212, 0.15)', backgroundImage: 'linear-gradient(180deg, rgba(0, 196, 212, 0.03) 0%, transparent 100%)' }}>
             <Building2 size={20} color="var(--accent)" style={{ marginBottom: '12px' }} />
             <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Depto moderno</div>
             <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Tono lujo</div>
          </div>
          <div 
             className="card-base card-hover" 
             onClick={() => handleQuickTemplate({ tipoPropiedad: 'Local comercial', tono: 'profesional' })}
             style={{ padding: '16px', cursor: 'pointer', borderColor: 'rgba(0, 196, 212, 0.15)', backgroundImage: 'linear-gradient(180deg, rgba(0, 196, 212, 0.03) 0%, transparent 100%)' }}>
             <Store size={20} color="var(--accent)" style={{ marginBottom: '12px' }} />
             <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Local / Oficina</div>
             <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Tono profesional</div>
          </div>
          <div 
             className="card-base card-hover" 
             onClick={() => handleQuickTemplate({ tipoPropiedad: 'Casa', tipoVideo: 'reel', tono: 'energetico' })}
             style={{ padding: '16px', cursor: 'pointer', borderColor: 'rgba(0, 196, 212, 0.15)', backgroundImage: 'linear-gradient(180deg, rgba(0, 196, 212, 0.03) 0%, transparent 100%)' }}>
             <Video size={20} color="var(--accent)" style={{ marginBottom: '12px' }} />
             <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Reel rápido</div>
             <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Tono energético</div>
          </div>

        </div>
      </div>

      {/* PLAN BAR */}
      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '0.5px solid var(--border-idle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Plan {planData.name.charAt(0).toUpperCase() + planData.name.slice(1)} · {planData.used}/{planData.limit} listados
            {planData.used >= planData.limit && <span style={{ color: 'var(--error)', marginLeft: '8px' }}>Límite alcanzado</span>}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>Ampliar plan &rarr;</span>
        </div>
        <div className="progress-container" style={{ height: '4px', backgroundColor: 'var(--bg-panel)' }}>
           <div className="progress-bar" style={{ 
              width: `${Math.min(100, (planData.used / Math.max(1, planData.limit)) * 100)}%`,
              backgroundColor: planData.used >= planData.limit ? 'var(--error)' : (planData.used / Math.max(1, planData.limit) >= 0.8 ? 'orange' : 'var(--accent)')
           }}></div>
        </div>
      </div>

    </div>
  );
};

export default Lobby;
