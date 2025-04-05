import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/process';

const processService = {
  find: async (id, params = {}) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
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
  completeStep: async (processId, stepId, requestBody) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${processId}/etapas/${stepId}/finish/`, requestBody);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  }
};

export default processService;
