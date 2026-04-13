import React, { useState, useRef } from 'react';
import { LayoutTemplate, ChevronLeft, ChevronRight, Download, GripVertical } from 'lucide-react';
import { InstagramIcon } from '../ui/InstagramIcon';
import { HeaderTab, ErrorState, InfoRow } from './helpers';
import ResultSkeleton from './ResultSkeleton';
import CopyButton from './CopyButton';
import InstagramModal from './InstagramModal';
import { useAuth } from '../../context/AuthContext';

export default function TabCarrusel({ data, loading, error, onRetry }) {
  const { user } = useAuth();
  const [slideIndex, setSlideIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [slides, setSlides] = useState(null); // null = usar data.slides
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const hasToken = !!(user?.meta_access_token);

  if (loading) {
    return (
      <div>
        <HeaderTab icon={LayoutTemplate} title="Carrusel" subtitle="Diseñando slides..." accentColor="var(--accent)" />
        <ResultSkeleton height={400} lines={2} />
      </div>
    );
  }

  if (error) return <ErrorState error={error} label="Carrusel" onRetry={onRetry} />;

  // Inicializar slides la primera vez que llegan los datos
  const rawSlides = data?.slides || [];
  if (rawSlides.length === 0 && data?.url) {
    rawSlides.push({ url: data.url, texto: data.caption || data.texto });
  }
  const activeSlides = slides !== null ? slides : rawSlides;

  const prevSlide = () => setSlideIndex(v => Math.max(0, v - 1));
  const nextSlide = () => setSlideIndex(v => Math.min(activeSlides.length - 1, v + 1));

  const textContent = data?.caption || data?.texto || '';
  const imagenesUrls = activeSlides.map(s => (typeof s === 'string' ? s : s.url)).filter(Boolean);

  // ── Drag and drop ────────────────────────────────────────────────────────────
  const handleDragStart = (e, index) => {
    dragItem.current = index;
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (dragItem.current === null || dragItem.current === index) return;
    const base = slides !== null ? [...slides] : [...rawSlides];
    const dragged = base[dragItem.current];
    base.splice(dragItem.current, 1);
    base.splice(index, 0, dragged);
    setSlides(base);
    setSlideIndex(index);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // ── Descargar slide activo ────────────────────────────────────────────────
  const handleDownloadSlide = (url, idx) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `carrusel-slide-${idx + 1}.jpg`;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.click();
  };

  const handleDownloadAll = () => {
    activeSlides.forEach((slide, i) => {
      const url = typeof slide === 'string' ? slide : slide.url;
      if (!url) return;
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = url;
        a.download = `carrusel-slide-${i + 1}.jpg`;
        a.target = '_blank';
        a.rel = 'noreferrer';
        a.click();
      }, i * 300);
    });
  };

  return (
    <div className="animate-fade-in-up">
      <HeaderTab
        icon={LayoutTemplate}
        title="Carrusel de Valor"
        subtitle="Arrastrá los slides para reordenarlos antes de publicar"
        accentColor="var(--accent)"
        actions={
          activeSlides.length > 0 && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleDownloadAll}
                style={{ gap: 6, display: 'flex', alignItems: 'center' }}
              >
                <Download size={15} /> Todos
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setModalOpen(true)}
                style={{ gap: 8, display: 'flex', alignItems: 'center' }}
              >
                <InstagramIcon size={15} />
                Publicar
              </button>
            </div>
          )
        }
      />

      {activeSlides.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 24, alignItems: 'start' }}>
          {/* Visor principal */}
          <div>
            <div style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
              {activeSlides[slideIndex]?.url && (
                <img
                  src={activeSlides[slideIndex].url}
                  alt={`Slide ${slideIndex + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}

              {/* Botones nav */}
              {slideIndex > 0 && (
                <button onClick={prevSlide} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <ChevronLeft size={20} />
                </button>
              )}
              {slideIndex < activeSlides.length - 1 && (
                <button onClick={nextSlide} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <ChevronRight size={20} />
                </button>
              )}

              {/* Contador */}
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 99 }}>
                {slideIndex + 1} / {activeSlides.length}
              </div>

              {/* Botón descargar slide activo */}
              <button
                onClick={() => handleDownloadSlide(activeSlides[slideIndex]?.url, slideIndex)}
                style={{ position: 'absolute', bottom: 12, right: 12, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                title="Descargar este slide"
              >
                <Download size={16} />
              </button>
            </div>

            {/* Puntos */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
              {activeSlides.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  style={{ height: 6, borderRadius: 3, cursor: 'pointer', background: i === slideIndex ? 'var(--accent)' : 'var(--border-strong)', width: i === slideIndex ? 24 : 6, transition: 'all 0.3s ease' }}
                />
              ))}
            </div>
          </div>

          {/* Panel de miniaturas arrastrables */}
          <div>
            <div className="text-label" style={{ marginBottom: 10 }}>Orden de slides</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeSlides.map((slide, i) => {
                const url = typeof slide === 'string' ? slide : slide.url;
                return (
                  <div
                    key={i}
                    draggable
                    onDragStart={(e) => handleDragStart(e, i)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDrop={(e) => handleDrop(e, i)}
                    onClick={() => setSlideIndex(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
                      borderRadius: 'var(--radius-md)', cursor: 'grab',
                      border: i === slideIndex ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                      background: i === slideIndex ? 'var(--accent-dim)' : 'var(--bg-card)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <GripVertical size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                    <div style={{ width: 40, height: 40, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: 'var(--bg-panel)' }}>
                      {url && <img src={url} alt={`s${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'DM Sans' }}>
                      Slide {i + 1}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'DM Sans', lineHeight: 1.4 }}>
              Arrastrá para reordenar antes de publicar
            </div>
          </div>
        </div>
      )}

      {textContent && (
        <div className="card" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div className="text-label">Caption</div>
            <CopyButton text={textContent} />
          </div>
          <div style={{ whiteSpace: 'pre-wrap', fontSize: '15px' }}>{textContent}</div>
        </div>
      )}

      <InfoRow items={[
        { label: 'Slides', value: String(activeSlides.length) },
        { label: 'Dimensiones', value: '1080×1080px' },
        { label: 'Red', value: 'Instagram Carrusel' }
      ]} />

      <InstagramModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imagenesUrls={imagenesUrls}
        caption={textContent}
        tipo="carrusel"
        hasToken={hasToken}
      />
    </div>
  );
}
