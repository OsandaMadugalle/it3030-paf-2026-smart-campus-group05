import api from './api';

export const bookingService = {
  // Create a new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get current user's bookings
  getMyBookings: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get('/bookings/my', { params });
    return response.data;
  },

  // Get all bookings (admin/moderator)
  getAllBookings: async (filters = {}) => {
    const response = await api.get('/bookings', { params: filters });
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Approve a booking (moderator only)
  approveBooking: async (id, data) => {
    const response = await api.put(`/bookings/${id}/approve`, data);
    return response.data;
  },

  // Reject a booking (moderator only)
  rejectBooking: async (id, data) => {
    const response = await api.put(`/bookings/${id}/reject`, data);
    return response.data;
  },

  // Cancel a booking
  cancelBooking: async (id, reason) => {
    const response = await api.put(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  // Check for conflicts
  checkConflicts: async (resourceId, date, startTime, endTime) => {
    const params = { resourceId, date, startTime, endTime };
    const response = await api.get('/bookings/conflicts/check', { params });
    return response.data;
  },

  // Get bookings for a specific resource
  getResourceBookings: async (resourceId, date = null) => {
    const params = date ? { date } : {};
    const response = await api.get(`/bookings/resource/${resourceId}`, { params });
    return response.data;
  }
};