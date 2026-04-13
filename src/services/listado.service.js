import apiClient from '../api/apiClient';

const ListadoService = {
  getDashboard: async () => {
    const response = await apiClient.get('/dashboard/');
    return response.data;
  },

  getListados: async () => {
    const response = await apiClient.get('/listados/');
    return response.data;
  },

  getDetalle: async (id) => {
    const response = await apiClient.get(`/listados/${id}/`);
    return response.data;
  },

  guardar: async (formData) => {
    // Limpiamos el payload antes de enviar
    const payload = {
      formData: {
        ...formData,
        portadaUrl: null,
        fotosRecorrido: []
      }
    };
    const response = await apiClient.post('/listados/', payload);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await apiClient.delete(`/listados/${id}/`);
    return response.data;
  }
};

export default ListadoService;
