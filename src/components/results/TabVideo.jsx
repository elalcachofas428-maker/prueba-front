import React, { useState, useRef, useCallback } from 'react';
import { Video, Download, Play, Square, Loader } from 'lucide-react';
import { HeaderTab, ErrorState, InfoRow } from './helpers';

// ─── Constantes ───────────────────────────────────────────
const CANVAS_W = 1080;
const CANVAS_H = 1920;
const FPS = 30;
const FRAME_MS = 1000 / FPS;

// Duración por foto en segundos según tipo de video
const PHOTO_DURATION = { tour: 4, reel_rapido: 2 };
// Duración del slide de características
const CHARS_DURATION = 3;
// Duración del slide CTA final
const CTA_DURATION = 3;

// ─── Helpers ──────────────────────────────────────────────
function loadImage(src) {
  return new Promise((resolve, reject) => {
    if (!src) return reject(new Error('No src'));
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  for (const word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line.trim(), x, currentY);
      line = word + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim()) ctx.fillText(line.trim(), x, currentY);
  return currentY;
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ─── Renderizador de frames ────────────────────────────────
class VideoRenderer {
  constructor(canvas, formData, images) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.formData = formData;
    this.images = images; // array de HTMLImageElement (portada + fotosRecorrido)
    this.tipoVideo = formData.tipoVideo || 'tour';
    this.photoDuration = PHOTO_DURATION[this.tipoVideo] || 3;
  }

  // Dibuja fondo con imagen + Ken Burns (zoom lento)
  drawPhotoBg(img, progress) {
    const ctx = this.ctx;
    const scale = 1 + 0.06 * easeInOut(progress); // zoom del 0% al 6%
    const sw = CANVAS_W / scale;
    const sh = CANVAS_H / scale;
    const sx = (CANVAS_W - sw) / 2;
    const sy = (CANVAS_H - sh) / 2;

    // Fit & crop
    const imgRatio = img.width / img.height;
    const canvasRatio = CANVAS_W / CANVAS_H;
    let drawW, drawH, drawX, drawY;
    if (imgRatio > canvasRatio) {
      drawH = CANVAS_H;
      drawW = img.width * (CANVAS_H / img.height);
    } else {
      drawW = CANVAS_W;
      drawH = img.height * (CANVAS_W / img.width);
    }
    drawX = (CANVAS_W - drawW) / 2;
    drawY = (CANVAS_H - drawH) / 2;

    ctx.save();
    ctx.translate(CANVAS_W / 2, CANVAS_H / 2);
    ctx.scale(scale, scale);
    ctx.translate(-CANVAS_W / 2, -CANVAS_H / 2);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();

    // Dark gradient bottom
    const grad = ctx.createLinearGradient(0, CANVAS_H * 0.4, 0, CANVAS_H);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.82)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  // Overlay oscuro sólido (para slides sin foto)
  drawSolidBg(color = '#12121e') {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  // Badge VENTA / ALQUILER
  drawBadge(alpha = 1) {
    const ctx = this.ctx;
    const operacion = (this.formData.operacion || 'VENTA').toUpperCase();
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = 'bold 52px Arial';
    const tw = ctx.measureText(operacion).width;
    const px = 40, py = 80, pad = 28;
    ctx.fillStyle = '#dc143c';
    ctx.beginPath();
    ctx.roundRect(px, py - 52, tw + pad * 2, 72, 10);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.fillText(operacion, px + pad, py);
    ctx.restore();
  }

  // Logo agencia top-right
  drawLogo(logoImg, alpha = 1) {
    if (!logoImg) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = alpha;
    const maxW = 240, maxH = 100;
    let lw = logoImg.width, lh = logoImg.height;
    if (lw > maxW) { lh = lh * maxW / lw; lw = maxW; }
    if (lh > maxH) { lw = lw * maxH / lh; lh = maxH; }
    ctx.drawImage(logoImg, CANVAS_W - lw - 50, 50, lw, lh);
    ctx.restore();
  }

  // Texto principal sobre foto con fade-in
  drawPhotoText(photoIndex, progress, alpha) {
    const ctx = this.ctx;
    const fd = this.formData;
    const fadeIn = Math.min(1, progress * 4); // entra rápido en primer 25%
    ctx.save();
    ctx.globalAlpha = alpha * fadeIn;

    if (photoIndex === 0) {
      // Slide de portada: tipo + ciudad + precio
      const tipo = (fd.tipoPropiedad || 'Propiedad').toUpperCase();
      const ciudad = (fd.ciudad || '').toUpperCase();
      const moneda = fd.moneda || 'USD';
      const precio = fd.precio || '';

      ctx.font = 'bold 88px Arial';
      ctx.fillStyle = 'white';
      wrapText(ctx, tipo, 60, CANVAS_H - 680, CANVAS_W - 120, 100);

      ctx.font = '52px Arial';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText(`en ${ciudad}`, 60, CANVAS_H - 560);

      // Línea acento
      ctx.fillStyle = '#dc143c';
      ctx.fillRect(60, CANVAS_H - 520, 100, 6);

      ctx.font = 'bold 100px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(`${moneda} ${precio}`, 60, CANVAS_H - 420);
    } else {
      // Fotos de recorrido: numeración + descripción genérica
      ctx.font = 'bold 64px Arial';
      ctx.fillStyle = 'white';
      const label = `Foto ${photoIndex + 1}`;
      ctx.fillText(label, 60, CANVAS_H - 500);

      ctx.font = '44px Arial';
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      const tipo = fd.tipoPropiedad || 'Propiedad';
      const ciudad = fd.ciudad || '';
      wrapText(ctx, `${tipo} en ${ciudad}`, 60, CANVAS_H - 420, CANVAS_W - 120, 54);
    }

    // Footer agente
    ctx.font = '38px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    const footer = [fd.agenteNombre, fd.agenteTelefono, fd.agenciaNombre].filter(Boolean).join('  ·  ');
    if (footer) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, CANVAS_H - 120, CANVAS_W, 120);
      ctx.fillStyle = 'white';
      ctx.font = '38px Arial';
      const fw = ctx.measureText(footer).width;
      ctx.fillText(footer, (CANVAS_W - fw) / 2, CANVAS_H - 50);
    }

    ctx.restore();
  }

  // Slide de características (sin foto de fondo)
  drawCharsSlide(progress) {
    const ctx = this.ctx;
    const fd = this.formData;
    this.drawSolidBg('#12121e');

    const fadeIn = Math.min(1, progress * 3);
    ctx.save();
    ctx.globalAlpha = fadeIn;

    // Título
    ctx.font = 'bold 72px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('CARACTERÍSTICAS', CANVAS_W / 2, 260);

    // Línea acento
    ctx.fillStyle = '#dc143c';
    ctx.fillRect(CANVAS_W / 2 - 80, 290, 160, 6);

    const features = [];
    if (fd.recamaras) features.push(['Habitaciones', String(fd.recamaras)]);
    if (fd.banos) features.push(['Baños', String(fd.banos)]);
    if (fd.superficieConstruida) features.push(['Superficie', `${fd.superficieConstruida} m²`]);
    if (fd.estacionamientos) features.push(['Cocheras', String(fd.estacionamientos)]);
    if (fd.pisosNiveles) features.push(['Niveles', String(fd.pisosNiveles)]);

    const startY = 420;
    const colW = CANVAS_W / 2;
    features.slice(0, 4).forEach(([label, value], idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const cx = colW * col + colW / 2;
      const cy = startY + row * 300;

      ctx.font = 'bold 110px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(value, cx, cy);

      ctx.font = '48px Arial';
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillText(label, cx, cy + 65);

      // Separador vertical
      if (col === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(colW - 1, cy - 120, 2, 200);
      }
    });

    ctx.textAlign = 'left';
    ctx.restore();
  }

  // Slide CTA final
  drawCTASlide(progress, logoImg) {
    const ctx = this.ctx;
    const fd = this.formData;
    this.drawSolidBg('#0d0d1a');

    // Pulso de fondo
    const pulse = 0.03 * Math.sin(progress * Math.PI * 6);
    const fadeIn = Math.min(1, progress * 2.5);
    ctx.save();
    ctx.globalAlpha = fadeIn;

    ctx.font = 'bold 80px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('¿TE INTERESA?', CANVAS_W / 2, 480);

    ctx.fillStyle = '#dc143c';
    ctx.fillRect(CANVAS_W / 2 - 80, 510, 160, 6);

    ctx.font = '56px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fillText('CONTACTANOS HOY', CANVAS_W / 2, 600);

    if (fd.agenteNombre) {
      ctx.font = 'bold 60px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(fd.agenteNombre, CANVAS_W / 2, 800);
    }
    if (fd.agenteTelefono) {
      ctx.font = '52px Arial';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText(fd.agenteTelefono, CANVAS_W / 2, 880);
    }
    if (fd.agenciaNombre) {
      ctx.font = '46px Arial';
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillText(fd.agenciaNombre, CANVAS_W / 2, 960);
    }

    this.drawLogo(logoImg, 1);
    ctx.textAlign = 'left';
    ctx.restore();
  }

  // Transición de fade entre slides
  drawTransition(alpha) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.restore();
  }
}

