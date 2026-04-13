export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// ─── Utilidades ───────────────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('subzero_access');
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('subzero_user') || '{}');
  } catch {
    return {};
  }
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}

function cleanPayload(data, keysToInclude = null) {
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
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Tardó demasiado en responder la IA. Revisá tu conexión e intentá de nuevo.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Cloudinary ───────────────────────────────────────────────────────────────

export async function uploadBase64ToCloudinary(base64String) {
  if (!base64String || !base64String.startsWith('data:')) {
    return base64String || null;
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dpqgbgilw';
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'leadbook_preset';

  const fetchRes = await fetch(base64String);
  const blob = await fetchRes.blob();

  const fd = new FormData();
  fd.append('file', blob);
  fd.append('upload_preset', uploadPreset);
  fd.append('folder', 'leadbook/pdfs');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: fd }
  );

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson?.error?.message || `Cloudinary HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.secure_url;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function loginApi(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Credenciales incorrectas');
  return res.json();
}

export async function registerApi(email, password, nombre, telefono, agencia) {
  const res = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, nombre, telefono, agencia })
  });
  if (!res.ok) throw new Error('Error al registrarse');
  return res.json();
}

export async function recuperarPassword(email) {
  const res = await fetch(`${API_BASE_URL}/auth/recuperar-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error('Error al enviar el código de recuperación');
  return res.json();
}

