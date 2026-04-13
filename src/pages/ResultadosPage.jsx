import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FileText, Image, Film, LayoutTemplate, Mail, Play, DownloadCloud } from 'lucide-react';
import { API_BASE_URL, uploadBase64ToCloudinary } from '../services/api';
import { useFormContext } from '../context/FormContext';
import { useAuth } from '../context/AuthContext';

import TabPDF from '../components/results/TabPDF';
import TabPost from '../components/results/TabPost';
import TabStory from '../components/results/TabStory';
import TabCarrusel from '../components/results/TabCarrusel';
import TabEmail from '../components/results/TabEmail';
import TabVideo from '../components/results/TabVideo';

const TABS = [
  { id: 'pdf',      label: 'PDF',      icon: FileText,       accent: 'var(--accent)' },
  { id: 'post',     label: 'Post',     icon: Image,          accent: 'var(--accent)' },
  { id: 'story',    label: 'Story',    icon: Film,           accent: 'var(--accent)' },
  { id: 'carrusel', label: 'Carrusel', icon: LayoutTemplate, accent: 'var(--accent)' },
  { id: 'email',    label: 'Email',    icon: Mail,           accent: 'var(--accent)' },
  { id: 'video',    label: 'Video',    icon: Play,           accent: '#b47eff'       },
];

const TABS_INFO = [
  { id: 'pdf',      label: 'PDF',      icon: '📄' },
  { id: 'post',     label: 'Post',     icon: '📸' },
  { id: 'story',    label: 'Story',    icon: '🎬' },
  { id: 'carrusel', label: 'Carrusel', icon: '🖼️' },
  { id: 'email',    label: 'Email',    icon: '📧' },
];