// ─── Componente principal ─────────────────────────────────
export default function TabVideo({ formData }) {
  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | loading | rendering | preview | done | error
  const [progress, setProgress] = useState(0);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const animFrameRef = useRef(null);

  const fd = formData || {};

  const handleGenerate = useCallback(async () => {
    setStatus('loading');
    setProgress(0);
    setVideoBlob(null);
    setVideoUrl(null);

    try {
      // Cargar todas las imágenes
      const allPhotos = [fd.portadaUrl, ...(fd.fotosRecorrido || [])].filter(Boolean);
      const loadedImages = [];
      for (const src of allPhotos) {
        try {
          const img = await loadImage(src);
          loadedImages.push(img);
        } catch {
          // foto inválida, saltar
        }
      }

      if (loadedImages.length === 0) {
        setStatus('error');
        return;
      }

      // Logo
      let logoImg = null;
      if (fd.logoAgenciaUrl) {
        try { logoImg = await loadImage(fd.logoAgenciaUrl); } catch {}
      }

      const canvas = canvasRef.current;
      canvas.width = CANVAS_W;
      canvas.height = CANVAS_H;
      const renderer = new VideoRenderer(canvas, fd, loadedImages);

      // Calcular duración total
      const photoDur = PHOTO_DURATION[fd.tipoVideo || 'tour'] || 3;
      const TRANS_DUR = 0.4; // segundos de fade entre slides
      const totalPhotos = loadedImages.length;

      // Estructura de slides: fotos + características + CTA
      const slides = [
        ...loadedImages.map((img, i) => ({ type: 'photo', img, index: i, duration: photoDur })),
        { type: 'chars', duration: CHARS_DURATION },
        { type: 'cta', duration: CTA_DURATION },
      ];

      const totalSeconds = slides.reduce((acc, s) => acc + s.duration + TRANS_DUR, 0);
      const totalFrames = Math.ceil(totalSeconds * FPS);

      // Configurar MediaRecorder
      setStatus('rendering');
      const stream = canvas.captureStream(FPS);
      const mimeType = MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 });
      const chunks = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

      const recordingDone = new Promise(resolve => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
      });

      recorder.start();

      // Renderizar frame a frame
      let frameIndex = 0;
      let elapsedSeconds = 0;

      const renderFrame = () => {
        if (frameIndex >= totalFrames) {
          recorder.stop();
          return;
        }

        // Determinar en qué slide estamos
        elapsedSeconds = frameIndex / FPS;
        let t = elapsedSeconds;
        let currentSlide = null;
        let slideLocalTime = 0;
        let isTransition = false;
        let transitionProgress = 0;

        for (const slide of slides) {
          const slideTotalDur = slide.duration + TRANS_DUR;
          if (t <= slideTotalDur) {
            currentSlide = slide;
            if (t <= slide.duration) {
              slideLocalTime = t / slide.duration; // 0..1
            } else {
              isTransition = true;
              transitionProgress = (t - slide.duration) / TRANS_DUR;
            }
            break;
          }
          t -= slideTotalDur;
        }

        if (!currentSlide) {
          recorder.stop();
          return;
        }

        // Dibujar slide actual
        if (currentSlide.type === 'photo') {
          renderer.drawPhotoBg(currentSlide.img, slideLocalTime);
          renderer.drawBadge(Math.min(1, slideLocalTime * 5));
          renderer.drawLogo(logoImg, Math.min(1, slideLocalTime * 5));
          renderer.drawPhotoText(currentSlide.index, slideLocalTime, 1);
        } else if (currentSlide.type === 'chars') {
          renderer.drawCharsSlide(slideLocalTime);
          renderer.drawLogo(logoImg, 1);
        } else if (currentSlide.type === 'cta') {
          renderer.drawCTASlide(slideLocalTime, logoImg);
        }

        // Transición de fade
        if (isTransition) {
          renderer.drawTransition(easeInOut(transitionProgress));
        }

        frameIndex++;
        setProgress(Math.round((frameIndex / totalFrames) * 100));
        animFrameRef.current = requestAnimationFrame(renderFrame);
      };

      animFrameRef.current = requestAnimationFrame(renderFrame);

      const blob = await recordingDone;
      const url = URL.createObjectURL(blob);
      setVideoBlob(blob);
      setVideoUrl(url);
      setStatus('preview');

    } catch (err) {
      console.error('[TabVideo] Error:', err);
      setStatus('error');
    }
  }, [fd]);

  const handleDownload = () => {
    if (!videoBlob) return;
    const ext = videoBlob.type.includes('mp4') ? 'mp4' : 'webm';
    const tipo = fd.tipoPropiedad || 'propiedad';
    const ciudad = fd.ciudad || 'ciudad';
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `leadbook-${tipo}-${ciudad}.${ext}`.toLowerCase().replace(/\s+/g, '-');
    a.click();
  };

  const handleRetry = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setStatus('idle');
    setVideoBlob(null);
    setVideoUrl(null);
    setProgress(0);
  };

  const tipoVideo = fd.tipoVideo === 'reel_rapido' ? 'Reel Rápido' : 'Tour Narrado';
  const totalPhotos = [fd.portadaUrl, ...(fd.fotosRecorrido || [])].filter(Boolean).length;
  const photoDur = PHOTO_DURATION[fd.tipoVideo || 'tour'] || 3;
  const estimatedSecs = Math.round(totalPhotos * (photoDur + 0.4) + CHARS_DURATION + CTA_DURATION + 0.8);

  return (
    <div className="animate-fade-in-up">
      <HeaderTab
        icon={Video}
        title="Video"
        subtitle="Video estilo reels con tus fotos y datos de la propiedad"
        accentColor="var(--accent)"
        actions={
          status === 'preview' && (
            <button className="btn btn-secondary btn-sm" onClick={handleRetry} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Play size={15} /> Regenerar
            </button>
          )
        }
      />

      {/* Canvas oculto — solo para renderizar */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Estado IDLE */}
      {status === 'idle' && (
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Video size={36} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Generá tu video</div>
          <div style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 15 }}>
            {totalPhotos} foto{totalPhotos !== 1 ? 's' : ''} · {tipoVideo} · ~{estimatedSecs}s de video
          </div>
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            style={{ minWidth: 200, justifyContent: 'center' }}
          >
            <Play size={18} style={{ marginRight: 8 }} />
            Generar Video
          </button>
        </div>
      )}

      {/* Estado LOADING / RENDERING */}
      {(status === 'loading' || status === 'rendering') && (
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Loader size={40} style={{ color: 'var(--accent)', marginBottom: 24, animation: 'spin 1s linear infinite' }} />
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            {status === 'loading' ? 'Cargando imágenes...' : `Renderizando... ${progress}%`}
          </div>
          {status === 'rendering' && (
            <div style={{ maxWidth: 320, margin: '16px auto 0', height: 6, borderRadius: 3, background: 'var(--border-subtle)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent)', borderRadius: 3, transition: 'width 0.2s ease' }} />
            </div>
          )}
        </div>
      )}

      {/* Estado ERROR */}
      {status === 'error' && (
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ color: 'var(--error, #dc143c)', marginBottom: 16, fontSize: 15 }}>
            No se pudo generar el video. Asegurate de haber subido al menos una foto.
          </div>
          <button className="btn btn-secondary" onClick={handleRetry}>Reintentar</button>
        </div>
      )}

      {/* Estado PREVIEW */}
      {status === 'preview' && videoUrl && (
        <div>
          <div style={{ maxWidth: 360, margin: '0 auto 24px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#000' }}>
            <video
              ref={previewRef}
              src={videoUrl}
              controls
              loop
              style={{ width: '100%', display: 'block' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button className="btn btn-primary" onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Download size={18} /> Descargar Video
            </button>
          </div>
        </div>
      )}

      <InfoRow items={[
        { label: 'Formato', value: '1080×1920px' },
        { label: 'Tipo', value: tipoVideo },
        { label: 'Fotos', value: String(totalPhotos) },
        { label: 'Estimado', value: `~${estimatedSecs}s` },
      ]} />
    </div>
  );
}
