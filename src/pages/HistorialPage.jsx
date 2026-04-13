import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorState } from '../components/results/helpers';
import ResultSkeleton from '../components/results/ResultSkeleton';
import ListadoCard from '../components/historial/ListadoCard';
import HistorialFiltros from '../components/historial/HistorialFiltros';
import HistorialEmptyState from '../components/historial/HistorialEmptyState';
import EliminarModal from '../components/historial/EliminarModal';
import DuplicarToast from '../components/historial/DuplicarToast';
import { API_BASE_URL } from '../services/api';

export default function HistorialPage() {
  const navigate = useNavigate();

  // Estados locales
  const [listados, setListados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros y ordenamiento
  const [search, setSearch] = useState('');
  const [filtroOperacion, setFiltroOperacion] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [ordenar, setOrdenar] = useState('recientes');

  // Acciones secundarias
  const [listadoAEliminar, setListadoAEliminar] = useState(null);
  const [loadingEliminar, setLoadingEliminar] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState(null);
  
  const [showToast, setShowToast] = useState(false);

  // Fetch
  const fetchHistorial = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/listados/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token') || localStorage.getItem('subzero_access')}`
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // Formato esperado de django: []
      setListados(Array.isArray(data) ? data : (data.results || []));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  // Handlers
  const handleDuplicar = (listado) => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate('/nuevo', { state: { prefill: listado } });
    }, 500);
  };

  const handleConfirmarEliminar = async (id) => {
    setLoadingEliminar(true);
    setErrorEliminar(null);
    try {
      const res = await fetch(`${API_BASE_URL}/listados/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token') || localStorage.getItem('subzero_access')}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      setListados(prev => prev.filter(l => l.id !== id));
      setListadoAEliminar(null);
    } catch (err) {
      setErrorEliminar(err.message || 'Error al eliminar');
    } finally {
      setLoadingEliminar(false);
    }
  };

  // Filtrado en memoria
  const listadosFiltrados = listados.filter(l => {
    if (search) {
      const s = search.toLowerCase();
      const tp = (l.tipoPropiedad || '').toLowerCase();
      const cid = (l.ciudad || '').toLowerCase();
      const dir = (l.direccion || '').toLowerCase();
      if (!tp.includes(s) && !cid.includes(s) && !dir.includes(s)) return false;
    }
    
    if (filtroOperacion !== 'todos') {
      if ((l.operacion || '').toLowerCase() !== filtroOperacion) return false;
    }

    if (filtroTipo !== 'todos') {
      if ((l.tipoPropiedad || '').toLowerCase() !== filtroTipo) return false;
    }

    return true;
  }).sort((a, b) => {
    const da = new Date(a.created_at || 0).getTime();
    const db = new Date(b.created_at || 0).getTime();
    if (ordenar === 'recientes') return db - da;
    if (ordenar === 'antiguos') return da - db;
    if (ordenar === 'az') return (a.ciudad || '').localeCompare(b.ciudad || '');
    return 0;
  });

  const isFiltering = search !== '' || filtroOperacion !== 'todos' || filtroTipo !== 'todos';

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px', position: 'relative' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="text-h2" style={{ marginBottom: 4 }}>Historial</h1>
        <p className="text-body text-secondary">
          {listados.length} listados generados en total
        </p>
      </div>

      {/* Filtros */}
      <HistorialFiltros 
        search={search} onSearch={setSearch}
        filtroOperacion={filtroOperacion} onFiltroOperacion={setFiltroOperacion}
        filtroTipo={filtroTipo} onFiltroTipo={setFiltroTipo}
        ordenar={ordenar} onOrdenar={setOrdenar}
        totalCount={listados.length} filteredCount={listadosFiltrados.length}
      />

      {/* Contenido en base al estado de carga y error */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          <ResultSkeleton height={200} lines={3} />
          <ResultSkeleton height={200} lines={3} />
          <ResultSkeleton height={200} lines={3} />
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={fetchHistorial} label="historial" />
      ) : listadosFiltrados.length === 0 ? (
        <HistorialEmptyState 
          hasFilters={isFiltering} 
          onLimpiar={() => { setSearch(''); setFiltroOperacion('todos'); setFiltroTipo('todos'); }} 
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {listadosFiltrados.map(listado => (
            <ListadoCard 
              key={listado.id} 
              listado={listado} 
              onDuplicar={handleDuplicar}
              onEliminar={setListadoAEliminar}
            />
          ))}
        </div>
      )}

      <EliminarModal 
        listado={listadoAEliminar}
        loading={loadingEliminar}
        error={errorEliminar}
        onConfirmar={handleConfirmarEliminar}
        onCancelar={() => {
          if (!loadingEliminar) {
            setListadoAEliminar(null);
            setErrorEliminar(null);
          }
        }}
      />

      <DuplicarToast visible={showToast} mensaje="Iniciando listado duplicado..." />

    </div>
  );
}
