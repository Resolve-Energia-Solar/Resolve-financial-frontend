import { find } from 'lodash';
import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/reasons';
const serviceReason = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pareceres:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar parecer com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar parecer:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar parecer com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar parecer com id ${id}:`, error);
      throw error;
    }
  },

  getReason: async ({ ordering, nextPage, limit = 5, page = 1, ...rest }) => {
    const params = {
      ordering: ordering || '',
      page: nextPage || page,
      ...rest,
    };

    const response = await apiClient.get(`/api/reasons/`, { params });
    return response.data;
  },

  findReason: async (id) => {
    try {
      const response = await apiClient.get(`/api/reasons/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar parecer com id ${id}:`, error);
      throw error;
    }
  },

  updateReason: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/reasons/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar parecer com id ${id}:`, error);
      throw error;
    }
  },

  createReason: async (data) => {
    try {
      const response = await apiClient.post('/api/reasons/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar parecer:', error);
      throw error;
    }
  },

  deleteReason: async (id) => {
    try {
      const response = await apiClient.delete(`/api/reasons/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar parecer com id ${id}:`, error);
      throw error;
    }
  },
};

export default serviceReason;
