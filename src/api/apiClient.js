import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Cliente centralizado de Axios configurado para producción.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos de timeout por defecto
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Interceptores de Request ──────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('subzero_access');
    // No adjuntar token si es una petición pública o al endpoint de refresh
    if (token && !config.url.includes('/auth/login/') && !config.url.includes('/auth/register/')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Lógica de Refresco Automático de Tokens (JWT) ─────────────────────────────
let isRefreshing = false;
let failedQueue = [];

// Procesa la cola de peticiones fallidas una vez que el token se refresca
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ─── Interceptores de Response ─────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa pero es del checkout de MP, validamos datos
    if (response.config.url.includes('/mp/checkout/')) {
      if (!response.data.init_point) {
        console.error('Error: init_point no encontrado en la respuesta de MP');
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Manejo de errores de conexión / Timeout
    if (!error.response) {
      return Promise.reject({
        message: 'No se pudo conectar con el servidor. Revisá tu conexión.',
        networkError: true
      });
    }

    // Si el error es 401 (No autorizado) y no es el endpoint de refresh ni login
    const isAuthError = error.response.status === 401;
    const isRefreshPath = originalRequest.url.includes('/auth/token/refresh/');
    const isLoginPath = originalRequest.url.includes('/auth/login/');

    if (isAuthError && !isRefreshPath && !isLoginPath && !originalRequest._retry) {
      
      if (isRefreshing) {
        // Encolar peticiones concurrentes mientras se está refrescando
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('subzero_refresh');

      // Si no hay refresh token, no podemos hacer nada, logout.
      if (!refreshToken) {
        handleGlobalLogout();
        return Promise.reject(error);
      }

      try {
        // Ejecutamos el refresh usando axios puro para evitar el interceptor circular
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem('subzero_access', newAccessToken);
        
        // Actualizar header por defecto para futuras peticiones
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        
        // Procesar cola de fallos
        processQueue(null, newAccessToken);
        
        // Reintentar la petición original
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleGlobalLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Manejo de otros errores comunes
    if (error.response.status === 500) {
      return Promise.reject({ message: 'Error interno del servidor (500).', status: 500 });
    }

    return Promise.reject(error);
  }
);

/**
 * Función centralizada para limpiar la sesión y redirigir.
 */
function handleGlobalLogout() {
  localStorage.removeItem('subzero_access');
  localStorage.removeItem('subzero_refresh');
  localStorage.removeItem('subzero_user');
  window.dispatchEvent(new CustomEvent('auth:logout'));
  // Redirección forzada si no estamos ya en el login
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login?session=expired';
  }
}

export default apiClient;
