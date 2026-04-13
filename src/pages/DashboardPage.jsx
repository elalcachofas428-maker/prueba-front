import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppStore } from '../store/useAppStore';
import { getDashboard, eliminarListado } from '../services/api';
import {
  Plus, FileText, BarChart2, Video, Link2,
  Clock, LayoutTemplate, ArrowRight, MoreHorizontal,
  Trash2, Eye, Copy, AlertTriangle,
  Home, Building2, Store
} from 'lucide-react';
import { Skeleton, SkeletonCard } from '../components/ui/Skeleton';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60)     return 'Hace un momento';
  if (diff < 3600)   return `Hace ${Math.floor(diff/60)} min`;
  if (diff < 86400)  return `Hace ${Math.floor(diff/3600)}h`;
  if (diff < 604800) return `Hace ${Math.floor(diff/86400)} días`;
  return d.toLocaleDateString('es-AR', { day:'numeric', month:'short' });
};

const getPlanColor = (plan) => ({
  starter: 'var(--info)',
  pro:     'var(--accent)',
  premium: 'var(--violet-light)',
})[plan] || 'var(--accent)';

const getNichoIcon = (tipo) => {
  if (!tipo) return <Home size={20} color="var(--accent)" />;
  const t = tipo.toLowerCase();
  if (t.includes('casa') || t.includes('ph')) return <Home size={20} color="var(--accent)" />;
  if (t.includes('depto') || t.includes('departamento')) return <Building2 size={20} color="var(--violet-light)" />;
  return <Store size={20} color="var(--warning)" />;
};

function KPICard({ value, label, icon, loading, delay = 0 }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (loading || value === undefined || value === null) return;
    
    // Si no es un número (ej: "—"), mostrar directo sin animación
    if (isNaN(value)) {
      setDisplayed(value);
      return;
    }

    let start = 0;
    const end = parseInt(value) || 0;
    if (end === 0) { setDisplayed(0); return; }
    const duration = 1200;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplayed(end); clearInterval(timer); }
      else setDisplayed(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value, loading]);

  if (loading) return (
    <div className="card" style={{ padding:'16px 20px' }}>
      <Skeleton height="32px" width="60%" style={{ marginBottom:8 }} />
      <Skeleton height="12px" width="80%" />
    </div>
  );

  return (
    <div className="card animate-fade-in-up" style={{ padding:'16px 20px', animationDelay:`${delay}s` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontFamily:'Syne', fontSize:32, fontWeight:800, color:'var(--accent)', lineHeight:1, marginBottom:6 }}>
            {displayed}
          </div>
          <div className="text-label" style={{ marginTop:4 }}>{label}</div>
        </div>
        <div style={{ color:'var(--border-default)', marginTop:4 }}>{icon}</div>
      </div>
    </div>
  );
}