export async function confirmarRecuperacion(email, codigo, nueva_password) {
  const res = await fetch(`${API_BASE_URL}/auth/confirmar-recuperacion/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, codigo, nueva_password })
  });
  if (!res.ok) throw new Error('Código inválido o error al cambiar contraseña');
  return res.json();
}

export async function getPerfil() {
  const res = await fetch(`${API_BASE_URL}/auth/perfil/`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error('Error al cargar perfil');
  return res.json();
}

export async function actualizarPerfil(data) {
  const res = await fetch(`${API_BASE_URL}/auth/perfil/`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({
      nombreInmobiliaria: data.nombre_inmobiliaria || data.nombreInmobiliaria,
      logoUrl: data.logo_url || data.logoUrl,
      agentesAsociados: data.agentes_asociados || data.agentesAsociados
    })
  });
  if (!res.ok) throw new Error('Error al actualizar perfil');
  return res.json();
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboard() {
  const res = await fetch(`${API_BASE_URL}/dashboard/`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error('Error al cargar dashboard');
  return res.json();
}

// ─── Listados ─────────────────────────────────────────────────────────────────

export async function guardarListado(formData) {
  const payload = {
    formData: {
      ...formData,
      portadaUrl: null,
      fotosRecorrido: []
    }
  };
  const res = await fetch(`${API_BASE_URL}/listados/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Error al guardar listado');
  return res.json();
}

export async function listarListados() {
  const res = await fetch(`${API_BASE_URL}/listados/`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error('Error listando listados');
  return res.json();
}

export async function eliminarListado(id) {
  const res = await fetch(`${API_BASE_URL}/listados/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error('Error al eliminar listado');
}

// ─── Generación de contenido ──────────────────────────────────────────────────

export async function generarGuion(formData) {
  const keys = ['tipoPropiedad', 'operacion', 'pais', 'idioma', 'ciudad', 'direccion',
                'moneda', 'precio', 'recamaras', 'banos', 'superficieConstruida',
                'superficieTerreno', 'estacionamientos', 'pisosNiveles', 'amenidades',
                'otrasAmenidades', 'notasAdicionales', 'tipoVideo', 'voiceover',
                'voz', 'tono', 'contextoAdicional'];

  const cleaned = cleanPayload(formData, keys);
  const promptData = JSON.stringify(cleaned);
  const esTour = cleaned.tipoVideo === 'tour' || cleaned.tipoVideo === 'tour_narrado';

  const promptFull = esTour
    ? `Eres un experto en marketing inmobiliario de lujo para Latinoamérica.
Generá un guión CINEMATOGRÁFICO y EMOTIVO para un VIDEO TOUR NARRADO.

Datos de la propiedad:
${promptData}

INSTRUCCIONES ESTRICTAS:
- Exactamente 6 escenas detalladas
- Cada escena DEBE tener entre 15 y 25 palabras COMPLETAS
- Tono ${cleaned.tono || 'profesional'}: evocador, sensorial, aspiracional
- SOLO JSON válido sin markdown

FORMATO: { "escenas": [ { "id": 1, "nombre": "Título evocador", "texto": "Texto detallado...", "icono": "🏠", "fotoUrl": null } ] }

Timestamp: ${new Date().toISOString()}`
    : `Eres un experto en marketing inmobiliario para Latinoamérica.
Generá un guión muy CORTO e IMPACTANTE para un REEL de Instagram.

Datos de la propiedad:
${promptData}

INSTRUCCIONES MUY ESTRICTAS:
- Exactamente 3 escenas
- Cada escena MÁXIMO 10 palabras
- SOLO JSON válido, sin markdown, sin texto extra

FORMATO EXACTO:
{ "escenas": [ { "id": 1, "nombre": "Título", "texto": "Frase corta.", "icono": "🏠", "fotoUrl": null } ] }

Timestamp: ${new Date().toISOString()}`;

  const res = await fetchWithTimeout(`${API_BASE_URL}/generar-guion/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      prompt: promptFull,
      tipoPropiedad: cleaned.tipoPropiedad || '',
      ciudad: cleaned.ciudad || '',
      precio: cleaned.precio || '',
      moneda: cleaned.moneda || 'USD',
      operacion: cleaned.operacion || 'Venta',
      recamaras: cleaned.recamaras || '',
      banos: cleaned.banos || '',
      tono: cleaned.tono || 'profesional',
      tipoVideo: cleaned.tipoVideo || 'tour'
    })
  });

  if (!res.ok) {
    if (res.status === 403) {
      const errData = await res.json().catch(() => ({}));
      if (errData.error === 'limite_alcanzado') throw new Error('LIMITE_ALCANZADO');
    }
    throw new Error(`Error ${res.status}`);
  }

  const data = await res.json();

  if (data.escenas && data.escenas.length > 0) return { escenas: data.escenas };
  if (data.generated_text) {
    try {
      const match = data.generated_text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('Bad API formatting');
      return JSON.parse(match[0]);
    } catch {
      throw new Error('Bad API formatting');
    }
  }
  throw new Error('Sin escenas en la respuesta');
}

