import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Camera, Plus, Trash2 } from 'lucide-react';

const AccountModal = ({ isOpen, onClose }) => {
  const { user, login, logout, updateProfile } = useAuth();
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Editing State
  const [newAgentName, setNewAgentName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (user?.agencyName) setAgencyName(user.agencyName);
  }, [user?.agencyName]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      login(email, password);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await updateProfile({ agencyLogo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await updateProfile({ agencyName });
    setIsSaving(false);
  };

  const handleAddAgent = () => {
    if (newAgentName.trim() === '') return;
    const currentAgents = user.agents || [];
    updateProfile({ agents: [...currentAgents, newAgentName.trim()] });
    setNewAgentName('');
  };

  const handleRemoveAgent = (index) => {
    const currentAgents = user.agents || [];
    const updated = [...currentAgents];
    updated.splice(index, 1);
    updateProfile({ agents: updated });
  };

  if (!user) {
    return (
      <BaseModal title="Iniciar Sesión" isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="field-group">
            <label className="field-label">Email</label>
            <input 
              type="email" 
              className="input-base" 
              placeholder="agente@inmobiliaria.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="field-group">
            <label className="field-label">Contraseña</label>
            <input 
              type="password" 
              className="input-base" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Ingresar a la Plataforma
          </button>
        </form>
      </BaseModal>
    );
  }

  return (
    <BaseModal title="Cuenta de Agencia" isOpen={isOpen} onClose={onClose}>
      
      {/* AGENCY PROFILE */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* LOGO */}
        <label style={{ cursor: 'pointer', display: 'block' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '12px', border: '1px dashed var(--accent)',
            backgroundColor: 'var(--bg-panel)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', position: 'relative'
          }}>
            {user.agencyLogo ? (
              <img src={user.agencyLogo} alt="Agency" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Camera size={24} color="var(--accent)" />
            )}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textAlign: 'center', marginTop: '6px' }}>Cambiar Logo</div>
        </label>

        {/* DETAILS */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="field-group">
            <label className="field-label">Nombre de la Inmobiliaria</label>
            <input 
              type="text" 
              className="input-base" 
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
            />
          </div>
          <button 
             className="btn btn-primary" 
             onClick={handleSaveProfile} 
             disabled={isSaving}
             style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem' }}
          >
             {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      <hr style={{ borderColor: 'var(--border)', margin: '1.5rem 0' }} />

      {/* AGENTS LIST */}
      <div>
        <label className="field-label" style={{ marginBottom: '1rem' }}>Agentes Asociados</label>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          {(user.agents || []).map((agent, index) => (
             <div key={index} style={{ 
               display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
               backgroundColor: 'var(--bg-panel)', padding: '0.75rem 1rem', borderRadius: '8px' 
             }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                 <User size={16} color="var(--accent)" /> {agent}
               </div>
               <button 
                 onClick={() => handleRemoveAgent(index)}
                 style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                 title="Eliminar agente"
               >
                 <Trash2 size={16} />
               </button>
             </div>
          ))}

          {/* ADD AGENT */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
            <input 
              type="text" 
              className="input-base" 
              placeholder="Nombre de nuevo agente..." 
              value={newAgentName}
              onChange={(e) => setNewAgentName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddAgent()}
            />
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0 1rem', borderRadius: '8px' }}
              onClick={handleAddAgent}
            >
               <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
         <button 
           onClick={logout}
           className="btn btn-secondary" 
           style={{ padding: '0.75rem 1.5rem', borderColor: 'var(--error)', color: 'var(--error)' }}
         >
           <LogOut size={16} style={{ marginRight: '8px' }} /> Cerrar Sesión
         </button>
      </div>
      
    </BaseModal>
  );
};

export default AccountModal;
