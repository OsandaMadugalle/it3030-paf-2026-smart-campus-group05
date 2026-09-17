import { useMemo } from 'react';

// Decode JWT token without library
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const useRole = () => {
  const token = localStorage.getItem('token');

  const decoded = useMemo(() => {
    if (!token) return null;
    return decodeToken(token);
  }, [token]);

  const roles = useMemo(() => {
    if (!decoded || !decoded.roles) return [];
    return decoded.roles.split(',');
  }, [decoded]);

  const isAdmin = roles.includes('ROLE_ADMIN');
  const isModerator = roles.includes('ROLE_MODERATOR');
  const isUser = roles.includes('ROLE_USER');
  const hasRole = (role) => roles.includes(role);

  const getUserInfo = () => {
    if (!decoded) return null;
    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      avatarUrl: decoded.avatarUrl,
      roles: roles,
    };
  };

  return {
    roles,
    isAdmin,
    isModerator,
    isUser,
    hasRole,
    getUserInfo,
    isAuthenticated: !!token && !!decoded,
  };
};

export default useRole;
