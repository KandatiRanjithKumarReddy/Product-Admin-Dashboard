import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Try to restore the user from localStorage on first load
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  // Save login data to state and localStorage
  const saveAuthSession = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  };

  // Clear everything on logout or session expiry
  const clearAuthSession = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }, []);

  // Auto-logout if the API returns 401 (token expired, etc.)
  useEffect(() => {
    const handleUnauthorized = () => clearAuthSession();

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    setLoading(false);

    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [clearAuthSession]);

  // Call the login API and store the session
  const login = async ({ username, password }) => {
    const data = await authApi.login({ username, password });
    const authToken = data.accessToken || data.token;
    saveAuthSession(data, authToken);
    return data;
  };

  const logout = () => clearAuthSession();

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
