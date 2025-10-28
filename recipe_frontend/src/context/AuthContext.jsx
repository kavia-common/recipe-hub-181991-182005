import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import client, { TOKEN_STORAGE_KEY, USER_STORAGE_KEY, setStoredAuth, clearStoredAuth } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AuthProvider manages JWT token and user profile.
 * Exposes login, register, logout, and a helper to fetch current user.
 */
export function AuthProvider({ children }) {
  /** Auth state */
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Load persisted auth
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedToken) {
        setToken(storedToken);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // ignore storage errors
    } finally {
      setInitializing(false);
    }
  }, []);

  // Keep localStorage in sync
  useEffect(() => {
    if (token) {
      try {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } catch {}
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } catch {}
    }
  }, [user]);

  const fetchMe = async () => {
    const { data } = await client.get(ENDPOINTS.AUTH.ME);
    setUser(data);
    return data;
  };

  const login = async (email, password) => {
    // Backend uses application/x-www-form-urlencoded for login per OpenAPI
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    const { data } = await client.post(
      ENDPOINTS.AUTH.LOGIN,
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const accessToken = data?.access_token;
    if (!accessToken) throw new Error('Invalid login response');
    setToken(accessToken);
    setStoredAuth(accessToken);
    await fetchMe();
    return true;
  };

  const register = async (payload) => {
    // payload: { email, password, full_name? }
    const { data } = await client.post(ENDPOINTS.AUTH.REGISTER, payload);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    clearStoredAuth();
  };

  const value = useMemo(() => ({
    token,
    user,
    initializing,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
    fetchMe,
  }), [token, user, initializing]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/**
 * PUBLIC_INTERFACE
 * Protected component to guard routes. If not authenticated, renders fallback.
 */
export function Protected({ children, fallback }) {
  const { isAuthenticated, initializing } = useAuth();
  if (initializing) {
    return (
      <div className="center p-4">
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return fallback || null;
  }
  return children;
}