export default function ResultadosPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Extraemos variables del state
  const { formData } = useFormContext();
  const resultados = location.state?.resultados || null;

  const [activeTab, setActiveTab] = useState('pdf');
  const [loading, setLoading] = useState({
    pdf: true, post: true, story: true, carrusel: true, email: true
  });
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [listadoId, setListadoId] = useState(null);

  useEffect(() => {
    if (!formData) {
      navigate('/dashboard');
      return;
    }
    // Lanzar fetches de todos los tabs excepto video (se inicia manualmente)
    TABS.filter(t => t.id !== 'video').forEach(tab => {
      fetchTab(tab.id);
    });
  }, [formData, navigate]);

  const fetchTab = async (tabId) => {
    setLoading(prev => ({ ...prev, [tabId]: true }));
    setErrors(prev => ({ ...prev, [tabId]: null }));

    // ── PDF: subir imágenes a Cloudinary primero ──────────────────────────────
    if (tabId === 'pdf') {
      try {
        async function tryUploadOrKeep(base64Str) {
          if (!base64Str) return null;
          // Si ya es URL pública, devolver tal cual
          if (typeof base64Str === 'string' && base64Str.startsWith('http')) return base64Str;
          try {
            return await uploadBase64ToCloudinary(base64Str);
          } catch (e) {
            console.warn('[PDF] Cloudinary falló, usando base64 directo:', e.message);
            // El backend puede manejar base64 directamente
            return base64Str;
          }
        }

        const portadaPublica = await tryUploadOrKeep(formData.portadaUrl);

        const fotosPublicas = await Promise.all(
          (formData.fotosRecorrido || []).map(f => tryUploadOrKeep(f))
        );

        const escenasConFotos = await Promise.all(
          (formData.escenas || []).map(async (escena) => ({
            ...escena,
            fotoUrl: escena.fotoUrl ? await tryUploadOrKeep(escena.fotoUrl) : null
          }))
        );

        const pdfPayload = {
          ...formData,
          portadaUrl:     portadaPublica,
          fotosRecorrido: fotosPublicas,
          escenas:        escenasConFotos,
          guion:          resultados?.guion || formData.guion || '',
          agenteNombre:   formData.agenteNombre   || user?.name  || '',
          agenteEmail:    formData.agenteEmail    || user?.email || '',
          agenciaNombre:  formData.agenciaNombre  || user?.agencyName || '',
          logoAgenciaUrl: user?.agencyLogo || null,
        };

        const response = await fetch(`${API_BASE_URL}/generar-pdf/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('subzero_access')}`
          },
          body: JSON.stringify(pdfPayload)
        });

        if (!response.ok) {
          let isLimit = false;
          if (response.status === 403) {
            try {
              const errData = await response.json();
              if (errData.error === 'limite_alcanzado') isLimit = true;
            } catch (e) {}
          }
          const err = new Error(isLimit ? 'Límite alcanzado' : `HTTP error! status: ${response.status}`);
          if (isLimit) err.isLimit = true;
          throw err;
        }

        const json = await response.json();
        if (json.listado_id && !listadoId) setListadoId(json.listado_id);
        setData(prev => ({ ...prev, pdf: json }));
      } catch (err) {
        console.error('Error fetching pdf:', err);
        setErrors(prev => ({ ...prev, pdf: err }));
      } finally {
        setLoading(prev => ({ ...prev, pdf: false }));
      }
      return; // no continuar al flujo genérico
    }

    // ── Resto de tabs ─────────────────────────────────────────────────────────
    try {
      let endpoint = '';
      if (tabId === 'post')     endpoint = '/generar-imagen-post/';
      if (tabId === 'story')    endpoint = '/generar-imagen-story/';
      if (tabId === 'carrusel') endpoint = '/generar-carrusel/';
      if (tabId === 'email')    endpoint = '/generar-email/';

      let payload = { ...formData, guion: resultados?.guion || formData.guion || '' };

      if (tabId === 'post' || tabId === 'story') {
        payload = {
          ...payload,
          portadaUrl:     formData.portadaUrl || null,
          fotosRecorrido: formData.fotosRecorrido || [],
          agenteNombre:   formData.agenteNombre || user?.name || user?.nombre || '',
          logoAgenciaUrl: user?.agencyLogo || user?.logo_url || null,
        };
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('subzero_access')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let isLimit = false;
        if (response.status === 403) {
          try {
            const errData = await response.json();
            if (errData.error === 'limite_alcanzado') isLimit = true;
          } catch (e) {}
        }
        const err = new Error(isLimit ? 'Límite alcanzado' : `HTTP error! status: ${response.status}`);
        if (isLimit) err.isLimit = true;
        throw err;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && (contentType.includes('application/pdf') || contentType.includes('image/'))) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setData(prev => ({ ...prev, [tabId]: { url, blob, contentType } }));
      } else {
        const json = await response.json();
        // Guardar listadoId si el backend lo devuelve
        if (json.listado_id && !listadoId) setListadoId(json.listado_id);
        if (json.url || json.html || json.texto || json.slides) {
            setData(prev => ({ ...prev, [tabId]: json }));
        } else if (json.imageUrl) {
            setData(prev => ({ ...prev, [tabId]: { ...json, url: json.imageUrl } }));
        } else {
            setData(prev => ({ ...prev, [tabId]: json }));
        }
      }
    } catch (err) {
      console.error(`Error fetching ${tabId}:`, err);
      setErrors(prev => ({ ...prev, [tabId]: err }));
    } finally {
      setLoading(prev => ({ ...prev, [tabId]: false }));
    }
  };

  const handleDownloadAll = () => {
    Object.values(data).forEach(item => {
      if (item?.url) {
        const a = document.createElement('a');
        a.href = item.url;
        a.download = 'descarga';
        a.target = '_blank';
        a.rel = 'noreferrer';
        a.click();
      }
    });
  };

  const formatsCount = 5;
  const completedCount = TABS.filter(t => t.id !== 'video').filter(t => data[t.id] && !loading[t.id]).length;
  const isAllReady = completedCount === formatsCount;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', position: 'relative' }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }  
        }
      `}</style>

      {Object.values(loading).some(Boolean) && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, gap: '32px'
        }}>
          {/* Logo + título */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '48px', marginBottom: '12px',
              display: 'inline-block',
              animation: 'spin 2s linear infinite',
            }}>⚡</div>
            <h2 style={{ 
              color: 'white', fontSize: '24px', 
              fontWeight: 'bold', margin: 0 
            }}>
              Generando tu contenido...
            </h2>
            <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '14px' }}>
              La IA está trabajando en todos los formatos
            </p>
          </div>

          {/* Tabs de progreso */}
          <div style={{ 
            display: 'flex', gap: '12px', flexWrap: 'wrap',
            justifyContent: 'center', maxWidth: '500px'
          }}>
            {TABS_INFO.map(tab => {
              const isLoading = loading[tab.id];
              const isDone = !isLoading && data[tab.id];
              const isError = errors[tab.id];
              return (
                <div key={tab.id} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 18px', borderRadius: '999px',
                  border: `1px solid ${isDone ? '#22c55e' : isError ? '#ef4444' : isLoading ? '#38bdf8' : '#334155'}`,
                  background: isDone ? 'rgba(34,197,94,0.1)' : isError ? 'rgba(239,68,68,0.1)' : isLoading ? 'rgba(56,189,248,0.1)' : 'rgba(51,65,85,0.3)',
                  color: isDone ? '#22c55e' : isError ? '#ef4444' : isLoading ? '#38bdf8' : '#64748b',
                  fontSize: '13px', fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}>
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {isLoading && <span style={{ 
                    width: '12px', height: '12px', 
                    border: '2px solid #38bdf8',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite'
                  }}/>}
                  {isDone && <span>✓</span>}
                  {isError && <span>✗</span>}
                </div>
              );
            })}
          </div>

          {/* Barra de progreso */}
          {(() => {
            const total = TABS_INFO.length;
            const done = TABS_INFO.filter(t => !loading[t.id] && (data[t.id] || errors[t.id])).length;
            const pct = Math.round((done / total) * 100);
            return (
              <div style={{ width: '320px' }}>
                <div style={{ 
                  display: 'flex', justifyContent: 'space-between',
                  color: '#94a3b8', fontSize: '12px', marginBottom: '8px'
                }}>
                  <span>{done} de {total} completados</span>
                  <span>{pct}%</span>
                </div>
                <div style={{ 
                  height: '6px', background: '#1e293b', 
                  borderRadius: '999px', overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%', borderRadius: '999px',
                    background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                    width: pct + '%',
                    transition: 'width 0.5s ease'
                  }}/>
                </div>
              </div>
            );
          })()}
        </div>
      )}
      
      {/* Header Sticky */}
      <div style={{ 
        position: 'sticky', top: 60, zIndex: 100, 
        background: 'rgba(7,11,20,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <button onClick={() => navigate('/dashboard')} className="btn btn-ghost" style={{ gap: 8, padding: '8px 12px' }}>
          <ArrowLeft size={18} /> <span style={{ display: 'none', '@media (min-width: 640px)': { display: 'inline' } }}>Dashboard</span>
        </button>

        <div className={`badge ${isAllReady ? 'badge-success' : 'badge-accent'}`}>
          {isAllReady ? (
            <><CheckCircle2 size={14} /> Todo listo — {completedCount}/{formatsCount} generados</>
          ) : (
            <><div className="btn-spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> Generando... {completedCount}/{formatsCount}</>
          )}
        </div>

        <button onClick={handleDownloadAll} className="btn btn-primary btn-sm" disabled={completedCount === 0}>
          <DownloadCloud size={16} /> <span style={{ display: 'none', '@media (min-width: 640px)': { display: 'inline' } }}>Descargar todo</span>
        </button>
      </div>

      {/* Tabs Menu */}
      <div style={{ 
        display: 'flex', overflowX: 'auto', gap: 8, padding: '16px 24px',
        borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)'
      }}>
        <div style={{ display: 'flex', gap: 8, margin: '0 auto', maxWidth: 860, width: '100%' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            const isLoading = loading[tab.id];
            const isDone = data[tab.id];
            const isErr = errors[tab.id];
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  borderBottom: `2px solid ${isActive ? tab.accent : 'transparent'}`,
                  color: isActive ? tab.accent : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all var(--transition-base)',
                  whiteSpace: 'nowrap'
                }}
              >
                <tab.icon size={18} />
                {tab.label}
                {tab.id !== 'video' && (
                   <span style={{ 
                    width: 8, height: 8, borderRadius: '50%',
                    background: isLoading ? 'var(--accent)' : isErr ? 'var(--error)' : isDone ? 'var(--success)' : 'transparent',
                    animation: isLoading ? 'pulse 1.5s infinite' : 'none'
                  }} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>
        {activeTab === 'pdf' && (
          <TabPDF data={data.pdf} loading={loading.pdf} error={errors.pdf} formData={formData} onRetry={() => fetchTab('pdf')} />
        )}
        {activeTab === 'post' && (
          <TabPost data={data.post} loading={loading.post} error={errors.post} formData={formData} onRetry={() => fetchTab('post')} />
        )}
        {activeTab === 'story' && (
          <TabStory data={data.story} loading={loading.story} error={errors.story} formData={formData} onRetry={() => fetchTab('story')} />
        )}
        {activeTab === 'carrusel' && (
          <TabCarrusel data={data.carrusel} loading={loading.carrusel} error={errors.carrusel} formData={formData} onRetry={() => fetchTab('carrusel')} />
        )}
        {activeTab === 'email' && (
          <TabEmail data={data.email} loading={loading.email} error={errors.email} formData={formData} onRetry={() => fetchTab('email')} />
        )}
        {activeTab === 'video' && (
          <TabVideo formData={formData} listadoId={listadoId} />
        )}
      </div>

    </div>
  );
}
