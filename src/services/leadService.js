import apiClient from './apiClient';

const leadService = {
  getLeads: async () => {
    try {
      const response = await apiClient.get('/api/leads/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      throw error;
    }
  },
  createLead: async (data) => {
    const response = await apiClient.post('/api/leads/', data);
    return response.data;
  },
  updateLead: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/leads/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro na requisição de atualização do lead:', error);
      console.error('Dados enviados:', data);
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
