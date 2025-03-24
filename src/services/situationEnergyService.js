import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/situation-energy-companies';
const situationEnergyService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar solicitação com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar solicitação com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar solicitação com id ${id}:`, error);
      throw error;
    }
  },

  getSituations: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/situation-energy-companies/', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar solicitação:', error);
      throw error;
    }
  },
  findOne: async (id) => {
    try {
      const response = await apiClient.get(`/api/situation-energy-companies/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar solicitação com id ${id}:`, error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/situation-energy-companies/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar solicitação com id ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await apiClient.post('/api/situation-energy-companies/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      throw error;
    }
  },
};

export default situationEnergyService;
