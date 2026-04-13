import React, { useState } from 'react';
import { Eye, EyeOff, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../services/api';

export default function TabSeguridad({ onSave, saving, saveError, saveSuccess }) {
  const { logout } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [localError, setLocalError] = useState('');

  // Lógica de fortaleza
  let strengthLevel = 0; // 0=muy débil, 1=débil, 2=media, 3=fuerte
  const len = newPassword.length;
  if (len > 0 && len < 6) strengthLevel = 0;
  else if (len >= 6 && len < 8) strengthLevel = 1;
  else if (len >= 8 && len < 12 && /\d/.test(newPassword)) strengthLevel = 2;
  else if (len >= 12 && /\d/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword)) strengthLevel = 3;
  else if (len >= 8) strengthLevel = 1; // if 8 but no number

  const STRENGTH_COLORS = ['var(--error)', '#F59E0B', '#F5A623', 'var(--success)'];
  const STRENGTH_LABELS = ['Muy débil', 'Débil', 'Aceptable', 'Fuerte'];

  const noCoincide = confirmPassword.length > 0 && confirmPassword !== newPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!currentPassword) {
      setLocalError('Debes ingresar la contraseña actual');
      return;
    }
    if (newPassword.length < 8) {
      setLocalError('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    const payload = { current_password: currentPassword, new_password: newPassword };
    const res = await onSave(payload, 'password'); // we'll implement this on parent
    if (res?.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleLogoutAll = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout-all/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token') || localStorage.getItem('subzero_access')}` }
      });
    } catch(e) {}
    logout();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in-up">
      <form className="card" onSubmit={handleSubmit}>
        <div className="text-label" style={{ marginBottom: 24 }}>CAMBIAR CONTRASEÑA</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-wrapper">
            <label className="input-label">Contraseña Actual <span className="required">*</span></label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showCurrent ? "text" : "password"} 
                className="input" 
                value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} 
              />
              <button type="button" style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }} onClick={() => setShowCurrent(!showCurrent)}>
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="input-wrapper">
            <label className="input-label">Nueva Contraseña <span className="required">*</span></label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showNew ? "text" : "password"} 
                className="input" 
                value={newPassword} onChange={e => setNewPassword(e.target.value)} 
              />
              <button type="button" style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }} onClick={() => setShowNew(!showNew)}>
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {newPassword.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, height: 4, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ flex: 1, background: strengthLevel >= 0 ? STRENGTH_COLORS[strengthLevel] : 'var(--border-subtle)' }} />
                  <div style={{ flex: 1, background: strengthLevel >= 1 ? STRENGTH_COLORS[strengthLevel] : 'var(--border-subtle)' }} />
                  <div style={{ flex: 1, background: strengthLevel >= 2 ? STRENGTH_COLORS[strengthLevel] : 'var(--border-subtle)' }} />
                  <div style={{ flex: 1, background: strengthLevel >= 3 ? STRENGTH_COLORS[strengthLevel] : 'var(--border-subtle)' }} />
                </div>
                <div style={{ fontSize: 11, color: STRENGTH_COLORS[strengthLevel], marginTop: 4 }}>
                  {STRENGTH_LABELS[strengthLevel]}
                </div>
              </div>
            )}
          </div>

          <div className="input-wrapper">
            <label className="input-label">Confirmar Nueva Contraseña <span className="required">*</span></label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirm ? "text" : "password"} 
                className={`input ${noCoincide ? 'error' : ''}`}
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} 
              />
              <button type="button" style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }} onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {noCoincide && <div className="input-error-msg">Las contraseñas no coinciden</div>}
          </div>

          {(localError || saveError) && (
            <div style={{ color: 'var(--error)', fontSize: 13, background: 'var(--error-dim)', padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)' }}>
              {localError || saveError}
            </div>
          )}

          {saveSuccess && (
            <div style={{ color: 'var(--success)', fontSize: 13, background: 'var(--success-dim)', padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(16,185,129,0.3)' }}>
              Contraseña actualizada correctamente
            </div>
          )}

          <div style={{ marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <div className="btn-spinner" /> : 'Actualizar contraseña'}
            </button>
          </div>
        </div>
      </form>

      <div className="card">
        <div className="text-label" style={{ marginBottom: 4 }}>SESIONES ACTIVAS</div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Cerrá sesión en todos los dispositivos si creés que tu cuenta fue comprometida.
        </p>
        <button 
          className="btn btn-secondary" 
          style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--error)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--error-dim)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          onClick={handleLogoutAll}
        >
          <LogOut size={16} /> Cerrar todas las sesiones
        </button>
      </div>
    </div>
  );
}
