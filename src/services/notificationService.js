import apiClient from './apiClient'

const notificationService = {
  getUnreadNotifications: async () => {
    const response = await apiClient.get('/api/notifications/?unread=true')
    return response.data
  },
  getAllNotifications: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `/api/notifications/${queryParams ? '?' + queryParams : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  },
  getNotificationById: async id => {
    const response = await apiClient.get(`/api/notifications/${id}/`)
    return response.data
  },
  createNotification: async data => {
    const response = await apiClient.post('/api/notifications/', data)
    return response.data
  },
  updateNotification: async (id, data) => {
    const response = await apiClient.put(`/api/notifications/${id}/`, data)
    return response.data
  },
  updateNotificationPartial: async (id, data) => {
    const response = await apiClient.patch(`/api/notifications/${id}/`, data)
    return response.data
  },
  deleteNotification: async id => {
    const response = await apiClient.delete(`/api/notifications/${id}/`)
    return response.data
  },
}

export default notificationService
