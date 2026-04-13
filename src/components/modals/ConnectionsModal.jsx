import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { Share2, MessageCircle } from 'lucide-react';
import { FaInstagram as Instagram, FaYoutube as Youtube } from 'react-icons/fa';

const ConnectionsModal = ({ isOpen, onClose }) => {
  const [igConnected, setIgConnected] = useState(false);
  const [waConnected, setWaConnected] = useState(false);

  return (
    <BaseModal title="Conexiones y APIs" isOpen={isOpen} onClose={onClose}>
      
      <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Vincula tus redes para auto-publicar el contenido directamente tras ser generado.
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        
        {/* Instagram */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          backgroundColor: 'var(--bg-panel)', padding: '1rem 1.5rem', borderRadius: '12px',
          border: igConnected ? '1px solid var(--accent)' : '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <Instagram size={28} color={igConnected ? 'var(--accent)' : 'var(--text-white)'} />
             <div>
               <div style={{ fontWeight: 600 }}>Instagram Business</div>
               <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                 {igConnected ? 'Conectado a Inmobiliaria Top' : 'Token requerido'}
               </div>
             </div>
          </div>
          <button 
             className={igConnected ? "btn-secondary" : "btn-primary"} 
             style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}
             onClick={() => setIgConnected(!igConnected)}
          >
            {igConnected ? 'Desconectar' : 'Conectar'}
          </button>
        </div>

        {/* WhatsApp */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          backgroundColor: 'var(--bg-panel)', padding: '1rem 1.5rem', borderRadius: '12px',
          border: waConnected ? '1px solid var(--accent)' : '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <MessageCircle size={28} color={waConnected ? 'var(--accent)' : 'var(--text-white)'} />
             <div>
               <div style={{ fontWeight: 600 }}>WhatsApp Cloud API</div>
               <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                 Permite enviar resúmenes al cliente
               </div>
             </div>
          </div>
          <button 
             className={waConnected ? "btn-secondary" : "btn-primary"} 
             style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}
             onClick={() => setWaConnected(!waConnected)}
          >
             {waConnected ? 'Desconectar' : 'Conectar'}
          </button>
        </div>

        {/* YouTube */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          backgroundColor: '#0F1720', padding: '1rem 1.5rem', borderRadius: '12px',
          border: '1px solid var(--border)', opacity: 0.6
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <Youtube size={28} />
             <div>
               <div style={{ fontWeight: 600 }}>YouTube Shorts</div>
               <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Próximamente...</div>
             </div>
          </div>
        </div>

      </div>

    </BaseModal>
  );
};

export default ConnectionsModal;
