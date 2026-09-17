import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Decode JWT token to get payload claims
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

// Determine dashboard based on role hierarchy: Admin > Moderator > User
const getDashboardPath = (roles) => {
  if (!roles || roles.length === 0) return '/dashboard/user';
  
  const roleList = typeof roles === 'string' ? roles.split(',') : roles;
  
  if (roleList.includes('ROLE_ADMIN')) {
    return '/dashboard/admin';
  }
  if (roleList.includes('ROLE_MODERATOR')) {
    return '/dashboard/moderator';
  }
  return '/dashboard/user';
};

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (token) {
      // Decode the token to extract user info and roles
      const decoded = decodeToken(token);
      
      // Build a minimal user object from the JWT claims so that
      // useAuth().user is populated immediately after OAuth login
      const userData = decoded ? {
        id: decoded.sub,
        email: decoded.email || decoded.sub,
        name: decoded.name || decoded.email || decoded.sub,
        roles: decoded.roles || [],
      } : null;

      // Store token AND update AuthContext so all consumers get the user
      login(userData, token);

      const dashboardPath = getDashboardPath(decoded?.roles);
      navigate(dashboardPath);
    } else {
      navigate('/login?error=No token received');
    }
  }, [searchParams, navigate, login]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <p>Processing login...</p>
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    </div>
  );
};

export default OAuthCallback;
