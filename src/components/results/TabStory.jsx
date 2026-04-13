import React, { useState } from 'react';
import { Film, Download } from 'lucide-react';
import { InstagramIcon } from '../ui/InstagramIcon';
import { HeaderTab, ErrorState, InfoRow } from './helpers';
import ResultSkeleton from './ResultSkeleton';
import CopyButton from './CopyButton';
import InstagramModal from './InstagramModal';
import { useAuth } from '../../context/AuthContext';

export default function TabStory({ data, loading, error, onRetry }) {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const hasToken = !!(user?.meta_access_token);

  if (loading) {
    return (
      <div>
        <HeaderTab icon={Film} title="Historia" subtitle="Ajustando formato 9:16..." accentColor="var(--accent)" />
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
          <ResultSkeleton height={568} lines={0} />
          <ResultSkeleton height={150} lines={4} />
        </div>
      </div>
    );
  }

  if (error) return <ErrorState error={error} label="Story" onRetry={onRetry} />;

  const textContent = data?.caption || data?.texto || '';

  return (
    <div className="animate-fade-in-up">
      <HeaderTab
        icon={Film}
        title="Historia para Instagram"
        subtitle="Formato vertical para mayor retención"
        accentColor="var(--accent)"
        actions={
          data?.url && (
            <div style={{ display: 'flex', gap: 8 }}>
              <a
                href={data.url}
                download="story-leadbook.jpg"
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

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
        <div style={{ aspectRatio: '9/16', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
          {data?.url && <img src={data.url} alt="Story preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
        <div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, whiteSpace: 'pre-wrap', fontSize: '15px' }}>
              {textContent || 'No hay texto asociado'}
            </div>
            {textContent && (
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', textAlign: 'right' }}>
                <CopyButton text={textContent} label="Copiar texto" />
              </div>
            )}
          </div>
        </div>
      </div>

      <InfoRow items={[
        { label: 'Dimensiones', value: '1080×1920px' },
        { label: 'Formato', value: 'JPG' },
        { label: 'Red', value: 'Instagram Stories' }
      ]} />

      <InstagramModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={data?.url}
        caption={textContent}
        tipo="story"
        hasToken={hasToken}
      />
    </div>
  );
}
