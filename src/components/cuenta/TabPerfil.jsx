import React from 'react';
import AvatarUpload from './AvatarUpload';
import { Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TabPerfil({ profileData, onUpdate }) {
  const { user } = useAuth();
  const planName = profileData?.plan_nombre || 'FREE';
  const badgeTitle = planName.toUpperCase() === 'PRO' ? 'Plan Pro' : 'Plan Free';
  const badgeClass = planName.toUpperCase() === 'PRO' ? 'badge-accent' : 'badge-info';

  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    console.log('Cloudinary config:', { cloudName, uploadPreset });

    if (!cloudName || cloudName === 'tu_cloud_name') {
      throw new Error('VITE_CLOUDINARY_CLOUD_NAME no está configurado en .env');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset || 'leadbook_preset');

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log('Subiendo a:', url);

    const res = await fetch(url, { method: 'POST', body: formData });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      console.error('Cloudinary error response:', errJson);
      throw new Error(errJson?.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    console.log('Upload OK, url:', data.secure_url);
    return data.secure_url;
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      // Mostrar preview inmediato
      const blobUrl = URL.createObjectURL(file);
      onUpdate('logoUrl', blobUrl);
      
      try {
        const url = await uploadToCloudinary(file);
        onUpdate('logoUrl', url);
      } catch (err) {
        console.error('Error subiendo logo:', err);
        alert(`Error subiendo logo: ${err.message}`);
      }
    }
  };

  const handleAvatarUpload = async (file) => {
    const blobUrl = URL.createObjectURL(file);
    onUpdate('avatar', blobUrl);
    try {
      const url = await uploadToCloudinary(file);
      onUpdate('avatar', url);
    } catch (err) {
      console.error('Error subiendo avatar:', err);
      alert(`Error subiendo avatar: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in-up">
      {/* Sección Identidad */}
      <div className="card">
        <div className="text-label" style={{ marginBottom: 24 }}>IDENTIDAD</div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <AvatarUpload 
            src={profileData?.logoUrl || user?.agencyLogo || profileData?.logo_url} 
            nombre={profileData?.nombre} 
            onUpload={(file) => handleLogoUpload({ target: { files: [file] } })} 
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 18, fontWeight: 600 }}>{profileData?.nombre || 'Usuario'}</span>
              <span className={`badge ${badgeClass}`}>{badgeTitle}</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              {profileData?.email || ''}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16, '@media (max-width: 640px)': { gridTemplateColumns: '1fr' } }}>
          <div className="input-wrapper">
            <label className="input-label">Nombre Completo <span className="required">*</span></label>
            <input className="input" value={profileData?.nombre || ''} onChange={e => onUpdate('nombre', e.target.value)} />
          </div>
          <div className="input-wrapper">
            <label className="input-label">Email <span className="required">*</span></label>
            <input type="email" className="input" value={profileData?.email || ''} onChange={e => onUpdate('email', e.target.value)} />
          </div>
          <div className="input-wrapper">
            <label className="input-label">Teléfono</label>
            <input className="input" placeholder="+54 11 1234-5678" value={profileData?.telefono || ''} onChange={e => onUpdate('telefono', e.target.value)} />
          </div>
          <div className="input-wrapper">
            <label className="input-label">País</label>
            <select className="input select" value={profileData?.pais || ''} onChange={e => onUpdate('pais', e.target.value)}>
              <option value="">Seleccionar país...</option>
              <option value="Argentina">Argentina</option>
              <option value="México">México</option>
              <option value="Colombia">Colombia</option>
              <option value="Chile">Chile</option>
              <option value="Uruguay">Uruguay</option>
              <option value="España">España</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sección Agencia */}
      <div className="card">
        <div className="text-label">DATOS DE LA AGENCIA</div>
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 16 }}>Estos datos aparecen en los listados y PDF generados</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16, marginBottom: 16 }}>
          <div className="input-wrapper">
            <label className="input-label">Nombre de la Agencia</label>
            <input className="input" placeholder="Ej: Inmobiliaria Premium" value={profileData?.nombreInmobiliaria || ''} onChange={e => onUpdate('nombreInmobiliaria', e.target.value)} />
          </div>
          <div className="input-wrapper">
            <label className="input-label">Sitio Web</label>
            <input type="url" className="input" placeholder="https://..." value={profileData?.sitioWeb || ''} onChange={e => onUpdate('sitioWeb', e.target.value)} />
          </div>
        </div>

        <div className="input-wrapper" style={{ marginBottom: 16 }}>
          <label className="input-label">Descripción / Bio</label>
          <textarea className="textarea" rows={3} placeholder="Breve descripción de la agencia o agente..." value={profileData?.bio || ''} onChange={e => onUpdate('bio', e.target.value)} />
        </div>

        <div className="input-wrapper">
          <label className="input-label">Logo de la Agencia</label>
          
          <div style={{ 
            height: 80, width: '100%', 
            border: profileData?.logoUrl ? '1px solid var(--border-subtle)' : '1px dashed var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            background: profileData?.logoUrl ? 'var(--bg-surface)' : 'rgba(255,255,255,0.02)',
            display: 'flex', alignItems: 'center', justifyContent: profileData?.logoUrl ? 'space-between' : 'center',
            padding: profileData?.logoUrl ? '0 16px' : 0,
            position: 'relative', overflow: 'hidden'
          }}>
            {profileData?.logoUrl ? (
              <>
                <div style={{ height: 48, display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 4, padding: 4 }}>
                  <img src={profileData.logoUrl} alt="Logo" style={{ maxHeight: '100%', maxWidth: 200, objectFit: 'contain' }} />
                </div>
                <label style={{ cursor: 'pointer' }} className="btn btn-secondary btn-sm">
                  Cambiar
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
                </label>
              </>
            ) : (
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', width: '100%', height: '100%', justifyContent: 'center' }}>
                <Upload size={14} color="var(--text-tertiary)" />
                <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Subir logo (PNG o SVG recomendado)</span>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
