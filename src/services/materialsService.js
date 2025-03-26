import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/materials';
const materialService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar materials:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar material com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar material:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar material com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar material com id ${id}:`, error);
      throw error;
    }
  },

  getMaterials: async ({ page = 1, limit = 10, ...filters } = {}) => {
    try {
      const url = `/api/materials/`;
      const response = await apiClient.get(url, {
        params: {
          page,
          limit,
          ...filters,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar materiais:', error);
      throw error;
    }
  },

  getMaterialById: async (id) => {
    try {
      const response = await apiClient.get(`/api/materials/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar material ID: ${id}`, error);
      throw error;
    }
  },

  getMaterialByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/materials/?name__icontains=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar material com nome: ${name}`, error);
      throw error;
    }
  },

  createMaterial: async (data) => {
    try {
      const response = await apiClient.post('/api/materials/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar material:', error);
      throw error;
    }
  },

  updateMaterial: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/materials/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar material ID: ${id}`, error);
      throw error;
    }
  },

  partialUpdateMaterial: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/materials/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao fazer update parcial no material ID: ${id}`, error);
      throw error;
    }
  },

  deleteMaterial: async (id) => {
    try {
      const response = await apiClient.delete(`/api/materials/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar material ID: ${id}`, error);
      throw error;
    }
  },
};

export default materialService;
