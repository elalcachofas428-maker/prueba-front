export default function Toggle({ value, onChange, label, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      {(label || subtitle) && (
        <div>
          {label    && <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{label}</div>}
          {subtitle && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{subtitle}</div>}
        </div>
      )}
      <div className={`toggle-track ${value ? 'active' : ''}`} onClick={() => onChange(!value)}>
        <div className="toggle-thumb" />
      </div>
    </div>
  );
}
