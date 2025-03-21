import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/tasks';

const taskService = {
  index: async (params = {}) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  },
  find: async (id, params = {}) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  },
  create: async (body) => {
    try {
      const response = await apiClient.post(`${DEFAULT_ROUTER}/`, body);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  },
  update: async (id, body) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, body);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await apiClient.post(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  },
};

export default taskService;
