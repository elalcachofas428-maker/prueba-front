import React from 'react';
import { Search, X } from 'lucide-react';

export default function HistorialFiltros({
  search, onSearch,
  filtroOperacion, onFiltroOperacion,
  filtroTipo, onFiltroTipo,
  ordenar, onOrdenar,
  totalCount, filteredCount
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        
        {/* Input Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} color="var(--text-secondary)" style={{ position: 'absolute', left: 14, top: 13 }} />
          <input 
            className="input"
            style={{ paddingLeft: 38, paddingRight: search ? 36 : 14 }}
            placeholder="Buscar por tipo, ciudad, dirección..."
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
          {search && (
           <button 
              style={{ position: 'absolute', right: 8, top: 8, background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: 4, cursor: 'pointer' }}
              onClick={() => onSearch('')}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Select Operación */}
        <select 
          className="input select" 
          style={{ width: 160, flexShrink: 0 }}
          value={filtroOperacion}
          onChange={e => onFiltroOperacion(e.target.value)}
        >
          <option value="todos">Todas las oper...</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
          <option value="alquiler temporal">Temporal</option>
        </select>

        {/* Select Tipo */}
        <select 
          className="input select" 
          style={{ width: 140, flexShrink: 0 }}
          value={filtroTipo}
          onChange={e => onFiltroTipo(e.target.value)}
        >
          <option value="todos">Todos los ti...</option>
          <option value="casa">Casa</option>
          <option value="departamento">Departamento</option>
          <option value="local">Local</option>
          <option value="oficina">Oficina</option>
          <option value="terreno">Terreno</option>
          <option value="otro">Otro</option>
        </select>

        {/* Select Ordenar */}
        <select 
          className="input select" 
          style={{ width: 160, flexShrink: 0 }}
          value={ordenar}
          onChange={e => onOrdenar(e.target.value)}
        >
          <option value="recientes">Más recientes</option>
          <option value="antiguos">Más antiguos</option>
          <option value="az">A&rarr;Z por ciudad</option>
        </select>
      </div>

      {filteredCount < totalCount && (
        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
          Mostrando {filteredCount} de {totalCount} listados
        </div>
      )}
    </div>
  );
}
