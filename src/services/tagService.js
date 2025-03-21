import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/tags';
const tagService = {
  index: function (params) {
    try {
      const response = apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tags:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar tag com id ${id}:`, error);
      throw error;
    }
  },
  create: function (data) {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar tag com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar tag com id ${id}:`, error);
      throw error;
    }
  },

  getTags: async ({ page = 1, limit = 10, ...filters } = {}) => {
    try {
      const response = await apiClient.get('/api/tags/', {
        params: { page, limit, ...filters },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tags:', error);
      throw error;
    }
  },
  createTag: async (data) => {
    const response = await apiClient.post('/api/tags/', data);
    return response.data;
  },
  updateTag: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/tags/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro na requisição de atualização do tag:', error);
      console.error('Dados enviados:', data);
      throw error;
    }
  },
  patchTag: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/tags/${id}/`, data);
      console.log('patchTag response:', response);
      return response.data;
    } catch (error) {
      console.error('Erro na requisição de atualização do tag:', error);
      console.error('Dados enviados:', data);
      throw error;
    }
  },
  deleteTag: async (tagId) => {
    const response = await apiClient.delete(`/api/tags/${tagId}/`);
    return response.data;
  },
};

export default tagService;
