import React from 'react';
import BaseModal from './BaseModal';
import { FileText, Calendar, Download } from 'lucide-react';
import { getDashboard } from '../../services/api';

const HistoryModal = ({ isOpen, onClose }) => {
  const [listados, setListados] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getDashboard()
        .then(data => setListados(data.listados_recientes || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  return (
    <BaseModal title="Historial de Generaciones" isOpen={isOpen} onClose={onClose}>

       <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
             <p style={{ color: 'var(--text-light)', textAlign: 'center' }}>Cargando historial...</p>
          ) : listados.length === 0 ? (
             <p style={{ color: 'var(--text-light)', textAlign: 'center' }}>No hay listados recientes.</p>
          ) : listados.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1rem', backgroundColor: 'var(--bg-panel)', borderRadius: '12px',
              border: `1px solid var(--border)`
            }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(0, 229, 255, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <FileText size={20} color="var(--accent)" />
                 </div>
                 <div>
                   <div style={{ fontWeight: 600, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>{item.titulo || 'Listado sin título'}</div>
                   <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>
                     <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12}/> {new Date(item.creado_en).toLocaleDateString('es-AR')}</span>
                     <span>{item.ciudad}</span>
                     <span>{item.precio && item.precio !== '' ? item.precio : 'Consultar'}</span>
                   </div>
                 </div>
               </div>
               
               <button 
                 className="btn-secondary" 
                 disabled
                 style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', gap: '6px', alignItems: 'center', opacity: 0.5, cursor: 'not-allowed' }}
                 title="Descarga deshabilitada temporalmente"
               >
                 <Download size={14} /> ZIP
               </button>
            </div>
          ))}
       </div>

    </BaseModal>
  );
};

export default HistoryModal;
