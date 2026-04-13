import React, { useState } from 'react';
import { registerApi } from '../services/api';
import { UserPlus } from 'lucide-react';

const RegisterScreen = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    agencia: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerApi(
        formData.email, 
        formData.password, 
        formData.nombre, 
        formData.telefono, 
        formData.agencia
      );
      // Exitosa -> Volver al login
      onBackToLogin();
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-main)',
      backgroundImage: 'radial-gradient(circle at top right, rgba(0, 229, 255, 0.1), transparent 40%)'
    }} className="animate-fade-in">
      
      <div style={{
        maxWidth: '450px',
        width: '90%',
        backgroundColor: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '2.5rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        
        <img 
            src="/logo.png" 
            alt="SUBZERO-02" 
            style={{ height: '40px', marginBottom: '1.5rem' }} 
            onError={(e) => e.target.style.display = 'none'}
        />

        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Crear Cuenta</h2>

        <form onSubmit={handleRegister} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="field-group">
            <label className="field-label">Nombre completo</label>
            <input type="text" name="nombre" className="input-base" value={formData.nombre} onChange={handleChange} required />
          </div>

          <div className="field-group">
            <label className="field-label">Email</label>
            <input type="email" name="email" className="input-base" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="field-group">
            <label className="field-label">Contraseña</label>
            <input type="password" name="password" className="input-base" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="field-group">
            <label className="field-label">Teléfono (opcional)</label>
            <input type="text" name="telefono" className="input-base" value={formData.telefono} onChange={handleChange} />
          </div>

          <div className="field-group">
            <label className="field-label">Agencia (opcional)</label>
            <input type="text" name="agencia" className="input-base" value={formData.agencia} onChange={handleChange} />
          </div>

          {error && <div style={{ color: 'var(--error)', fontSize: '0.8rem', textAlign: 'center' }}>{error}</div>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }} disabled={loading}>
            <UserPlus size={18} /> {loading ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>

        <button 
          onClick={(e) => { e.preventDefault(); onBackToLogin(); }} 
          style={{
            marginTop: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          ¿Ya tenés cuenta? Iniciá sesión
        </button>

      </div>
    </div>
  );
};

export default RegisterScreen;
