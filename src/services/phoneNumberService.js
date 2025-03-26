import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/phone_numbers';

const phoneNumberService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar númeross de telefone:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar número de telefone com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar número de telefone:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar número de telefone com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar número de telefone com id ${id}:`, error);
      throw error;
    }
  },

  getPhoneNumbers: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await apiClient.get('/api/phone_numbers/', {
        params: {
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar telefones:', error);
      throw error;
    }
  },

  getPhoneNumberById: async (id) => {
    try {
      const response = await apiClient.get(`/api/phone_numbers/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar telefone com id ${id}:`, error);
      throw error;
    }
  },
  getPhoneNumbersByQuery: async (query) => {
    try {
      const response = await apiClient.get(`/api/phone_numbers/?phone_number__icontains=${query}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar telefone com query ${query}:`, error);
      throw error;
    }
  },
  getPhoneNumberByFullAddress: async (fullAddress) => {
    try {
      const response = await apiClient.get(`/api/phone_numbers/?q=${fullAddress}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar ${fullAddress}:`, error);
      throw error;
    }
  },
  updatePhoneNumber: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/phone_numbers/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar telefone com id ${id}:`, error);
      throw error;
    }
  },

  createPhoneNumber: async (data) => {
    try {
      const response = await apiClient.post('/api/phone_numbers/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar telefone:', error);
      throw error;
    }
  },
};

export default phoneNumberService;
