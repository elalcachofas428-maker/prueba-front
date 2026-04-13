import { useState, useCallback } from 'react';

/**
 * Hook genérico para manejar llamadas a la API con estados de carga y error.
 * @param {Function} apiFunc - Función del servicio que realiza la llamada (ej: AuthService.login)
 */
export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunc(...args);
      setData(response);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Ocurrió un error inesperado';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return {
    data,
    error,
    loading,
    execute,
    setData
  };
};
