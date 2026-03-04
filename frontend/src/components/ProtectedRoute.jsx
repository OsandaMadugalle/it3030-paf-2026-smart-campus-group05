import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, hasRole } = useRole();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role (if any specified)
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => hasRole(role));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
