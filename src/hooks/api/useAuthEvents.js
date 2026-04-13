import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Hook para escuchar eventos globales de autenticación disparados por el interceptor de Axios.
 */
export const useAuthEvents = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = () => {
      console.warn('Sesión expirada o inválida detectada por el interceptor de API.');
      logout();
    };

    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [logout]);
};
