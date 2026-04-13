import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { Layout, Plus, X } from 'lucide-react';
import { getDashboard } from '../../services/api';
import { useFormContext } from '../../context/FormContext';

const TemplatesModal = ({ isOpen, onClose }) => {
  const { formData, updateFormData } = useFormContext();
  const [plantillas, setPlantillas] = useState([]);
  const [recentListings, setRecentListings] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const saved = JSON.parse(localStorage.getItem('subzero_plantillas') || '[]');
      setPlantillas(saved);
      getDashboard()
        .then(res => setRecentListings(res.listados_recientes || []))
        .catch(console.error);
    }
  }, [isOpen]);

  const handleSaveCurrent = () => {
    // Solo permitimos guardar si por lo menos hay un tipo de propiedad o ciudad para tener contexto
    const hasData = formData?.tipoPropiedad || formData?.ciudad || formData?.tipo_propiedad; 
    if (!hasData) return;
    const nueva = {
      id: 'local_' + Date.now(),
      ...formData
    };
    const updated = [nueva, ...plantillas];
    setPlantillas(updated);
    localStorage.setItem('subzero_plantillas', JSON.stringify(updated));
  };

  const handleRemove = (id) => {
    const updated = plantillas.filter(t => t.id !== id);
    setPlantillas(updated);
    localStorage.setItem('subzero_plantillas', JSON.stringify(updated));
  };

  const allTemplates = [...plantillas, ...recentListings.map(r => ({ ...r, isRecent: true, id: 'api_' + r.id }))];

  return (
    <BaseModal title="Plantillas de Diseño" isOpen={isOpen} onClose={onClose}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', margin: 0 }}>
          Selecciona la estructura visual sobre la cual la IA generará tus entregables.
        </p>
        <button 
          onClick={handleSaveCurrent}
          className="btn btn-secondary" 
          style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Plus size={14} /> Guardar como plantilla
        </button>
      </div>

      {allTemplates.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-panel)', borderRadius: '12px', border: '1px dashed var(--border-idle)' }}>
          <Layout size={40} color="var(--text-light)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h4 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Aún no tenés plantillas guardadas.</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
            Completá un listado y guardalo como plantilla.
          </p>
        </div>
      ) : (
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
           {allTemplates.map(t => (
             <div 
                key={t.id} 
                onClick={() => { updateFormData(t); onClose(); }} 
                style={{ position: 'relative', backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-idle)', padding: '16px', borderRadius: '8px', cursor: 'pointer' }} 
                className="card-hover"
             >
               {!t.isRecent && (
                 <button 
                    onClick={(e) => { e.stopPropagation(); handleRemove(t.id); }}
                    style={{ position: 'absolute', top: '8px', right: '8px', background: 'transparent', border: 'none', color: 'var(--text-hints)', cursor: 'pointer' }}
                 >
                    <X size={14} />
                 </button>
               )}
               <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                 {(t.titulo || t.nombre) || `${t.tipoPropiedad || t.tipo_propiedad || 'Propiedad'} en ${t.ciudad || 'Ubicación'}`}
               </div>
               <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                 {t.tipoPropiedad || t.tipo_propiedad || 'Propiedad'} • {t.ciudad || 'Ubicación'} • {t.tono || 'profesional'}
               </div>
             </div>
           ))}
         </div>
      )}
    </BaseModal>
  );
};

export default TemplatesModal;
