import { useState, useEffect } from 'react';
import { getAdminMetricas, getAdminUsuarios, cambiarPlanUsuario, eliminarUsuario } from '../services/api';
import { Users, TrendingUp, Activity, DollarSign, Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

export default function AdminPage() {
  const [metricas, setMetricas] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  const loadData = async () => {
    setLoading(true);
    try {
      const [metRes, usrRes] = await Promise.all([
        getAdminMetricas(),
        getAdminUsuarios(page, search)
      ]);
      setMetricas(metRes);
      setUsuarios(usrRes.results || []);
      setTotalPages(Math.ceil((usrRes.count || 1) / 10));
    } catch (e) {
      console.error("Error cargando admin:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [page, search]);

  const handleCambiarPlan = async (id, plan) => {
    try {
      await cambiarPlanUsuario(id, plan);
      loadData();
    } catch (e) {
      console.error(e);
      alert('Error cambiando el plan');
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que querés eliminar este usuario?")) {
      try {
        await eliminarUsuario(id);
        loadData();
      } catch (e) {
        console.error(e);
        alert('Error eliminando usuario');
      }
    }
  };

  if (loading && !metricas) {
    return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background: 'var(--bg-base)' }}><div className="animate-spin" style={{ width:32, height:32, border:'2px solid var(--border-default)', borderTop:'2px solid var(--accent)', borderRadius:'50%' }} /></div>;
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Panel de Administración</h1>
          <span style={{ background: 'var(--accent)', color: 'white', padding: '4px 8px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>Admin</span>
        </div>
        <button onClick={loadData} style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          color: 'var(--text-primary)', padding: '8px 16px', borderRadius: 'var(--radius-md)',
          cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 600,
          transition: 'all 0.15s'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--border-subtle)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}
        >
          Actualizar datos
        </button>
      </div>

      {/* Metricas */}
      {metricas && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 32 }}>
          <div style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 8, background: 'rgba(99,102,241,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent)' }}><Users size={20} /></div>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Total Usuarios</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)' }}>{metricas.total_usuarios || 0}</div>
          </div>
          
          <div style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 8, background: 'rgba(34,197,94,0.1)', borderRadius: 'var(--radius-md)', color: '#22c55e' }}><TrendingUp size={20} /></div>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Listados este mes</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)' }}>{metricas.listados_mes || 0}</div>
          </div>
          
          <div style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 8, background: 'rgba(245,158,11,0.1)', borderRadius: 'var(--radius-md)', color: '#f59e0b' }}><Activity size={20} /></div>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Activos este mes</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)' }}>{metricas.usuarios_activos_mes || 0}</div>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 8, background: 'rgba(236,72,153,0.1)', borderRadius: 'var(--radius-md)', color: '#ec4899' }}><DollarSign size={20} /></div>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Ingresos del mes</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)' }}>${metricas.ingresos_mes || 0} USD</div>
          </div>
        </div>
      )}

      {/* Planes */}
      {metricas && metricas.planes && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, color: 'var(--text-primary)', marginBottom: 20 }}>Distribución de Planes</h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {['starter', 'pro', 'premium'].map(p => (
              <div key={p} style={{ flex: '1 1 200px', background: 'var(--bg-surface)', padding: 20, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{p}</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{metricas.planes[p] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabla usuarios */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        <div style={{ padding: 24, borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <h2 style={{ fontSize: 18, margin: 0, color: 'var(--text-primary)' }}>Usuarios</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <Search size={16} color="var(--text-tertiary)" />
            <input 
              type="text" 
              placeholder="Buscar por email o nombre..." 
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', width: '100%', minWidth: 200 }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 800 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: 16, color: 'var(--text-secondary)', fontWeight: 500 }}>Usuario</th>
                <th style={{ padding: 16, color: 'var(--text-secondary)', fontWeight: 500 }}>Nombre</th>
                <th style={{ padding: 16, color: 'var(--text-secondary)', fontWeight: 500 }}>Plan</th>
                <th style={{ padding: 16, color: 'var(--text-secondary)', fontWeight: 500 }}>Listados</th>
                <th style={{ padding: 16, color: 'var(--text-secondary)', fontWeight: 500 }}>Registro</th>
                <th style={{ padding: 16, color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {u.email[0].toUpperCase()}
                      </div>
                      <span style={{ color: 'var(--text-primary)' }}>{u.email}</span>
                    </div>
                  </td>
                  <td style={{ padding: 16, color: 'var(--text-secondary)' }}>{u.nombre || '-'}</td>
                  <td style={{ padding: 16 }}>
                    <span style={{
                      padding: '4px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                      ...u.plan_nombre === 'premium' ? { background: 'rgba(236,72,153,0.1)', color: '#ec4899' } :
                      u.plan_nombre === 'pro' ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e' } :
                      { background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }
                    }}>
                      {u.plan_nombre || 'starter'}
                    </span>
                  </td>
                  <td style={{ padding: 16, color: 'var(--text-secondary)' }}>{u.listados_totales || 0}</td>
                  <td style={{ padding: 16, color: 'var(--text-secondary)' }}>{u.fecha_registro ? new Date(u.fecha_registro).toLocaleDateString() : '-'}</td>
                  <td style={{ padding: 16, textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                      <select 
                        value={u.plan_nombre || 'starter'} 
                        onChange={e => handleCambiarPlan(u.id, e.target.value)}
                        style={{ background: 'var(--bg-base)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', padding: '4px 8px', borderRadius: 'var(--radius-sm)', outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="starter">Starter</option>
                        <option value="pro">Pro</option>
                        <option value="premium">Premium</option>
                      </select>
                      <button onClick={() => handleEliminar(u.id)} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginacion */}
        <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Página {page} de {Math.max(1, totalPages)}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', padding: 8, borderRadius: 'var(--radius-md)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', padding: 8, borderRadius: 'var(--radius-md)', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
