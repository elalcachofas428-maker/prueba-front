import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const BaseModal = ({ title, isOpen, onClose, children }) => {
  
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
       document.body.style.overflow = 'hidden';
    } else {
       document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(5, 7, 10, 0.8)', backdropFilter: 'blur(5px)',
      zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', p: '2rem'
    }} className="animate-fade-in">
      
      <div style={{
        backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)',
        borderRadius: '16px', width: '100%', maxWidth: '500px', maxHeight: '90vh',
        overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column'
      }} className="animate-fade-in" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: '1.5rem', borderBottom: '1px solid var(--bg-panel)' 
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{ 
            background: 'transparent', border: 'none', color: 'var(--text-light)', 
            cursor: 'pointer', padding: '4px' 
          }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {children}
        </div>

      </div>
    </div>
  );
};

export default BaseModal;
