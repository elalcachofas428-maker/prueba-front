import { useAppStore } from '../../store/useAppStore';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={18} color="var(--success)" />,
  error:   <XCircle    size={18} color="var(--error)" />,
  warning: <AlertTriangle size={18} color="var(--warning)" />,
  info:    <Info       size={18} color="var(--accent)" />,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useAppStore();
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type || 'info'}`}>
          {icons[t.type || 'info']}
          <div className="toast-content">
            {t.title   && <div className="toast-title">{t.title}</div>}
            {t.message && <div className="toast-message">{t.message}</div>}
          </div>
          <button className="btn-icon" onClick={() => removeToast(t.id)} style={{ width: 24, height: 24 }}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
