import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/comercial-proposals';
const ProposalService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar propostas comerciais:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar proposta comercial com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar proposta comercial:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar proposta comercial com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar proposta comercial com id ${id}:`, error);
      throw error;
    }
  },

  getProposals: async (params = {}) => {
    const response = await apiClient.get(`/api/comercial-proposals/`, { ...params });
    return response.data;
  },
  getProposalByFullName: async (fullName) => {
    const response = await apiClient.get(`/api/comercial-proposals/?q=${fullName}`);
    return response.data;
  },
  getProposalById: async (id) => {
    const response = await apiClient.get(`/api/comercial-proposals/${id}/`);
    return response.data;
  },
  getProposalByLead: async (lead) => {
    const response = await apiClient.get(`/api/comercial-proposals/?lead=${lead}`);
    return response.data;
  },
  updateProposal: async (id, data) => {
    const response = await apiClient.put(`/api/comercial-proposals/${id}/`, data);
    return response.data;
  },

  updateProposalPartial: async (id, data) => {
    const response = await apiClient.patch(`/api/comercial-proposals/${id}/`, data);
    return response.data;
  },

  createProposal: async (data) => {
    const response = await apiClient.post(`/api/comercial-proposals/`, data);
    return response.data;
  },

  deleteProposal: async (id) => {
    const response = await apiClient.delete(`/api/comercial-proposals/${id}/`);
    return response.data;
  },
};

export default ProposalService;
