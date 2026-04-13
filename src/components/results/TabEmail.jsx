import React from 'react';
import { Mail, Download } from 'lucide-react';
import { HeaderTab, ErrorState, InfoRow } from './helpers';
import ResultSkeleton from './ResultSkeleton';
import CopyButton from './CopyButton';

export default function TabEmail({ data, loading, error, onRetry }) {
  if (loading) {
    return (
      <div>
        <HeaderTab icon={Mail} title="Email Marketing" subtitle="Redactando cuerpo del correo..." accentColor="var(--accent)" />
        <ResultSkeleton height={400} lines={6} />
      </div>
    );
  }

  if (error) return <ErrorState error={error} label="Email" onRetry={onRetry} />;

  const handleDownloadHTML = () => {
    if (!data?.html) return;
    const blob = new Blob([data.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in-up">
      <HeaderTab 
        icon={Mail} 
        title="Email Marketing" 
        subtitle="Campaña estructurada y lista"
        accentColor="var(--accent)"
        actions={
          data?.html ? (
            <button onClick={handleDownloadHTML} className="btn btn-secondary">
              <Download size={18} /> Descargar HTML
            </button>
          ) : null
        }
      />

      {data?.html ? (
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ background: '#E2E8F0', padding: '12px 16px', display: 'flex', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }} />
          </div>
          <iframe 
            srcDoc={data.html} 
            sandbox="allow-same-origin" 
            style={{ width: '100%', height: 520, border: 'none', background: '#fff', display: 'block' }} 
            title="Email Preview"
          />
        </div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <CopyButton text={data?.texto || ''} />
          </div>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '15px' }}>
            {data?.texto || 'No hay contenido disponible'}
          </pre>
        </div>
      )}

      {data?.asunto && (
        <div className="card" style={{ marginTop: 24, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="text-label" style={{ marginBottom: 4 }}>Asunto</div>
            <div style={{ fontWeight: 500 }}>{data.asunto}</div>
          </div>
          <CopyButton text={data.asunto} label="Copiar Asunto" />
        </div>
      )}

      <InfoRow items={[
        { label: 'Formato', value: data?.html ? 'HTML' : 'Texto Plano' },
        { label: 'Compatible', value: 'Mailchimp/Brevo/Gmail' },
        { label: 'Personalizado', value: 'Sí' }
      ]} />
    </div>
  );
}
