import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

//404 screen displayed when navigating to an unknown URL
export const NotFoundPage = () => {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div className="state-icon-box" style={{ background: 'var(--brand-glow)', color: 'var(--brand-400)', width: 72, height: 72 }}>
        <HelpCircle size={36} />
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '1rem 0 0.5rem' }}>
        404 - Page Not Found
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 460, marginBottom: '1.5rem' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/products" className="btn btn-primary">
        <ArrowLeft size={16} /> Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
