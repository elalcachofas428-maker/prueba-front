import React from 'react';
import { FileText, Download, ExternalLink, AlertCircle } from 'lucide-react';
import { HeaderTab, ErrorState, InfoRow } from './helpers';
import ResultSkeleton from './ResultSkeleton';

export default function TabPDF({ data, loading, error, onRetry, formData }) {
  const API_HOST = (import.meta.env.VITE_API_BASE_URL || '').replace('/api', '');

  if (loading) {
    return (
      <div>
        <HeaderTab
          icon={FileText}
          title="Documento PDF"
          subtitle="Generando ficha técnica profesional..."
          accentColor="var(--accent)"
        />
        <ResultSkeleton height={520} lines={4} />
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13, marginTop: 12 }}>
          ⏳ Esto puede tardar 10–20 segundos mientras procesamos las imágenes.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <HeaderTab icon={FileText} title="Documento PDF" accentColor="var(--accent)" />
        <div style={{
          border: '1px solid var(--error)',
          borderRadius: 'var(--radius-lg)',
          padding: 32,
          textAlign: 'center',
          background: 'rgba(239,68,68,0.05)'
        }}>
          <AlertCircle size={36} color="var(--error)" style={{ marginBottom: 12 }} />
          <p style={{ color: 'var(--error)', fontWeight: 600, marginBottom: 8 }}>
            {error?.isLimit ? 'Límite del plan alcanzado' : 'Error generando el PDF'}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>
            {error?.isLimit
              ? 'Actualizá tu plan para generar más PDFs este mes.'
              : 'Hubo un problema al generar el PDF. Podés reintentar.'}
          </p>
          <button onClick={onRetry} className="btn btn-outline">Reintentar</button>
        </div>
      </div>
    );
  }

  if (!data?.url) return null;

  const pdfSrc = data.url.startsWith('http') ? data.url : `${API_HOST}${data.url}`;

  return (
    <div className="animate-fade-in-up">
      <HeaderTab
        icon={FileText}
        title="Documento PDF"
        subtitle="Ficha técnica lista para descargar y compartir"
        accentColor="var(--accent)"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <a
              href={pdfSrc}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost btn-sm"
              style={{ gap: 6, display: 'flex', alignItems: 'center' }}
            >
              <ExternalLink size={15} /> Ver
            </a>
            <a
              href={pdfSrc}
              download="ficha-leadbook.pdf"
              className="btn btn-primary btn-sm"
              style={{ gap: 6, display: 'flex', alignItems: 'center' }}
            >
              <Download size={15} /> Descargar
            </a>
          </div>
        }
      />

      <div style={{
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: '#f5f5f5'
      }}>
        <iframe
          src={pdfSrc}
          width="100%"
          height={620}
          style={{ border: 'none', display: 'block' }}
          title="Vista previa PDF"
        />
      </div>

      <InfoRow items={[
        { label: 'Formato', value: 'PDF A4' },
        { label: 'Fotos', value: String(formData?.fotosRecorrido?.length || 0) },
        { label: 'Idioma', value: formData?.idioma || 'Español' }
      ]} />
    </div>
  );
}
