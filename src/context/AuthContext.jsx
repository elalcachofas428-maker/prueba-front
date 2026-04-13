import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/auth.service';
import ListadoService from '../services/listado.service';
import PaymentService from '../services/payment.service';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario persistido al iniciar
  useEffect(() => {
    const savedUser = AuthService.getUser();
    if (Object.keys(savedUser).length > 0) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // 1. Autenticación básica
    const data = await AuthService.login(email, password);
    
    // 2. Enriquecer datos del usuario (Perfil + Plan)
    let userData = {
      email: data.user?.email || email,
      name: data.user?.nombre || email,
      is_staff: data.user?.is_staff || false,
    };

    try {
      const [perfil, planStatus] = await Promise.all([
        AuthService.getPerfil(),
        PaymentService.getPlanStatus()
      ]);

      userData = {
        ...userData,
        agencyName: perfil.nombre_inmobiliaria || '',
        agencyLogo: perfil.logo_url || null,
        plan_nombre: planStatus.plan_nombre || 'free',
        plan_seleccionado: planStatus.plan_seleccionado,
        plan_activo: planStatus.plan_activo,
      };

      // Si no tiene inmobiliaria, requiere onboarding
      if (!perfil.nombre_inmobiliaria) {
        localStorage.setItem('leadbook_needs_onboarding', 'true');
      }
    } catch (e) {
      console.warn('Error al enriquecer perfil post-login:', e);
    }

    localStorage.setItem('subzero_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const updateProfile = async (updates) => {
    // Implementar lógica de actualización proporcional si es necesario
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('subzero_user', JSON.stringify(updated));
      return updated;
    });
  };

  const refreshPlan = async () => {
    try {
      const info = await PaymentService.getPlanStatus();
      setUser(prev => {
        const updated = { ...prev, plan_nombre: info.plan_nombre };
        localStorage.setItem('subzero_user', JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error('No se pudo refrescar el plan', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, updateProfile, refreshPlan, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
