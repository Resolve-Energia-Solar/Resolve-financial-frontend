import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/marketing-campaigns';

const campaignService = {
  index: function (params) {
    try {
      const response = apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar campanha com id ${id}:`, error);
      throw error;
    }
  },
  create: function (data) {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar camopanha:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar campanha com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar campanha com id ${id}:`, error);
      throw error;
    }
  },

  getCampaigns: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await apiClient.get('/api/marketing-campaigns/', {
        params: {
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar marketing-campaigns:', error);
      throw error;
    }
  },
  getCampaignByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/marketing-campaigns/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar Campaign com id ${name}:`, error);
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
  deleteCampaign: async (id) => {
    try {
      const response = await apiClient.delete(`/api/marketing-campaigns/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar campanha com id ${id}:`, error);
      throw error;
    }
  },
};

export default campaignService;
