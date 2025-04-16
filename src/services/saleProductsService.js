import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/sales-products';
const saleProductsService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar informações intermediárias de venda e produtos:', error);
      throw error;
    }
  },
  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar informações intermediárias de venda e produtos com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar informações intermediárias de venda e produtos:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar informações intermediárias de venda e produtos com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar informações intermediárias de venda e produtos com id ${id}:`, error);
      throw error;
    }
  },

};

export default saleProductsService;
