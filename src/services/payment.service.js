import apiClient from '../api/apiClient';

/**
 * Servicio de Pagos (Mercado Pago) - Producción
 */
const PaymentService = {
  /**
   * Crea una preferencia de pago en el backend y redirige al checkout de Mercado Pago.
   * @param {string} plan - El ID del plan (starter, pro, etc)
   */
  crearPreferenciaMP: async (plan) => {
    try {
      const response = await apiClient.post('/mp/checkout/', { plan });
      
      // La respuesta de Mercado Pago contiene 'init_point' (o sandbox_init_point)
      if (response.data && response.data.init_point) {
        // Redirección inmediata al checkout seguro de Mercado Pago
        window.location.href = response.data.init_point;
        return response.data;
      } else {
        throw new Error('No se pudo obtener el punto de inicio de pago de Mercado Pago.');
      }
    } catch (error) {
      console.error('Error en PaymentService:', error);
      throw error;
    }
  },

  /**
   * Obtiene el estado actual de la suscripción del usuario.
   */
  getPlanStatus: async () => {
    const response = await apiClient.get('/auth/plan-status/');
    return response.data;
  }
};

export default PaymentService;
