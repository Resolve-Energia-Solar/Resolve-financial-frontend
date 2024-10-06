import apiClient from "./apiClient";

const campaignService = {
  getCampaigns: async () => {
    try {
      const response = await apiClient.get('/api/marketing-campaigns/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar marketing-campaigns:', error);
      throw error;
    }
  },

  getCampaignById: async (id) => {
    try {
      const response = await apiClient.get(`/api/marketing-campaigns/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar Campaign com id ${id}:`, error);
      throw error;
    }
  },

  updateCampaign: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/marketing-campaigns/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar Campaign com id ${id}:`, error);
      throw error;
    }
  },
  patchCampaign: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/marketing-campaigns/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar Campaign com id ${id}:`, error);
      throw error;
    }
  },
  createCampaign: async (data) => {
    try {
      const response = await apiClient.post('/api/marketing-campaigns/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      throw error;
    }
  },
};

export default campaignService;