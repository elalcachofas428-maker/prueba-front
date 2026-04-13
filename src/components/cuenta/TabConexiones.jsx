import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../services/api';

function getToken() {
  return localStorage.getItem('subzero_access');
}

const REDES = [
  { id: 'instagram', nombre: 'Instagram', color: '#E1306C', emoji: '📸' },
  { id: 'facebook', nombre: 'Facebook', color: '#1877F2', emoji: '👥' },
  { id: 'linkedin', nombre: 'LinkedIn', color: '#0A66C2', emoji: '💼' },
  { id: 'youtube', nombre: 'YouTube', color: '#FF0000', emoji: '▶️' },
  { id: 'twitter', nombre: 'X (Twitter)', color: '#000000', emoji: '𝕏' },
  { id: 'pinterest', nombre: 'Pinterest', color: '#E60023', emoji: '📌' },
  { id: 'threads', nombre: 'Threads', color: '#000000', emoji: '🧵' },
  { id: 'tiktok', nombre: 'TikTok', color: '#010101', emoji: '🎵', bloqueado: true },
];

export default function TabConexiones() {
  const [estado, setEstado] = useState({ conectado: false, redes: [] });
  const [loading, setLoading] = useState(true);
  const [conectando, setConectando] = useState(false);
  const [recargando, setRecargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarEstado();
  }, []);

  const cargarEstado = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE_URL}/conexiones/estado/`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await resp.json();
      setEstado(data);
    } catch (e) {
      console.error('Error cargando estado:', e);
    } finally {
      setLoading(false);
      setRecargando(false);
    }
  };

  const handleRecargar = async () => {
    setRecargando(true);
    await cargarEstado(false);
  };

  const conectarRedes = async () => {
    setConectando(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE_URL}/conexiones/init/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await resp.json();
      if (data.access_url) {
        window.open(data.access_url, '_blank');
        // Recargar estado a los 5s (tiempo para que el usuario autorice)
        setTimeout(() => cargarEstado(false), 5000);
      } else {
        setError(data.error || 'No se pudo generar el enlace de conexión. Intentá de nuevo.');
      }
    } catch (e) {
      setError('Error de conexión con el servidor.');
    } finally {
      setConectando(false);
    }
  };

  const redesConectadas = estado.redes || [];

  return (
    <div style={{ padding: '1.5rem', maxWidth: '700px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h2 style={{ color: '#fff', margin: 0 }}>
          Conexiones de Redes Sociales
        </h2>
        <button
          onClick={handleRecargar}
          disabled={recargando || loading}
          style={{ background: 'transparent', border: '1px solid #374151', color: '#9ca3af', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}
        >
          {recargando ? '...' : '↻ Actualizar'}
        </button>
      </div>
      <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
        Conectá tus cuentas para publicar automáticamente con LeadBook.
      </p>

      {error && (
        <div style={{ background: '#ff4d4d18', border: '1px solid #ff4d4d', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem', color: '#ff4d4d', fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Botón principal */}
      <button
        onClick={conectarRedes}
        disabled={conectando}
        style={{
          background: conectando ? '#374151' : 'linear-gradient(135deg, #00d4ff, #7c3aed)',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          padding: '0.9rem 2rem',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: conectando ? 'not-allowed' : 'pointer',
          marginBottom: '1.5rem',
          width: '100%'
        }}
      >
        {conectando ? '⏳ Generando enlace seguro...' : '🔗 Conectar mis redes sociales'}
      </button>

      {/* Grid de redes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '1rem'
      }}>
        {REDES.map(red => {
          const conectada = redesConectadas.some(
            r => r.platform?.toLowerCase() === red.id
          );
          return (
            <div key={red.id} style={{
              background: '#1f2937',
              borderRadius: '12px',
              padding: '1.2rem',
              textAlign: 'center',
              border: conectada 
                ? `2px solid ${red.color}` 
                : '2px solid #374151',
              opacity: red.bloqueado ? 0.5 : 1,
              position: 'relative'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {red.emoji}
              </div>
              <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.85rem' }}>
                {red.nombre}
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                {red.bloqueado ? (
                  <span style={{ color: '#6b7280', fontSize: '0.7rem' }}>
                    🔒 Plan pago
                  </span>
                ) : conectada ? (
                  <span style={{ color: '#22c55e', fontSize: '0.75rem' }}>
                    ✓ Conectada
                  </span>
                ) : (
                  <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                    Sin conectar
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div style={{
        marginTop: '2rem',
        background: '#1f2937',
        borderRadius: '12px',
        padding: '1rem',
        color: '#9ca3af',
        fontSize: '0.85rem',
        lineHeight: 1.6
      }}>
        💡 <strong style={{ color: '#fff' }}>¿Cómo funciona?</strong><br/>
        1. Hacé click en "Conectar mis redes sociales"<br/>
        2. Se abre una ventana segura de UploadPost donde autorizás cada red<br/>
        3. Volvé acá y hacé click en "↻ Actualizar" para ver tus cuentas conectadas<br/>
        4. Podés desconectar en cualquier momento desde la misma ventana
      </div>

      {loading && (
        <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: '1rem' }}>
          Cargando estado de conexiones...
        </p>
      )}
    </div>
  );
}
