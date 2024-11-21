import apiClient from "./apiClient";

const requestConcessionaireService = {
  index: async () => {
    try {
      const response = await apiClient.get('/api/requests-energy-companies/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar solicitação:', error);
      throw error;
    }
  },

  findOne: async (id) => {
    try {
      const response = await apiClient.get(`/api/requests-energy-companies/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar solicitação com id ${id}:`, error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/requests-energy-companies/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar solicitação com id ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await apiClient.post('/api/requests-energy-companies/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      throw error;
    }
  },
};

export default requestConcessionaireService;