export async function generarListado(formData) {
  const cleaned = cleanPayload(formData);
  const promptFull = `Eres un experto copywriter en bienes raíces premium para Latinoamérica.

Datos completos de la propiedad:
${JSON.stringify(cleaned)}

Guión generado:
${JSON.stringify(formData.escenas)}

Generá contenido de marketing PROFESIONAL Y DETALLADO para cada formato.
El tono debe ser ${formData.tono || 'profesional'}.`;

  const res = await fetchWithTimeout(`${API_BASE_URL}/generar-listado/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ prompt: promptFull })
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function descargarPDF(formData) {
  const usuario = getUser();
  const payload = {
    ...formData,
    agenciaNombre: usuario.agencyName || formData.agenciaNombre || 'LeadBook',
    logoAgenciaUrl: usuario.agencyLogo || null,
  };

  const res = await fetch(`${API_BASE_URL}/generar-pdf/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(`Error generando PDF: ${res.status}`);

  const data = await res.json();

  if (data.url) {
    const pdfUrl = data.url.startsWith('http')
      ? data.url
      : `${API_BASE_URL.replace('/api', '')}${data.url}`;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'ficha-leadbook.pdf';
    a.target = '_blank';
    a.click();
    return;
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ficha-leadbook.pdf';
  a.click();
  window.URL.revokeObjectURL(url);
}

export async function generarImagenPost(formData) {
  const usuario = getUser();
  const payload = {
    ...formData,
    agenciaNombre: usuario.agenciaNombre || 'LeadBook',
    logoAgenciaUrl: usuario.logo_url || null,
  };
  const res = await fetch(`${API_BASE_URL}/generar-imagen-post/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Error generando imagen');
  return res.json();
}

export async function generarImagenStory(formData) {
  const usuario = getUser();
  const payload = {
    ...formData,
    agenciaNombre: usuario.agenciaNombre || 'LeadBook',
    logoAgenciaUrl: usuario.logo_url || null,
  };
  const res = await fetch(`${API_BASE_URL}/generar-imagen-story/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Error generando story');
  return res.json();
}

export async function generarEmail(formData) {
  const usuario = getUser();
  const res = await fetch(`${API_BASE_URL}/generar-email/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      ...formData,
      agenciaNombre: usuario.agenciaNombre || 'LeadBook',
      logoAgenciaUrl: usuario.logo_url || null,
    })
  });
  if (!res.ok) throw new Error('Error generando email');
  return res.json();
}

export const generarCarrusel = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/generar-carrusel/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
};

// ─── MercadoPago ──────────────────────────────────────────────────────────────

export async function crearPreferenciaMP(plan) {
  const res = await fetch(`${API_BASE_URL}/mp/checkout/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ plan })
  });
  if (!res.ok) throw new Error('Error al iniciar el pago');
  return res.json();
}

export const crearCheckoutSession = crearPreferenciaMP;

export async function getPlanStatus() {
  const res = await fetch(`${API_BASE_URL}/auth/plan-status/`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error('Error obteniendo plan');
  return res.json();
}

export const getStripePlanInfo = getPlanStatus;

export async function refreshUserPlan() {
  const info = await getPlanStatus();
  const saved = getUser();
  const updated = { ...saved, plan_nombre: info.plan_nombre };
  localStorage.setItem('subzero_user', JSON.stringify(updated));
  return info;
}

// ─── Admin Dashboard Endpoints ────────────────────────────────────────────────

export async function getAdminMetricas() {
  const res = await fetch(`${API_BASE_URL}/admin/stats/`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Error al cargar métricas');
  return res.json();
}

export async function getAdminUsuarios(page = 1, search = '') {
  const params = new URLSearchParams({ page, search });
  const res = await fetch(`${API_BASE_URL}/admin/usuarios/?${params}`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Error al cargar usuarios');
  return res.json();
}

export async function cambiarPlanUsuario(id, plan) {
  const res = await fetch(`${API_BASE_URL}/admin/usuarios/${id}/`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ plan_nombre: plan })
  });
  if (!res.ok) throw new Error('Error al cambiar plan');
  return res.json();
}

