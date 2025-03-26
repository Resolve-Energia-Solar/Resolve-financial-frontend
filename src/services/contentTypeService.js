import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/content-types';
const contentType = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar content-types:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar content-types com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar content-types:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar content-types com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar content-types com id ${id}:`, error);
      throw error;
    }
  },

  find: async (appLabel, model = {}) => {
    const response = await apiClient.get(
      `/api/content-types/?app_label__in=${appLabel}&model__in=${model}`,
    );
    return response.data;
  },
  index: async function (params) {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params: params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  },
  update: async function (id, body) {
    try {
      const response = await apiClient.put(`${DEFAULT_ROUTER}/${id}/`, body);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  },
  delete: async function (id) {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  },
  create: async function (body) {
    try {
      const response = await apiClient.post(`${DEFAULT_ROUTER}/`, body);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  },
};

export default contentType;
