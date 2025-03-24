import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/supply-adequances';
const supplyService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar adequações de fornecimento:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar adequação de fornecimento com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar adequação de fornecimento:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar adequação de fornecimento com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar adequação de fornecimento com id ${id}:`, error);
      throw error;
    }
  },
  getSupplyAd: async ({ page = 1, limit = 10 } = {}) => {
    const response = await apiClient.get(`/api/supply-adequances/`, { params: { page, limit } });
    return response.data;
  },
  getSupplyAdById: async (id) => {
    const response = await apiClient.get(`/api/supply-adequances/${id}/`);
    return response.data;
  },
  getFieldsDocuments: async (document) => {
    const response = await apiClient.post(`/api/fatura/`, document);
    return response.data;
  },
  getSupplyByName: async (name) => {
    const response = await apiClient.get(`/api/supply-adequances/?name__icontains=${name}`);
    return response.data;
  },
  updateSupplyAd: async (id, data) => {
    const response = await apiClient.put(`/api/supply-adequances/${id}/`, data);
    return response.data;
  },

  createSupplyAd: async (data) => {
    const response = await apiClient.post(`/api/supply-adequances/`, data);
    return response.data;
  },

  deleteSupplyAd: async (id) => {
    const response = await apiClient.delete(`/api/supply-adequances/${id}/`);
    return response.data;
  },
};

export default supplyService;
