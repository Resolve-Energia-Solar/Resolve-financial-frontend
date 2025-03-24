import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/notifications';

const notificationService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar notificação com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar notificação com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar notificação com id ${id}:`, error);
      throw error;
    }
  },

  getUnreadNotifications: async () => {
    const response = await apiClient.get('/api/notifications/?unread=true');
    return response.data;
  },
  getAllNotifications: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `/api/notifications/${queryParams ? '?' + queryParams : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  },
  getNotificationById: async (id) => {
    const response = await apiClient.get(`/api/notifications/${id}/`);
    return response.data;
  },
  createNotification: async (data) => {
    const response = await apiClient.post('/api/notifications/', data);
    return response.data;
  },
  updateNotification: async (id, data) => {
    const response = await apiClient.put(`/api/notifications/${id}/`, data);
    return response.data;
  },
  updateNotificationPartial: async (id, data) => {
    const response = await apiClient.patch(`/api/notifications/${id}/`, data);
    return response.data;
  },
  deleteNotification: async (id) => {
    const response = await apiClient.delete(`/api/notifications/${id}/`);
    return response.data;
  },
};

export default notificationService;
