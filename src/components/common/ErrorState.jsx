import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

// Friendly error card with a retry button
export const ErrorState = ({
  title = 'Failed to load products',
  message = 'An unexpected network error occurred while reaching the server.',
  onRetry,
}) => {
  return (
    <div className="surface-card error-state">
      <div className="state-icon-box" style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)' }}>
        <AlertTriangle size={32} />
      </div>
      <h3 className="state-title">{title}</h3>
      <p className="state-desc">{message}</p>
      {onRetry && (
        <Button variant="primary" icon={RefreshCw} onClick={onRetry} style={{ marginTop: '0.5rem' }}>
          Retry Request
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
