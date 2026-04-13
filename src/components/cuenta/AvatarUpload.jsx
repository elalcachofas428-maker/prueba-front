import React from 'react';
import { Camera } from 'lucide-react';

export default function AvatarUpload({ src, nombre, onUpload }) {
  const hashName = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const COLORS = [
    '#00D4FF', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'
  ];

  const fallbackStr = nombre || 'Usuario';
  const parts = fallbackStr.split(' ').filter(Boolean);
  const initials = parts.slice(0, 2).map(p => p[0].toUpperCase()).join('');
  
  const bgColor = COLORS[Math.abs(hashName(fallbackStr)) % COLORS.length];

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div style={{ position: 'relative', width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, group: 'upload-hover' }}>
      {src ? (
        <img src={src} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 600, fontFamily: 'Syne' }}>
          {initials}
        </div>
      )}
      
      <label style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0, transition: 'opacity 0.2s', cursor: 'pointer'
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = 1}
      onMouseLeave={e => e.currentTarget.style.opacity = 0}
      >
        <Camera size={18} color="#fff" />
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleChange} />
      </label>
    </div>
  );
}
