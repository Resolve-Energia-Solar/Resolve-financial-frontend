import apiClient from './apiClient';

const leadService = {
  createLead: async (data) => {
    const response = await apiClient.post('/api/leads/', data);
    return response.data;
  },
  updateLead: async (leadId, data) => {
    try {
      const response = await apiClient.put(`/api/leads/${leadId}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro na requisição de atualização do lead:', error);
      throw error;
    }
  },
  deleteLead: async (leadId) => {
    const response = await apiClient.delete(`/api/leads/${leadId}/`);
    return response.data;
  },
  getLeadById: async (leadId) => {
    const response = await apiClient.get(`/api/leads/${leadId}/`);
    return response.data;
  },
};

export default leadService;
