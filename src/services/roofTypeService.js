import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/roof-types';
const RoofTypeService = {
  index: function (params) {
    try {
      const response = apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tipos de telhados:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar tipo de telhado com id ${id}:`, error);
      throw error;
    }
  },
  create: function (data) {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar tipo de telhado:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar tipo de telhado com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar tipo de telhado com id ${id}:`, error);
      throw error;
    }
  },
  getRoofTypes: async (ordering = '') => {
    const response = await apiClient.get(
      `/api/roof-types/${ordering ? `?ordering=${ordering}` : ''}`,
    );
    return response.data;
  },

  getRoofTypeById: async (id) => {
    const response = await apiClient.get(`/api/roof-types/${id}/`);
    return response.data;
  },

  getRoofTypeByName: async (name) => {
    const response = await apiClient.get(`/api/roof-types/?q=${name}`);
    return response.data;
  },

  createRoofType: async (data) => {
    const response = await apiClient.post('/api/roof-types/', data);
    return response.data;
  },

  updateRoofType: async (id, data) => {
    const response = await apiClient.put(`/api/roof-types/${id}/`, data);
    return response.data;
  },

  updateRoofTypePartial: async (id, data) => {
    const response = await apiClient.patch(`/api/roof-types/${id}/`, data);
    return response.data;
  },

  deleteRoofType: async (id) => {
    const response = await apiClient.delete(`/api/roof-types/${id}/`);
    return response.data;
  },
};

export default RoofTypeService;
