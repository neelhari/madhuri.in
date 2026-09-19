import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = Info;
        let iconColor = 'var(--primary-green)';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconColor = '#006738';
        } else if (toast.type === 'warning' || toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = '#E53935';
        }

        return (
          <div key={toast.id} className={`toast-item toast-${toast.type}`}>
            <Icon size={18} color={iconColor} className="toast-icon" />
            <span className="toast-text">{toast.message}</span>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}

      <style>{`
        .toast-container {
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 999;
          display: flex;
          flex-direction: column;
          gap: 8px;
          pointer-events: none;
          max-width: 360px;
          width: calc(100% - 40px);
        }

        @media (max-width: 768px) {
          .toast-container {
            top: 20px;
            right: 12px;
            left: 12px;
            max-width: 100%;
          }
        }

        .toast-item {
          pointer-events: auto;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: #FFFFFF;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          animation: fadeIn 0.25s ease-out;
        }

        .toast-success {
          border-left: 4px solid var(--primary-green);
        }

        .toast-warning, .toast-error {
          border-left: 4px solid #E53935;
        }

        .toast-info {
          border-left: 4px solid var(--secondary-green);
        }

        .toast-icon {
          flex-shrink: 0;
        }

        .toast-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-dark);
          flex: 1;
        }

        .toast-close {
          color: var(--text-muted);
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color var(--transition-fast);
        }

        .toast-close:hover {
          color: var(--text-dark);
        }
      `}</style>
    </div>
  );
};
