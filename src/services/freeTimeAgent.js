import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/free-time-agent';
const freeTimeAgentService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      throw error;
    }
  },
  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar horários disponíveis com id ${id}:`, error);
      throw error;
    }
  },
};

export default freeTimeAgentService;
