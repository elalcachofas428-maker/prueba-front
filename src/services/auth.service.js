import apiClient from '../api/apiClient';

/**
 * Servicio de Autenticación - Producción
 */
const AuthService = {
    /**
     * Inicia sesión y persiste tokens.
     */
    login: async (email, password) => {
        try {
            const response = await apiClient.post('/auth/login/', { email, password });
            const { access, refresh, user } = response.data;

            if (access) {
                localStorage.setItem('subzero_access', access);
                localStorage.setItem('subzero_refresh', refresh);
                localStorage.setItem('subzero_user', JSON.stringify(user || {}));
            }
            return response.data;
        } catch (error) {
            // Re-lanzamos el error procesado por el interceptor
            throw error;
        }
    },

    /**
     * Registro de nuevo usuario.
     */
    register: async (userData) => {
        const response = await apiClient.post('/auth/register/', userData);
        return response.data;
    },

    /**
     * Obtiene el perfil completo del usuario.
     */
    getPerfil: async () => {
        const response = await apiClient.get('/auth/perfil/');
        return response.data;
    },

    /**
     * Limpia la sesión localmente.
     */
    logout: () => {
        localStorage.removeItem('subzero_access');
        localStorage.removeItem('subzero_refresh');
        localStorage.removeItem('subzero_user');
        // Redirigir al login
        window.location.href = '/login';
    },

    /**
     * Recupera el objeto de usuario activo.
     */
    getUser: () => {
        try {
            return JSON.parse(localStorage.getItem('subzero_user') || '{}');
        } catch {
            return {};
        }
    },

    /**
     * Verifica si hay una sesión activa.
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('subzero_access');
    }
};

export default AuthService;
