import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/solar-energy-kits';
const KitSolarService = {
  index: function (params) {
    try {
      const response = apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produto com id ${id}:`, error);
      throw error;
    }
  },
  create: function (data) {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar produto com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar produto com id ${id}:`, error);
      throw error;
    }
  },

  getKitSolar: async (ordering = '') => {
    const response = await apiClient.get(`/api/solar-energy-kits/?ordering=${ordering}`);
    return response.data;
  },
  getKitSolarByFullName: async (fullName) => {
    const response = await apiClient.get(`/api/solar-energy-kits/?q=${fullName}`);
    return response.data;
  },

  getKitSolarById: async (id) => {
    const response = await apiClient.get(`/api/solar-energy-kits/${id}/`);
    return response.data;
  },

  updateKitSolar: async (id, data) => {
    const response = await apiClient.put(`/api/solar-energy-kits/${id}/`, data);
    return response.data;
  },

  updateKitSolarPartial: async (id, data) => {
    const response = await apiClient.patch(`/api/solar-energy-kits/${id}/`, data);
    return response.data;
  },

  createKitSolar: async (data) => {
    const response = await apiClient.post(`/api/solar-energy-kits/`, data);
    return response.data;
  },

  deleteKitSolar: async (id) => {
    const response = await apiClient.delete(`/api/solar-energy-kits/${id}/`);
    return response.data;
  },
};

export default KitSolarService;
