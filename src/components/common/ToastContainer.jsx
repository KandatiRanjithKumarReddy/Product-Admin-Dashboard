import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useProductsState } from '../../context/ProductsContext';

// Renders floating pop-up notification messages (success/error alerts)
export const ToastContainer = () => {
  const { toasts, removeToast } = useProductsState();

  if (!toasts.length) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.type === 'error' ? (
            <AlertCircle size={18} color="var(--danger-text)" />
          ) : (
            <CheckCircle2 size={18} color="var(--success-text)" />
          )}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            type="button"
            className="btn-ghost btn-icon"
            style={{ width: 24, height: 24 }}
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
