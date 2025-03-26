import { create } from 'lodash';
import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/financiers';
const financierService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar financeiras:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar financeira com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar financeira:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar financeira com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar financeira com id ${id}:`, error);
      throw error;
    }
  },

  getFinanciers: async (filters = {}) => {
    try {
      const response = await apiClient.get('/api/financiers/', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar financiers:', error);
      throw error;
    }
  },
  getFinancierById: async (id) => {
    try {
      const response = await apiClient.get(`/api/financiers/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar o financier:', error);
      throw error;
    }
  },
};

export default financierService;
