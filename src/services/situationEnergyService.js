import apiClient from "./apiClient";

const situationEnergyService = {
  getSituations: async (params={}) => {
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
