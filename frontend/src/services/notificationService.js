import api from './api';

const notificationService = {
  getMyNotifications: async (page = 0, size = 10) => {
    const response = await api.get(`/notifications/my?page=${page}&size=${size}`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/my/unread-count');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  clearAllNotifications: async () => {
    const response = await api.delete('/notifications/clear-all');
    return response.data;
  },

  sendNotification: async (data) => {
    const response = await api.post('/notifications/send', data);
    return response.data;
  },

  sendBulkNotification: async (data) => {
    const response = await api.post('/notifications/send-bulk', data);
    return response.data;
  },

  broadcastNotification: async (data) => {
    const response = await api.post('/notifications/broadcast', data);
    return response.data;
  },

  getMyAnalytics: async () => {
    const response = await api.get('/notifications/analytics/my');
    return response.data;
  },

  getSystemAnalytics: async () => {
    const response = await api.get('/notifications/analytics/system');
    return response.data;
  },

  getMyPreferences: async () => {
    const response = await api.get('/notifications/preferences/my');
    return response.data;
  },

  updateMyPreferences: async (data) => {
    const response = await api.put('/notifications/preferences/my', data);
    return response.data;
  },

  updateSinglePreference: async (key, value) => {
    // Current state fetch
    const prefsResponse = await api.get('/notifications/preferences/my');
    const updatedPrefs = { ...prefsResponse.data, [key]: value };
    const response = await api.put('/notifications/preferences/my', updatedPrefs);
    return response.data;
  },

  muteNotifications: async (hours) => {
    const response = await api.put('/notifications/preferences/mute', { hours });
    return response.data;
  },

  unmuteNotifications: async () => {
    const response = await api.put('/notifications/preferences/unmute');
    return response.data;
  },

  deleteNotification: async (id) => {
    await api.delete(`/notifications/${id}`);
  }
};

export default notificationService;
