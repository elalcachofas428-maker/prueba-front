import React, { useState } from 'react';
import { Image as ImageIcon, Download } from 'lucide-react';
import { InstagramIcon } from '../ui/InstagramIcon';
import { HeaderTab, ErrorState, InfoRow } from './helpers';
import ResultSkeleton from './ResultSkeleton';
import CopyButton from './CopyButton';
import InstagramModal from './InstagramModal';
import { useAuth } from '../../context/AuthContext';

export default function TabPost({ data, loading, error, onRetry }) {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const hasToken = !!(user?.meta_access_token);

  if (loading) {
    return (
      <div>
        <HeaderTab icon={ImageIcon} title="Post para Instagram" subtitle="Generando imagen y copy..." accentColor="var(--accent)" />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24 }}>
          <ResultSkeleton height={400} lines={0} />
          <ResultSkeleton height={150} lines={5} />
        </div>
      </div>
    );
  }

  if (error) return <ErrorState error={error} label="Post" onRetry={onRetry} />;

  const textContent = data?.caption || data?.texto || '';

  return (
    <div className="animate-fade-in-up">
      <HeaderTab
        icon={ImageIcon}
        title="Post para Instagram"
        subtitle="Imagen 1:1 con copy optimizado"
        accentColor="var(--accent)"
        actions={
          data?.url && (
            <div style={{ display: 'flex', gap: 8 }}>
              <a
                href={data.url}
                download="post-leadbook.jpg"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-sm"
                style={{ gap: 6, display: 'flex', alignItems: 'center' }}
              >
                <Download size={15} /> Descargar
              </a>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ aspectRatio: '1/1', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
          {data?.url && <img src={data.url} alt="Post preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '15px', color: 'var(--text-primary)' }}>
            {textContent || 'Sin contenido'}
          </div>
          {textContent && (
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
              <span className="text-caption">{textContent.length} caracteres</span>
              <CopyButton text={textContent} />
            </div>
          )}
        </div>
      </div>

      <InfoRow items={[
        { label: 'Dimensiones', value: '1080×1080px' },
        { label: 'Formato', value: 'JPG' },
        { label: 'Red', value: 'Instagram Feed' }
      ]} />

      <InstagramModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={data?.url}
        caption={textContent}
        tipo="post"
        hasToken={hasToken}
      />
    </div>
  );
}
