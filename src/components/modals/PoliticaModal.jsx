import { useEffect, useState } from 'react';
import { obtenerPoliticaPrivacidad } from '../../services/api';
import './TerminosModal.css';

export default function PoliticaModal({ isOpen, onClose }) {
  const [politica, setPolitica] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      obtenerPoliticaPrivacidad()
        .then(data => {
          setPolitica(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error:', err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <div className="btn-spinner" style={{ width: 30, height: 30, margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Cargando política de privacidad...</p>
          </div>
        ) : (
          <>
            <h2>{politica?.titulo || 'Política de Privacidad'}</h2>
            <div className="modal-body">
              {politica?.contenido ? (
                politica.contenido.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))
              ) : (
                <p>No se pudo cargar el contenido. Por favor, intente más tarde.</p>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-close" onClick={onClose}>Cerrar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