export async function eliminarUsuario(id) {
  const res = await fetch(`${API_BASE_URL}/admin/usuarios/${id}/`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Error al eliminar usuario');
}

// ─── Instagram ────────────────────────────────────────────────────────────────

export async function publicarInstagram({ imagen_url, caption, tipo, imagenes_urls }) {
  const res = await fetch(`${API_BASE_URL}/publicar-instagram/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ imagen_url, caption, tipo, imagenes_urls })
  });
  if (!res.ok) throw new Error('Error publicando en Instagram');
  return res.json();
}

// ─── Términos y OTP (stubs) ──────────────────────────────────────────────────
export const obtenerTerminos = async () => {
  return {
    contenido: `TÉRMINOS Y CONDICIONES DE USO — LEADBOOK

Última actualización: Abril 2025

1. ACEPTACIÓN DE LOS TÉRMINOS
Al acceder o utilizar LeadBook, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo, no utilice el servicio.

2. DESCRIPCIÓN DEL SERVICIO
LeadBook es una plataforma SaaS que utiliza inteligencia artificial para generar contenido de marketing automatizado (PDFs, posts, videos, emails y más) para negocios y profesionales.

3. REGISTRO Y CUENTAS
El usuario es responsable de mantener la confidencialidad de sus credenciales. Debe proporcionar información veraz al registrarse. LeadBook puede suspender cuentas con información falsa.

4. USO PERMITIDO Y PROHIBIDO
Permitido: uso comercial legítimo, generación de contenido propio.
Prohibido: spam, contenido ilegal, ingeniería inversa, reventa sin autorización.

5. PROPIEDAD INTELECTUAL
El usuario retiene los derechos sobre el contenido que sube. LeadBook retiene los derechos sobre la plataforma, algoritmos y diseño. El contenido generado por IA puede ser usado libremente por el usuario dentro del plan contratado.

6. PAGOS Y SUSCRIPCIONES
Los planes se cobran mensual o anualmente según lo elegido. Los pagos son procesados de forma segura. No se realizan reembolsos por períodos ya utilizados.

7. CANCELACIÓN
El usuario puede cancelar su suscripción en cualquier momento desde su perfil. El acceso continúa hasta el fin del período pagado.

8. LIMITACIÓN DE RESPONSABILIDAD
LeadBook no garantiza resultados específicos. El servicio se provee "tal cual". No nos responsabilizamos por pérdidas derivadas del uso del contenido generado.

9. USO DE INTELIGENCIA ARTIFICIAL
El contenido generado por IA puede contener errores. El usuario es responsable de revisar y validar el contenido antes de publicarlo.

10. MODIFICACIONES
LeadBook puede modificar estos términos con previo aviso de 30 días. El uso continuado implica aceptación.

11. CONTACTO
Para consultas legales: legal@leadbook.app`
  };
};

export const obtenerPoliticaPrivacidad = async () => {
  return {
    contenido: `POLÍTICA DE PRIVACIDAD — LEADBOOK

Última actualización: Abril 2025

1. INFORMACIÓN QUE RECOPILAMOS
Recopilamos: nombre, email, datos de la empresa, imágenes subidas, contenido generado e información de uso de la plataforma.

2. USO DE LA INFORMACIÓN
Utilizamos sus datos para: proveer el servicio, mejorar la plataforma, enviar comunicaciones relevantes y cumplir obligaciones legales.

3. PROTECCIÓN DE DATOS
Implementamos medidas técnicas y organizativas para proteger su información. Los datos se almacenan en servidores seguros con cifrado.

4. COMPARTIR DATOS
No vendemos sus datos. Podemos compartirlos con proveedores de servicio necesarios para operar la plataforma (hosting, pagos, emails) bajo acuerdos de confidencialidad.

5. COOKIES
Usamos cookies para recordar su sesión y preferencias. Puede desactivarlas en su navegador, aunque esto puede afectar la funcionalidad.

6. RETENCIÓN DE DATOS
Conservamos sus datos mientras la cuenta esté activa. Al cancelar, los datos se eliminan en 90 días salvo obligación legal.

7. SUS DERECHOS
Tiene derecho a: acceder, corregir o eliminar sus datos personales. Para ejercerlos, contáctenos en privacidad@leadbook.app

8. CONTACTO
privacidad@leadbook.app`
  };
};

export async function sendOTP(email) {
  const res = await fetch(`${API_BASE_URL}/auth/send-otp/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error('Error enviando OTP');
  return res.json();
}

export async function verifyOTP(email, code) {
  const res = await fetch(`${API_BASE_URL}/auth/verify-otp/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code })
  });
  if (!res.ok) throw new Error('Código incorrecto o expirado');
  return res.json();
}

export async function seleccionarPlanFree() {
  const res = await fetch(`${API_BASE_URL}/auth/seleccionar-plan-free/`, {
    method: 'POST',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Error seleccionando plan');
  return res.json();
}
