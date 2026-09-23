import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Package, Lock, User, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

// Login screen where users log into the application
export const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect users who are already logged in
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/products';
    return <Navigate to={from} replace />;
  }

  // Quickly auto-fill demo username and password
  const handleQuickFill = () => {
    setUsername('emilys');
    setPassword('emilyspass');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await login({ username, password });
      const from = location.state?.from?.pathname || '/products';
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error', err);
      setErrorMessage(
        err.message || 'Invalid username or password. Please use emilys / emilyspass.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="login-brand-icon">
            <Package size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
            Product Admin Portal
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
            Sign in to manage inventory and products
          </p>
        </div>

        {/* Demo credentials box for quick testing */}
        <div className="login-credentials-hint">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <KeyRound size={14} color="var(--brand-400)" /> Supplied Credentials:
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleQuickFill}
              style={{ padding: '2px 6px', fontSize: '0.75rem', color: 'var(--brand-400)' }}
            >
              Fill Credentials
            </button>
          </div>
          <div className="credentials-row">
            <span>Username: <strong>emilys</strong></span>
            <span>Password: <strong>emilyspass</strong></span>
          </div>
        </div>

        {errorMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              color: 'var(--danger-text)',
              padding: '0.75rem 1rem',
              borderRadius: 8,
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="username"
                type="text"
                className="form-input"
                style={{ width: '100%', paddingLeft: '2.5rem' }}
                placeholder="Enter username (e.g. emilys)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="password"
                type="password"
                className="form-input"
                style={{ width: '100%', paddingLeft: '2.5rem' }}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
          >
            <span>Sign In to Dashboard</span>
            {!isSubmitting && <ArrowRight size={16} />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
