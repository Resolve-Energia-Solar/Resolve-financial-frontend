import apiClient from "./apiClient";

const roleService = {
  getCampaign: async () => {
    try {
      const response = await apiClient.get('/api/roles/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar roles:', error);
      throw error;
    }
  },

  getCampaignById: async (id) => {
    try {
      const response = await apiClient.get(`/api/roles/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar Campaign com id ${id}:`, error);
      throw error;
    }
  },

  updateCampaign: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/roles/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar Campaign com id ${id}:`, error);
      throw error;
    }
  },

  createCampaign: async (data) => {
    try {
      const response = await apiClient.post('/api/roles/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      throw error;
    }
  },
};

export default roleService;