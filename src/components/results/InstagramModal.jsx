import React, { useState } from 'react';
import { Send, ExternalLink } from 'lucide-react';
import { InstagramIcon } from '../ui/InstagramIcon';
import Modal from '../ui/Modal';
import { publicarInstagram } from '../../services/api';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';

/**
 * InstagramModal
 * Props:
 *  isOpen       – bool
 *  onClose      – fn
 *  imageUrl     – string (url de la imagen/story)
 *  imagenesUrls – string[] (para carrusel)
 *  caption      – string (texto inicial editable)
 *  tipo         – 'post' | 'story' | 'carrusel'
 *  hasToken     – bool (¿el usuario tiene meta_access_token?)
 */
export default function InstagramModal({ isOpen, onClose, imageUrl, imagenesUrls, caption: initialCaption, tipo, hasToken }) {
  const [caption, setCaption] = useState(initialCaption || '');
  const [publishing, setPublishing] = useState(false);
  const { addToast } = useAppStore();
  const navigate = useNavigate();

  const handlePublish = async () => {
    if (!hasToken) {
      addToast({
        type: 'warning',
        title: 'Instagram no conectado',
        message: 'Conectá tu cuenta en Configuración → Conexiones antes de publicar.',
      });
      onClose();
      return;
    }

    setPublishing(true);
    try {
      const result = await publicarInstagram({
        imagen_url: imageUrl || null,
        imagenes_urls: imagenesUrls || null,
        caption,
        tipo,
      });
      addToast({
        type: 'success',
        title: '¡Publicado en Instagram!',
        message: result.permalink ? `Ver publicación →` : 'Tu contenido fue publicado exitosamente.',
      });
      if (result.permalink) {
        window.open(result.permalink, '_blank', 'noreferrer');
      }
      onClose();
    } catch (e) {
      addToast({
        type: 'error',
        title: 'Error al publicar',
        message: e.message || 'No se pudo publicar en Instagram.',
      });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Publicar en Instagram"
      maxWidth="540px"
      footer={
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose} disabled={publishing}>
            Cancelar
          </button>
          {!hasToken ? (
            <button
              className="btn btn-primary"
              onClick={() => { onClose(); navigate('/cuenta'); }}
              style={{ gap: 8, display: 'flex', alignItems: 'center' }}
            >
              <ExternalLink size={16} />
              Ir a Configuración
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handlePublish}
              disabled={publishing}
              style={{ gap: 8, display: 'flex', alignItems: 'center' }}
            >
              {publishing
                ? <><div className="btn-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Publicando...</>
                : <><Send size={16} /> Publicar ahora</>
              }
            </button>
          )}
        </div>
      }
    >
      {!hasToken ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          padding: '8px 0 16px', textAlign: 'center'
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <InstagramIcon size={28} color="#fff" />
          </div>
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
              Tu cuenta de Instagram no está conectada
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Ingresá tu Access Token de Meta en <strong>Cuenta → Conexiones</strong> para publicar directamente desde LeadBook.
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #f09433, #dc2743, #bc1888)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <InstagramIcon size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>Instagram</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Revisá el caption antes de publicar</div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 13, color: 'var(--text-secondary)' }}>
              Caption (editable)
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={6}
              className="input"
              style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit', fontSize: 14, padding: '12px 14px', lineHeight: 1.6 }}
              placeholder="Escribí o editá el caption..."
            />
            <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              {caption.length} chars
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
