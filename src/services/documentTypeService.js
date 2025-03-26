import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/document-types';
const documentTypeService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar document-types:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar document-type com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar document-type:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar document-type com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar document-type com id ${id}:`, error);
      throw error;
    }
  },

  getDocumentTypes: async ({ page = 1, limit = 50, filters = {} } = {}) => {
    const response = await apiClient.get(`/api/document-types/`, {
      params: { limit, page, ...filters },
    });
    return response.data;
  },
  getDocumentTypeById: async (id) => {
    const response = await apiClient.get(`/api/document-types/${id}/`);
    return response.data;
  },
  Aqw34: async (limit = 30) => {
    const response = await apiClient.get(`/api/document-types/`, {
      params: { app_label__in: 'engineering', limit },
    });
    return response.data;
  },
  getDocumentTypeFromContract: async (limit = 30) => {
    const response = await apiClient.get(`/api/document-types/`, {
      params: { app_label__in: 'contracts', limit },
    });
    return response.data;
  },
  updateDocumentType: async (id, data) => {
    const response = await apiClient.put(`/api/document-types/${id}/`, data);
    return response.data;
  },
  createDocumentType: async (data) => {
    const response = await apiClient.post(`/api/document-types/`, data);
    return response.data;
  },
  deleteDocumentType: async (id) => {
    const response = await apiClient.delete(`/api/document-types/${id}/`);
    return response.data;
  },
};

export default documentTypeService;