function ListadoCard({ item, onEliminar, onVer }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const { addToast } = useAppStore();

  const handleEliminar = async () => {
    setEliminando(true);
    try {
      await onEliminar(item.id);
      addToast({ type:'success', title:'Listado eliminado', message:'Se eliminó correctamente' });
    } catch {
      addToast({ type:'error', title:'Error', message:'No se pudo eliminar el listado' });
    } finally {
      setEliminando(false);
      setMenuOpen(false);
    }
  };

  const gradients = [
    'linear-gradient(135deg, #00D4FF22, #7C3AED22)',
    'linear-gradient(135deg, #10B98122, #00D4FF22)',
    'linear-gradient(135deg, #F59E0B22, #EF444422)',
    'linear-gradient(135deg, #7C3AED22, #10B98122)',
  ];
  const grad = gradients[item.id % gradients.length];

  return (
    <div className="card hover-lift" style={{ padding:0, overflow:'hidden', cursor:'pointer' }} onClick={() => onVer(item)}>
      <div style={{ height:120, background:grad, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
        <div style={{ width:48, height:48, borderRadius:'50%', background:'rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {getNichoIcon(item.tipo_propiedad)}
        </div>
        <div style={{ position:'absolute', top:8, right:8 }} onClick={e => e.stopPropagation()}>
          <button className="btn-icon" style={{ background:'rgba(7,11,20,0.6)', backdropFilter:'blur(4px)', width:28, height:28 }}
            onClick={() => setMenuOpen(!menuOpen)}>
            <MoreHorizontal size={14} />
          </button>
          {menuOpen && (
            <>
              <div style={{ position:'fixed', inset:0, zIndex:99 }} onClick={() => setMenuOpen(false)} />
              <div style={{
                position:'absolute', right:0, top:'calc(100% + 4px)',
                background:'var(--bg-panel)', border:'1px solid var(--border-default)',
                borderRadius:'var(--radius-lg)', padding:6, minWidth:160,
                zIndex:100, boxShadow:'var(--shadow-lg)', animation:'fadeIn 0.15s ease',
              }}>
                {[
                  { icon:<Eye size={14}/>, label:'Ver resultados', action:() => { onVer(item); setMenuOpen(false); }, color:'var(--text-secondary)' },
                  { icon:<Copy size={14}/>, label:'Duplicar', action:() => setMenuOpen(false), color:'var(--text-secondary)' },
                ].map((btn, i) => (
                  <button key={i} onClick={btn.action} style={{
                    display:'flex', alignItems:'center', gap:8, width:'100%',
                    padding:'8px 12px', background:'none', border:'none', cursor:'pointer',
                    fontFamily:'DM Sans', fontSize:13, color:btn.color,
                    borderRadius:'var(--radius-sm)', transition:'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background='var(--bg-card)'; e.currentTarget.style.color='var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color=btn.color; }}
                  >{btn.icon}{btn.label}</button>
                ))}
                <div style={{ height:1, background:'var(--border-subtle)', margin:'4px 0' }} />
                <button onClick={handleEliminar} disabled={eliminando} style={{
                  display:'flex', alignItems:'center', gap:8, width:'100%',
                  padding:'8px 12px', background:'none', border:'none', cursor:'pointer',
                  fontFamily:'DM Sans', fontSize:13, color:'var(--error)',
                  borderRadius:'var(--radius-sm)', transition:'all 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background='var(--error-dim)'}
                  onMouseLeave={e => e.currentTarget.style.background='none'}
                >
                  <Trash2 size={14} /> {eliminando ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ padding:'16px' }}>
        <span className="badge badge-accent" style={{ marginBottom:8, fontSize:10 }}>
          {item.tipo_propiedad || 'No especificado'}
        </span>
        <div style={{ fontFamily:'Syne', fontSize:14, fontWeight:600, color:'var(--text-primary)', marginBottom:4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
          {item.titulo || `${item.tipo_propiedad || 'Producto'} en ${item.ciudad || ''}`}
        </div>
        <div style={{ fontFamily:'DM Sans', fontSize:12, color:'var(--text-secondary)', marginBottom:12 }}>
          {item.ciudad}{item.precio ? ` · ${item.precio}` : ''}
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:12 }}>
          {['PDF','Post','Story','Email'].map(f => (
            <span key={f} style={{
              padding:'2px 8px', borderRadius:'var(--radius-full)',
              border:'1px solid var(--border-subtle)',
              fontFamily:'DM Sans', fontSize:10, color:'var(--text-tertiary)',
            }}>{f}</span>
          ))}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:10, borderTop:'1px solid var(--border-subtle)' }}>
          <span style={{ fontFamily:'DM Sans', fontSize:11, color:'var(--text-tertiary)' }}>
            {formatDate(item.creado_en)}
          </span>
        </div>
      </div>
    </div>
  );
}

function BorradorCard({ onContinuar, onDescartar }) {
  const [draft, setDraft] = useState(null);
  useEffect(() => {
    const d = JSON.parse(localStorage.getItem('subzero_draft') || 'null');
    if (d?.incompleto) setDraft(d);
    const handler = () => {
      const d2 = JSON.parse(localStorage.getItem('subzero_draft') || 'null');
      setDraft(d2?.incompleto ? d2 : null);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  if (!draft) return null;
  return (
    <div style={{
      padding:'16px 20px',
      background:'var(--accent-dim)', border:'1px solid var(--border-accent)',
      borderRadius:'var(--radius-lg)',
      display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, marginBottom:16,
      animation:'fadeIn 0.3s ease',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:'var(--radius-md)', background:'var(--accent-dim)', border:'1px solid var(--border-accent)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <FileText size={16} color="var(--accent)" />
        </div>
        <div>
          <div style={{ fontFamily:'DM Sans', fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>📝 Borrador sin terminar</div>
          <div style={{ fontFamily:'DM Sans', fontSize:12, color:'var(--text-secondary)' }}>
            {draft.tipoPropiedad || 'Producto'}{draft.ciudad ? ` · ${draft.ciudad}` : ''}
          </div>
        </div>
      </div>
      <div style={{ display:'flex', gap:8, flexShrink:0 }}>
        <button className="btn btn-ghost btn-sm" onClick={onDescartar} style={{ fontSize:12, color:'var(--text-tertiary)' }}>Descartar</button>
        <button className="btn btn-primary btn-sm" onClick={onContinuar} style={{ fontSize:12 }}>Continuar →</button>
      </div>
    </div>
  );
}

function EmptyState({ onNuevo }) {
  return (
    <div style={{ padding:'48px 24px', textAlign:'center', border:'1px dashed var(--border-default)', borderRadius:'var(--radius-lg)', background:'var(--bg-card)' }}>
      <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--bg-panel)', border:'1px solid var(--border-subtle)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
        <FileText size={28} color="var(--text-tertiary)" />
      </div>
      <h3 className="text-h3" style={{ marginBottom:8 }}>Todavía no generaste ningún listado</h3>
      <p style={{ fontFamily:'DM Sans', fontSize:14, color:'var(--text-secondary)', marginBottom:24, maxWidth:320, margin:'0 auto 24px' }}>
        Creá tu primer material de marketing en menos de 2 minutos.
      </p>
      <button className="btn btn-primary" onClick={onNuevo} style={{ gap:8 }}>
        <Plus size={16} /> Crear tu primer listado
      </button>
    </div>
  );
}

function PlanBar({ planData, usageData, loading }) {
  if (loading) return (
    <div className="card" style={{ padding:'12px 20px' }}>
      <Skeleton height="16px" width="100%" />
    </div>
  );
  const used  = usageData?.properties_used ?? 0;
  const total = planData?.properties_per_month ?? 10;
  const pct   = Math.min(100, Math.round((used / total) * 100));
  
  // TAREA 3: Mapeo de nombre de plan
  const planNameRaw = planData?.nombre || 'free';
  const planName = {
    'free': 'Free',
    'starter': 'Starter',
    'pro': 'Pro',
    'enterprise': 'Enterprise'
  }[planNameRaw.toLowerCase()] || planNameRaw || 'Free';

  const planCapitalized = planName;
  let fillColor = 'var(--accent)';
  if (pct >= 100) fillColor = 'var(--error)';
  else if (pct >= 80) fillColor = 'var(--warning)';

  return (
    <div className="card" style={{ padding:'12px 20px', display:'flex', alignItems:'center', gap:16 }}>
      <span style={{ fontFamily:'DM Sans', fontSize:13, color:'var(--text-secondary)', flexShrink:0, display:'flex', alignItems:'center', gap:6 }}>
        <span style={{ width:8, height:8, borderRadius:'50%', background:getPlanColor(planName), display:'inline-block' }} />
        Plan {planCapitalized} · {used}/{total} listados
      </span>
      <div className="progress-bar-track" style={{ flex:1 }}>
        <div className="progress-bar-fill" style={{ width:`${pct}%`, background:fillColor, transition:'width 0.6s ease' }} />
      </div>
      {pct >= 100 && (
        <span style={{ fontFamily:'DM Sans', fontSize:12, color:'var(--error)', flexShrink:0, display:'flex', alignItems:'center', gap:4 }}>
          <AlertTriangle size={12} /> Límite alcanzado
        </span>
      )}
      <a href="/cuenta" style={{ fontFamily:'DM Sans', fontSize:13, color:'var(--accent)', textDecoration:'none', flexShrink:0, whiteSpace:'nowrap' }}>
        Ampliar plan →
      </a>
    </div>
  );
}

function PlantillasRapidas({ onSeleccionar }) {
  const plantillas = [
    { emoji:'🏠', nombre:'Inmobiliaria',  tipo:'Inmueble',          tono:'acogedor',    subtitulo:'Casa, Depto o Local', slug: 'inmobiliaria' },
    { emoji:'🛒', nombre:'E-commerce',    tipo:'Producto',          tono:'comercial',   subtitulo:'Venta de producto físico', slug: 'ecommerce' },
    { emoji:'💼', nombre:'Servicios',     tipo:'Consultoría',       tono:'profesional', subtitulo:'Promoción de servicios', slug: 'servicios' },
    { emoji:'⚡', nombre:'Reel rápido',   tipo:'Producto',          tono:'energetico',  subtitulo:'Publicación dinámica', slug: 'reel' },
  ];
  return (
    <section style={{ marginTop:36 }}>
      <h3 className="text-h3" style={{ marginBottom:16 }}>Plantillas rápidas</h3>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:12 }}>
        {plantillas.map((p, i) => (
          <div key={i} className="card hover-lift" style={{ padding:'20px 16px', cursor:'pointer' }} onClick={() => onSeleccionar(p)}>
            <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--accent-dim)', border:'1px solid var(--border-accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginBottom:12 }}>
              {p.emoji}
            </div>
            <div style={{ fontFamily:'DM Sans', fontSize:14, fontWeight:500, color:'var(--text-primary)', marginBottom:4 }}>{p.nombre}</div>
            <div style={{ fontFamily:'DM Sans', fontSize:12, color:'var(--text-secondary)' }}>{p.subtitulo}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AccionesRapidas({ onNuevo }) {
  const navigate = useNavigate();
  const acciones = [
    { icon:<Plus size={20} color="var(--accent)"/>, titulo:'Nuevo listado', desc:'Generá material en 2 minutos', action:onNuevo, accent:true },
    { icon:<LayoutTemplate size={20} color="var(--violet-light)"/>, titulo:'Plantillas', desc:'Empezá desde una base', action:() => {} },
    { icon:<Clock size={20} color="var(--text-secondary)"/>, titulo:'Ver historial', desc:'Todos tus listados', action:() => navigate('/historial') },
  ];
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:12, marginTop:28 }}>
      {acciones.map((a, i) => (
        <div key={i} className="card hover-lift" style={{
          padding:'16px 20px', cursor:'pointer', display:'flex', alignItems:'center', gap:16,
          border: a.accent ? '1px solid var(--border-accent)' : undefined,
          background: a.accent ? 'linear-gradient(135deg, var(--accent-dim), transparent)' : undefined,
        }} onClick={a.action}>
          <div style={{ width:40, height:40, borderRadius:'var(--radius-md)', background:'var(--bg-panel)', border:'1px solid var(--border-subtle)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            {a.icon}
          </div>
          <div>
            <div style={{ fontFamily:'Syne', fontSize:14, fontWeight:600, color:'var(--text-primary)', marginBottom:2 }}>{a.titulo}</div>
            <div style={{ fontFamily:'DM Sans', fontSize:12, color:'var(--text-secondary)' }}>{a.desc}</div>
          </div>
          <ArrowRight size={14} color="var(--text-tertiary)" style={{ marginLeft:'auto' }} />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user, refreshPlan } = useAuth();
  const { addToast } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading,   setLoading]   = useState(true);
  const [metrics,   setMetrics]   = useState(null);
  const [recent,    setRecent]    = useState([]);
  const [planData,  setPlanData]  = useState(null);
  const [usageData, setUsageData] = useState(null);

  const today = new Date().toLocaleDateString('es-AR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  const cargarDashboard = async () => {
    setLoading(true);
    try {
      const data = await getDashboard();
      console.log('Dashboard data completa:', JSON.stringify(data, null, 2));
      setMetrics({
        listados_este_mes: data.listados_este_mes ?? 0,
        total_generados:   data.total_generados   ?? 0,
        videos_creados:    data.videos_creados    ?? 0,
        conexiones:        data.conexiones_activas ?? 0,
      });
      setRecent(data.listados_recientes ?? []);
      setPlanData({ ...data.plan_limites, nombre: data.plan } ?? null);
      setUsageData(data.uso_actual   ?? null);
    } catch {
      addToast({ type:'error', title:'Error al cargar dashboard', message:'Intentá recargar la página' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    cargarDashboard(); 
    const searchParams = new URLSearchParams(location.search);
    
    // Feedback de pago de MercadoPago
    const pago = searchParams.get('pago');
    const plan = searchParams.get('plan');
    if (pago === 'exitoso') {
      addToast({ 
        type: 'success', 
        title: '¡Plan activado!', 
        message: `Tu plan ${plan} está activo. ¡Bienvenido!` 
      });
      refreshPlan();
    }

    if (searchParams.get('checkout') === 'success') {
      refreshPlan();
    }
  }, []);

  const handleNuevo = () => {
    localStorage.removeItem('subzero_draft');
    localStorage.removeItem('subzeroFormData');
    localStorage.removeItem('subzeroCurrentStep');
    sessionStorage.clear();
    navigate('/nuevo');
  };

  const handleEliminar = async (id) => {
    await eliminarListado(id);
    setRecent(prev => prev.filter(item => item.id !== id));
    setMetrics(prev => prev ? {
      ...prev,
      listados_este_mes: Math.max(0, prev.listados_este_mes - 1),
      total_generados:   Math.max(0, prev.total_generados - 1),
    } : prev);
  };

  const handleVerListado    = (item) => navigate('/resultados', { state:{ listado:item } });
  const handlePlantilla     = (p)    => {
    localStorage.removeItem('subzero_draft');
    localStorage.removeItem('subzeroFormData');
    localStorage.removeItem('subzeroCurrentStep');
    sessionStorage.clear();
    navigate(`/nuevo?plantilla=${p.slug}`);
  };
  const handleContinuarBorrador = () => navigate('/nuevo', { state:{ fromDraft:true } });
  const handleDescartarBorrador = () => { localStorage.removeItem('subzero_draft'); window.dispatchEvent(new Event('storage')); };

  const kpis = [
    { value:metrics?.listados_este_mes, label:'Listados este mes',  icon:<FileText  size={20}/>, delay:0.05 },
    { value:metrics?.total_generados,   label:'Total generados',    icon:<BarChart2 size={20}/>, delay:0.10 },
    { value:metrics?.videos_creados,    label:'Videos creados',     icon:<Video     size={20}/>, delay:0.15 },
    { value:metrics?.conexiones,        label:'Conexiones activas', icon:<Link2     size={20}/>, delay:0.20 },
  ];

  const planNombreRaw   = planData?.nombre || user?.plan_nombre || 'free';
  const planNombre      = {
    'free': 'Free',
    'starter': 'Starter',
    'pro': 'Pro',
    'enterprise': 'Enterprise'
  }[planNombreRaw.toLowerCase()] || planNombreRaw || 'Free';
  
  const planCapitalized = planNombre;

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'40px 40px 80px' }}>

      {/* Header */}
      <div className="animate-fade-in-up" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32 }}>
        <div>
          <h1 style={{ fontFamily:'Syne', fontSize:32, fontWeight:700, marginBottom:6 }}>
            Hola, {user?.name?.split(' ')[0] || user?.email?.split('@')[0]} 👋
          </h1>
          <div style={{ display:'flex', alignItems:'center', gap:10, fontFamily:'DM Sans', fontSize:14, color:'var(--text-secondary)' }}>
            <span>{todayCapitalized}</span>
            <span style={{ color:'var(--border-default)' }}>·</span>
            <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:getPlanColor(planNombre), display:'inline-block' }} />
              Plan {planCapitalized} activo
            </span>
          </div>
        </div>
        <button className="btn btn-primary animate-fade-in-up" onClick={handleNuevo} style={{ gap:8 }}>
          <Plus size={16} /> Nuevo listado
        </button>
      </div>

      {/* Acciones rápidas */}
      <AccionesRapidas onNuevo={handleNuevo} />

      {/* KPIs */}
      <div className="dashboard-kpis" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginTop:28 }}>
        {kpis.map((k, i) => <KPICard key={i} {...k} loading={loading} />)}
      </div>

      {/* Recientes */}
      <section style={{ marginTop:36 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h3 className="text-h3">Recientes</h3>
          <a href="/historial" style={{ fontFamily:'DM Sans', fontSize:13, color:'var(--accent)', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>
            Ver todos <ArrowRight size={14} />
          </a>
        </div>

        <BorradorCard onContinuar={handleContinuarBorrador} onDescartar={handleDescartarBorrador} />

        {loading ? (
          <div className="dashboard-recent" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {[1,2,3].map(i => <SkeletonCard key={i} lines={4} />)}
          </div>
        ) : recent.length === 0 ? (
          <EmptyState onNuevo={handleNuevo} />
        ) : (
          <div className="dashboard-recent" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16 }}>
            {recent.map(item => (
              <ListadoCard key={item.id} item={item} onEliminar={handleEliminar} onVer={handleVerListado} />
            ))}
          </div>
        )}
      </section>

      {/* Plantillas */}
      <PlantillasRapidas onSeleccionar={handlePlantilla} />

      {/* Plan Bar */}
      <div style={{ marginTop:36 }}>
        <PlanBar planData={planData} usageData={usageData} loading={loading} />
      </div>

    </div>
  );
}
