import React, { useState } from 'react';
import { useFormContext } from '../context/FormContext';
import { FileText, SquarePlay, Mail, ArrowDownToLine, Check, FileVideo, LayoutPanelTop } from 'lucide-react';
// Reemplazamos los íconos de Instagram y Youtube nativos de lucide-react por react-icons
// porque a partir de v1.x, Lucide eliminó todos los logotipos de marcas de terceros por motivos de licencias.
import { FaInstagram as Instagram, FaYoutube as Youtube } from 'react-icons/fa';
import { publicarInstagram, descargarPDF, guardarListado, generarImagenPost, generarImagenStory, generarEmail } from '../services/api';

const TABS = [
  { id: 'pdf', label: 'PDF', icon: <FileText size={16} /> },
  { id: 'post', label: 'POST', icon: <Instagram size={16} /> },
  { id: 'story', label: 'STORY', icon: <SquarePlay size={16} /> },
  { id: 'carrusel', label: 'CARRUSEL', icon: <LayoutPanelTop size={16} /> },
  { id: 'email', label: 'EMAIL', icon: <Mail size={16} /> },
  { id: 'video', label: 'VIDEO', icon: <FileVideo size={16} /> }
];

const Results = () => {
  const { formData, resetForm } = useFormContext();
  const [activeTab, setActiveTab] = useState('pdf');
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [descargando, setDescargando] = useState(false);

  React.useEffect(() => {
    guardarListado(formData).catch(e => console.error('Error guardando listado:', e));
  }, []);

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishError(null);
    try {
      await publicarInstagram({ 
        prompt: `Publicar a IG: ${formData.tipoPropiedad} en ${formData.ciudad}` 
      });
      setPublished(true);
    } catch (error) {
      console.error(error);
      setPublishError("Error de publicación. Revisa la conexión con el servidor.");
    } finally {
      setIsPublishing(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pdf':
        return (
          <div className="animate-fade-in" style={{ padding: '2rem', backgroundColor: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Documento Profesional</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Ficha inmobiliaria lista para imprimir y compartir</p>
            
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
               
               {/* PREVIEW MOCK PDF */}
               <div style={{ 
                 width: '180px', height: '240px', backgroundColor: '#fff', borderRadius: '8px', 
                 boxShadow: '0 10px 30px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden'
                }}>
                  {formData.portadaUrl && <img src={formData.portadaUrl} style={{ width: '100%', height: '50%', objectFit: 'cover' }} alt="PDF Portada" />}
                  <div style={{ padding: '10px', color: '#333' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--accent)' }}>SUBZERO-02</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-serif)', marginTop: '5px' }}>{formData.tipoPropiedad} en {formData.operacion}</div>
                    <div style={{ fontSize: '0.7rem', marginTop: '5px' }}>{formData.moneda} {formData.precio}</div>
                  </div>
               </div>

               <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(0,229,255,0.1)', color: 'var(--accent)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={24} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.25rem' }}>Ficha PDF Profesional</div>
                      <div style={{ color: 'var(--text-light)' }}>14 MB · Generado hace instantes</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                       className="btn btn-primary" 
                       style={{ display: 'flex', gap: '0.5rem' }}
                       disabled={descargando}
                       onClick={async () => {
                         setDescargando(true);
                         try {
                           await descargarPDF(formData);
                         } catch (e) {
                           console.error(e);
                         } finally {
                           setDescargando(false);
                         }
                       }}
                    >
                      <ArrowDownToLine size={20} /> {descargando ? 'Descargando...' : 'Descargar PDF'}
                    </button>
                    <button className="btn btn-secondary" onClick={resetForm}>
                      + Generar Otro Listado
                    </button>
                  </div>
               </div>
            </div>
          </div>
        );

      case 'post':
        return <PostTab formData={formData} handlePublish={handlePublish} isPublishing={isPublishing} published={published} publishError={publishError} />;

      case 'story':
        return <StoryTab formData={formData} />;

      case 'email':
        return <EmailTab formData={formData} />;

      case 'video':
        return (
          <div className="animate-fade-in" style={{ padding: '4rem 2rem', backgroundColor: 'var(--bg-panel)', borderRadius: '12px', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--text-light)' }}>
            <div style={{ 
              width: '64px', height: '64px', margin: '0 auto 1.5rem', 
              borderRadius: '50%', backgroundColor: 'rgba(0,229,255,0.05)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' 
            }}>
              {TABS.find(t => t.id === activeTab)?.icon}
            </div>
            {activeTab === 'video' ? (
              <>
                <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>Generando video en segundo plano...</h3>
                <p>El procesamiento de {formData.tipoVideo} demora un poco más. Te avisaremos cuando esté listo.</p>
                <div style={{width:'40px', height:'40px', margin:'2rem auto', borderRadius:'50%', border:'3px solid var(--border)', borderTopColor:'var(--accent)', animation: 'spin 1s linear infinite'}}></div>
              </>
            ) : (
              <>
                <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>Previsualización de {activeTab.toUpperCase()}</h3>
                <p>Mockup visual generado exitosamente para {formData.tipoPropiedad} en {formData.ciudad}.</p>
                <button className="btn btn-primary" style={{ marginTop: '2rem' }}>
                  Descargar {activeTab.toUpperCase()}
                </button>
              </>
            )}
          </div>
        );
      
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in">
      
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', backgroundColor: 'rgba(0, 229, 255, 0.1)', color: 'var(--accent)', borderRadius: '50%', marginBottom: '1rem' }}>
          <CheckCircle2 size={32} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
          Tu Listado Está Listo
        </h2>
        <p style={{ color: 'var(--text-light)', fontSize: '1.25rem' }}>
          {formData.tipoPropiedad || 'Propiedad'} en {formData.operacion || 'Operación'} — {formData.ciudad || 'Ciudad'}, {formData.pais || 'País'}
        </p>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeTab === tab.id ? 'var(--accent)' : 'transparent',
              color: activeTab === tab.id ? '#000' : 'var(--text-light)',
              border: `1px solid ${activeTab === tab.id ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ minHeight: '400px' }}>
        {renderTabContent()}
      </div>

    </div>
  );
};

// Pequeño hack para importar CheckCircle2 aquí
const CheckCircle2 = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

const PostTab = ({ formData, handlePublish, isPublishing, published, publishError }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    let mounted = true;
    generarImagenPost(formData)
      .then(url => { if (mounted) { setImgUrl(url); setLoading(false); } })
      .catch(e => { console.error(e); if (mounted) setLoading(false); });
    return () => mounted = false;
  }, [formData]);

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', backgroundColor: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
       <div style={{ width: '300px', height: '300px', backgroundColor: '#111', borderRadius: '12px', position: 'relative', overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         {loading ? (
             <div style={{width:'40px', height:'40px', borderRadius:'50%', border:'3px solid var(--border)', borderTopColor:'var(--accent)', animation: 'spin 1s linear infinite'}}></div>
         ) : imgUrl ? (
             <img src={imgUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Post Generado" />
         ) : (
             <div style={{ color: 'var(--error)' }}>Error al generar</div>
         )}
       </div>

       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="field-label">CAPTION DE INSTAGRAM SUGERIDO</label>
            <textarea 
              className="input-base" 
              defaultValue={`✨ Espectacular ${formData.tipoPropiedad} en ${formData.operacion}.\n\n📍 ${formData.ciudad}\n💰 ${formData.moneda} ${formData.precio}\n\nConoce esta increíble propiedad con ${formData.recamaras || 0} recámaras y ${formData.banos || 0} baños. ¡Ideal para ti!\n\n#Subzero02 #RealEstate #Inmuebles #${(formData.ciudad||"").replace(/\\s+/g, '')} #${(formData.operacion||"").replace(/\\s+/g, '')}`}
              style={{ minHeight: '180px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {imgUrl && (
              <a href={imgUrl} download="post.png" className="btn btn-secondary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', textDecoration: 'none' }}>
                <ArrowDownToLine size={20} /> Descargar Imagen
              </a>
            )}
            <button 
              className="btn btn-primary" 
              onClick={handlePublish}
              disabled={isPublishing || published}
              style={{ display: 'flex', gap: '0.5rem' }}
            >
              {published ? <Check size={20} /> : <Instagram size={20} />} 
              {isPublishing ? 'Publicando...' : published ? 'Publicado' : 'Publicar en Instagram'}
            </button>
          </div>
          {publishError && (
            <div className="animate-fade-in" style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.5rem', alignSelf: 'flex-start', padding: '0.5rem', backgroundColor: 'rgba(255,50,50,0.1)', borderRadius: '6px' }}>
              ⚠️ {publishError}
            </div>
          )}
       </div>
    </div>
  );
};

const StoryTab = ({ formData }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    let mounted = true;
    generarImagenStory(formData)
      .then(url => { if (mounted) { setImgUrl(url); setLoading(false); } })
      .catch(e => { console.error(e); if (mounted) setLoading(false); });
    return () => mounted = false;
  }, [formData]);

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', backgroundColor: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
       <div style={{ width: '280px', height: '498px', backgroundColor: '#111', borderRadius: '12px', position: 'relative', overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         {loading ? (
             <div style={{width:'40px', height:'40px', borderRadius:'50%', border:'3px solid var(--border)', borderTopColor:'var(--accent)', animation: 'spin 1s linear infinite'}}></div>
         ) : imgUrl ? (
             <img src={imgUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Story Generado" />
         ) : (
             <div style={{ color: 'var(--error)' }}>Error al generar</div>
         )}
       </div>

       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Instagram Story</h3>
          <p style={{ color: 'var(--text-light)' }}>Imagen optimizada para Stories (1080x1920) lista para publicar.</p>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {imgUrl && (
              <a href={imgUrl} download="story.png" className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', textDecoration: 'none' }}>
                <ArrowDownToLine size={20} /> Descargar Story
              </a>
            )}
          </div>
       </div>
    </div>
  );
};

const EmailTab = ({ formData }) => {
  const [htmlContent, setHtmlContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    let mounted = true;
    generarEmail(formData)
      .then(res => { if (mounted) { setHtmlContent(res.html); setLoading(false); } })
      .catch(e => { console.error(e); if (mounted) setLoading(false); });
    return () => mounted = false;
  }, [formData]);

  const handleCopy = () => {
    if (htmlContent) {
      navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (htmlContent) {
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'email.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', backgroundColor: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
       <div style={{ flex: 1, minWidth: '300px', height: '600px', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         {loading ? (
             <div style={{width:'40px', height:'40px', borderRadius:'50%', border:'3px solid var(--border)', borderTopColor:'var(--accent)', animation: 'spin 1s linear infinite'}}></div>
         ) : htmlContent ? (
             <iframe srcDoc={htmlContent} style={{ width: '100%', height: '100%', border: 'none' }} title="Email Preview" />
         ) : (
             <div style={{ color: 'var(--error)' }}>Error al generar</div>
         )}
       </div>

       <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Campaña de Email</h3>
          <p style={{ color: 'var(--text-light)' }}>Newsletter HTML listo para enviar a tus prospectos. Formato responsivo compatible con Mailchimp y ActiveCampaign.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={handleDownload} disabled={!htmlContent} className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowDownToLine size={20} /> Descargar HTML
            </button>
            <button onClick={handleCopy} disabled={!htmlContent} className="btn btn-secondary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}>
              {copied ? <Check size={20} /> : <FileText size={20} />}
              {copied ? '¡Copiado!' : 'Copiar Código HTML'}
            </button>
          </div>
       </div>
    </div>
  );
};

export default Results;
