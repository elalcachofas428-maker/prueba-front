import React, { useState, useEffect } from 'react';
import { User, Shield, CreditCard, Link2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL, getPerfil } from '../services/api';
import { ErrorState } from '../components/results/helpers';
import ResultSkeleton from '../components/results/ResultSkeleton';

import TabPerfil from '../components/cuenta/TabPerfil';
import TabSeguridad from '../components/cuenta/TabSeguridad';
import TabPlan from '../components/cuenta/TabPlan';
import TabConexiones from '../components/cuenta/TabConexiones';
import SaveBar from '../components/cuenta/SaveBar';

const TABS = [
  { id: 'perfil',      label: 'Perfil',      icon: User },
  { id: 'seguridad',   label: 'Seguridad',   icon: Shield },
  { id: 'plan',        label: 'Plan',        icon: CreditCard },
  { id: 'conexiones',  label: 'Conexiones',  icon: Link2 },
];

export default function CuentaPage() {
  const { updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [originalData, setOriginalData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPerfil();
      setOriginalData(data);
      setProfileData({ ...data });

      // Sincronizar con el contexto global
      updateProfile({
        name: data.nombre,
        email: data.email,
        agencyName: data.nombre_inmobiliaria,
        agencyLogo: data.logo_url
      });
    } catch(err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleDiscard = () => {
    setProfileData({ ...originalData });
    setSaveError(null);
    setSaveSuccess(false);
  };

  const isDirty = JSON.stringify(originalData) !== JSON.stringify(profileData);

  const handleSave = async (payloadToSave, forceEndpoint) => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      if (forceEndpoint === 'password') {
        const res = await fetch(`${API_BASE_URL}/auth/cambiar-password/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token') || localStorage.getItem('subzero_access')}`
          },
          body: JSON.stringify(payloadToSave)
        });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error || body.detail || 'Error al cambiar contraseña');
        }
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        return { success: true };
      }

      // Default perfil global save
      const bodyPayload = {
        nombre: profileData.nombre,
        email: profileData.email,
        telefono: profileData.telefono,
        pais: profileData.pais,
        nombre_inmobiliaria: profileData.nombreInmobiliaria || profileData.nombre_inmobiliaria,
        sitio_web: profileData.sitioWeb || profileData.sitio_web,
        bio: profileData.bio,
        logo_url: profileData.logoUrl || profileData.logo_url,
      };

      const res = await fetch(`${API_BASE_URL}/auth/perfil/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token') || localStorage.getItem('subzero_access')}`
        },
        body: JSON.stringify(bodyPayload)
      });
      if (!res.ok) throw new Error('Error al guardar perfil');

      const newSaved = await res.json();
      setOriginalData(newSaved);
      setProfileData({ ...newSaved });
      setSaveSuccess(true);

      // TAREA 2 — Forzar actualización del contexto Y del localStorage con el nuevo logoUrl
      const newLogo = newSaved.logo_url || profileData.logoUrl;
      updateProfile({
        name: newSaved.nombre,
        email: newSaved.email,
        agencyName: newSaved.nombre_inmobiliaria,
        agencyLogo: newLogo
      });

      // Asegurar localStorage redundante (aunque updateProfile ya lo hace)
      const stored = JSON.parse(localStorage.getItem('subzero_user') || '{}');
      stored.agencyLogo = newLogo;
      localStorage.setItem('subzero_user', JSON.stringify(stored));

      setTimeout(() => setSaveSuccess(false), 3000);
      return { success: true };
    } catch(err) {
      setSaveError(err.message || 'Ocurrió un error');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px', position: 'relative' }}>

      <div style={{ marginBottom: 32 }}>
        <h1 className="text-h2" style={{ marginBottom: 4, color: 'var(--text-primary)' }}>Mi Cuenta</h1>
        <p className="text-body text-secondary">
          {profileData?.email || 'Ajustes y configuración'}
        </p>
      </div>

      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'flex', gap: 4, background: 'var(--bg-card)', padding: 4,
          borderRadius: 'var(--radius-full)', width: 'fit-content'
        }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px',
                  border: 'none', borderRadius: 'var(--radius-full)', cursor: 'pointer',
                  background: active ? 'var(--accent)' : 'transparent',
                  color: active ? '#070B14' : 'var(--text-secondary)',
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => { if(!active) e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={e => { if(!active) e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                <Icon size={16} /> {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {loading ? (
        <ResultSkeleton height={400} lines={4} />
      ) : error ? (
        <ErrorState error={error} onRetry={fetchProfile} label="perfil" />
      ) : (
        <>
          {activeTab === 'perfil' && (
            <TabPerfil
              profileData={profileData}
              onUpdate={handleUpdate}
            />
          )}
          {activeTab === 'seguridad' && (
            <TabSeguridad
              onSave={(payload) => handleSave(payload, 'password')}
              saving={saving}
              saveError={saveError}
              saveSuccess={saveSuccess}
            />
          )}
          {activeTab === 'plan' && (
            <TabPlan
              profileData={profileData}
            />
          )}
          {activeTab === 'conexiones' && (
            <TabConexiones
              profileData={profileData}
              onUpdate={handleUpdate}
              onSave={handleSave}
            />
          )}
        </>
      )}

      {/* SaveBar (Solo en TabPerfil si hay cambios) */}
      <SaveBar
        visible={activeTab === 'perfil' && (isDirty || saveError || saveSuccess)}
        saving={saving}
        onSave={() => handleSave(profileData)}
        onDiscard={handleDiscard}
        saveSuccess={saveSuccess}
        saveError={saveError}
      />

    </div>
  );
}
