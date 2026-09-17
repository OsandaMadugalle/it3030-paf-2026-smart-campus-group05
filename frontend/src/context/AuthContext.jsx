import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

// Decode JWT payload locally — no network needed
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const isTokenExpired = (decoded) => {
  if (!decoded?.exp) return true;
  // exp is in seconds; add 10s buffer
  return decoded.exp * 1000 < Date.now() + 10_000;
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem('token');
  const decoded = token ? decodeToken(token) : null;

  // Initialise user synchronously from the JWT so ProtectedRoute never
  // needs to wait for a network round-trip before rendering.
  const initialUser = decoded && !isTokenExpired(decoded)
    ? {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        avatarUrl: decoded.avatarUrl,
        roles: decoded.roles
          ? (typeof decoded.roles === 'string' ? decoded.roles.split(',') : decoded.roles)
          : [],
      }
    : null;

  const [user, setUser] = useState(initialUser);
  // loading is false immediately when we can resolve from the token locally
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Skip background fetch if there's no token or it's already expired
    if (!token || !decoded || isTokenExpired(decoded)) {
      if (!token || isTokenExpired(decoded)) {
        localStorage.removeItem('token');
        setUser(null);
      }
      return;
    }

    // Silently refresh the full user profile in the background so that
    // any profile changes (name, avatar, roles) are picked up without
    // blocking the initial render.
    api.get('/user/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        // Token rejected by server — clear stale session
        localStorage.removeItem('token');
        setUser(null);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  const login = (userData, newToken) => {
    localStorage.setItem('token', newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
