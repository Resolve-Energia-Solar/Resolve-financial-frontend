import apiClient from "./apiClient";

const addressService = {
  getAddresses: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await apiClient.get('/api/addresses/',
        {
          params: {
            page,
            limit
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
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
