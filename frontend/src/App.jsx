import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loaded page components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const About = lazy(() => import('./pages/About'));
const Facilities = lazy(() => import('./pages/Facilities'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const ModeratorDashboard = lazy(() => import('./pages/ModeratorDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Booking Pages
const MyBookings = lazy(() => import('./pages/bookings/MyBookings'));
const CreateBooking = lazy(() => import('./pages/bookings/CreateBooking'));
const BookingSuccess = lazy(() => import('./pages/bookings/BookingSuccess'));
const AdminBookings = lazy(() => import('./pages/bookings/AdminBookings'));

// Notification Pages
const NotificationsPage = lazy(() => import('./pages/notifications/NotificationsPage'));
const MyNotificationAnalytics = lazy(() => import('./pages/notifications/MyNotificationAnalytics'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
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
              path="/bookings/success"
              element={
                <ProtectedRoute>
                  <BookingSuccess />
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

            {/* Notification Routes */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications/analytics"
              element={
                <ProtectedRoute>
                  <MyNotificationAnalytics />
                </ProtectedRoute>
              }
            />

            {/* Legacy dashboard redirect */}
            <Route path="/dashboard" element={<Navigate to="/dashboard/user" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
