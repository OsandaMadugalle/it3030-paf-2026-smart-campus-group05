import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Login from './pages/Login';
import OAuthCallback from './pages/OAuthCallback';
import Unauthorized from './pages/Unauthorized';
import UserDashboard from './pages/UserDashboard';
import ModeratorDashboard from './pages/ModeratorDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Booking Pages
import MyBookings from './pages/bookings/MyBookings';
import CreateBooking from './pages/bookings/CreateBooking';
import AdminBookings from './pages/bookings/AdminBookings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth2/callback" element={<OAuthCallback />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* User Dashboard - all authenticated users */}
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

          {/* Booking Routes */}
          <Route
            path="/bookings/my"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/create"
            element={
              <ProtectedRoute>
                <CreateBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
                <AdminBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/moderator/bookings"
            element={
              <ProtectedRoute requiredRoles={['ROLE_MODERATOR', 'ROLE_ADMIN']}>
                <AdminBookings />
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
