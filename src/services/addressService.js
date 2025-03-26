import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/addresses';

const addressService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar endereço com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar endereço:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar endereço com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar endereço com id ${id}:`, error);
      throw error;
    }
  },

  getAddresses: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await apiClient.get('/api/addresses/', {
        params: {
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },

  getAddress: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/addresses/', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
      throw error;
    }
  },

  getAddressById: async (id) => {
    try {
      const response = await apiClient.get(`/api/addresses/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário com id ${id}:`, error);
      throw error;
    }
  },
  getAddressByFullAddress: async (fullAddress) => {
    try {
      const response = await apiClient.get(`/api/addresses/?q=${fullAddress}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar ${fullAddress}:`, error);
      throw error;
    }
  },
  updateAddress: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/addresses/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar usuário com id ${id}:`, error);
      throw error;
    }
  },

  createAddress: async (data) => {
    try {
      const response = await apiClient.post('/api/addresses/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },
};

export default addressService;
