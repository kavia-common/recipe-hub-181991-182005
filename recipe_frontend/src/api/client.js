/**
 * Axios API client configured for Recipe Hub frontend.
 * - baseURL from REACT_APP_API_URL or fallback http://localhost:3001
 * - Attaches Authorization Bearer token from localStorage if present
 * - Basic response error handling for 401 to optionally clear token
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const TOKEN_STORAGE_KEY = 'recipehub_token';
export const USER_STORAGE_KEY = 'recipehub_user';

// PUBLIC_INTERFACE
export function getStoredToken() {
  /** Return JWT token from localStorage if available. */
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function setStoredAuth(token, user) {
  /** Persist JWT token and user in localStorage. */
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  } catch {
    // no-op in restricted environments
  }
}

// PUBLIC_INTERFACE
export function clearStoredAuth() {
  /** Clear JWT token and user from localStorage. */
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    // no-op
  }
}

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
client.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    // Attach bearer token
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: if 401, optionally clear auth
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // NOTE: Do not automatically clear here to avoid infinite loops in some flows
      // Expose error to caller; AuthContext can decide to logout.
    }
    return Promise.reject(error);
  }
);

export default client;
