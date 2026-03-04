import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { useRole } from './hooks/useRole';

// Pages
import Login from './pages/Login';
import OAuthCallback from './pages/OAuthCallback';
import Unauthorized from './pages/Unauthorized';
import UserDashboard from './pages/UserDashboard';
import ModeratorDashboard from './pages/ModeratorDashboard';
import AdminDashboard from './pages/AdminDashboard';
=======
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import OAuthCallback from './pages/OAuthCallback';
import Dashboard from './pages/Dashboard';

// Placeholder components
const RegisterPage = () => <div>Register Page (Placeholder)</div>;
const Home = () => <div>Home Page (Placeholder)</div>;
>>>>>>> develop

// Home component with navigation
const Home = () => {
  const { isAuthenticated, isAdmin, isModerator, getUserInfo } = useRole();
  const userInfo = getUserInfo();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Smart Campus</h1>
      
      {isAuthenticated ? (
        <div>
          <p>Welcome, {userInfo?.name || 'User'}!</p>
          
          <nav style={{ marginTop: '20px' }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/dashboard/user" style={{ color: '#007bff' }}>User Dashboard</Link>
              </li>
              {(isModerator() || isAdmin()) && (
                <li style={{ marginBottom: '10px' }}>
                  <Link to="/dashboard/moderator" style={{ color: '#007bff' }}>Moderator Dashboard</Link>
                </li>
              )}
              {isAdmin() && (
                <li style={{ marginBottom: '10px' }}>
                  <Link to="/dashboard/admin" style={{ color: '#007bff' }}>Admin Dashboard</Link>
                </li>
              )}
            </ul>
          </nav>
          
          <button 
            onClick={handleLogout}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p>Please login to continue</p>
          <Link 
            to="/login"
            style={{
              display: 'inline-block',
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '5px'
            }}
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth2/callback" element={<OAuthCallback />} />
<<<<<<< HEAD
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* User Dashboard - all authenticated users */}
=======
          <Route path="/register" element={<RegisterPage />} />
>>>>>>> develop
          <Route 
            path="/dashboard/user" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Moderator Dashboard - MODERATOR and ADMIN only */}
          <Route 
            path="/dashboard/moderator" 
            element={
              <ProtectedRoute requiredRoles={['ROLE_MODERATOR', 'ROLE_ADMIN']}>
                <ModeratorDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Dashboard - ADMIN only */}
          <Route 
            path="/dashboard/admin" 
            element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Legacy dashboard redirect */}
          <Route path="/dashboard" element={<Navigate to="/dashboard/user" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
