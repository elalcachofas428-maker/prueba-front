import apiClient from '../api/apiClient';

// Utilidad interna para limpiar payloads
const cleanPayload = (data, keysToInclude = null) => {
  const result = {};
  const entries = keysToInclude
    ? keysToInclude.map(k => [k, data[k]])
    : Object.entries(data);

  for (const [key, value] of entries) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (key === 'escenas') continue;

    if (typeof value === 'object' && !Array.isArray(value)) {
      const cleaned = cleanPayload(value);
      if (Object.keys(cleaned).length > 0) result[key] = cleaned;
    } else {
      result[key] = value;
    }
  }
  return result;
};

/**
 * Servicio de Inteligencia Artificial - Producción
 * Configurado con timeouts extendidos para procesos pesados.
 */
const AiService = {
  generarGuion: async (formData) => {
    const keys = ['tipoPropiedad', 'operacion', 'pais', 'idioma', 'ciudad', 'direccion',
                  'moneda', 'precio', 'recamaras', 'banos', 'superficieConstruida',
                  'superficieTerreno', 'estacionamientos', 'pisosNiveles', 'amenidades',
                  'otrasAmenidades', 'notasAdicionales', 'tipoVideo', 'voiceover',
                  'voz', 'tono', 'contextoAdicional'];

    const cleaned = cleanPayload(formData, keys);
    const esTour = cleaned.tipoVideo === 'tour' || cleaned.tipoVideo === 'tour_narrado';
    
    // Timeout extendido de 2 minutos para generación de guion
    return apiClient.post('/generar-guion/', {
      ...cleaned,
      prompt: `Generar guion para: ${JSON.stringify(cleaned)}`
    }, { timeout: 120000 });
  },

  generarListado: async (formData) => {
    const cleaned = cleanPayload(formData);
    // Timeout extendido de 2 minutos
    return apiClient.post('/generar-listado/', { 
      ...cleaned 
    }, { timeout: 120000 });
  },

  generarImagenPost: async (payload) => {
    // Timeout extendido para generación de imágenes
    return apiClient.post('/generar-imagen-post/', payload, { timeout: 60000 });
  },

  generarCarrusel: async (formData) => {
    return apiClient.post('/generar-carrusel/', formData, { timeout: 180000 });
  }
};

export default AiService;
