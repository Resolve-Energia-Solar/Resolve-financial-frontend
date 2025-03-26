import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/origins';
const OriginsService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar origens:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar origem com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar origem:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar origem com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar origem com id ${id}:`, error);
      throw error;
    }
  },

  getOriginsList: async () => {
    const response = await apiClient.get('/api/origins/');
    return response.data;
  },

  createOrigin: async (data) => {
    const response = await apiClient.post('/api/origins/', data);
    return response.data;
  },

  getOriginById: async (id) => {
    const response = await apiClient.get(`/api/origins/${id}/`);
    return response.data;
  },

  updateOrigin: async (id, data) => {
    const response = await apiClient.put(`/api/origins/${id}/`, data);
    return response.data;
  },

  updateOriginPartial: async (id, data) => {
    const response = await apiClient.patch(`/api/origins/${id}/`, data);
    return response.data;
  },

  deleteOrigin: async (id) => {
    const response = await apiClient.delete(`/api/origins/${id}/`);
    return response.data;
  },
};

export default OriginsService;
