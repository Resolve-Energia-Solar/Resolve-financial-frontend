import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/franchise-installments';

const commissionService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar comissão:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar comissão com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar comissão:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar comissão com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar comissão com id ${id}:`, error);
      throw error;
    }
  },

  id: 1,
  getId: async () => {
    return this.id;
  },
  setid: async (id) => {
    this.id = id;
  },
  getCommissiomAll: async () => {
    try {
      const response = await apiClient.get('/api/franchise-installments/?expand=sale');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar as vendas:', error);
      throw error;
    }
  },
  getComissionId: async (id) => {
    try {
      const response = await apiClient.get(`/api/franchise-installments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar as vendas:', error);
      throw error;
    }
  },

  updateComissionId: async (id) => {
    try {
      const response = await apiClient.put(`/api/franchise-installments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar as vendas:', error);
      throw error;
    }
  },

  patchComissionId: async (id) => {
    try {
      const response = await apiClient.patch(`/api/franchise-installments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar as vendas:', error);
      throw error;
    }
  },

  createComissionId: async (id) => {
    try {
      const response = await apiClient.post(`/api/franchise-installments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar as vendas:', error);
      throw error;
    }
  },

  deleteComissionId: async (id) => {
    try {
      const response = await apiClient.delete(`/api/franchise-installments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar as vendas:', error);
      throw error;
    }
  },
};

export default commissionService;
