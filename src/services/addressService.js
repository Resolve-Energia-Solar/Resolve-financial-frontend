import apiClient from "./apiClient";

const AddressService = {
  getAddress: async () => {
    try {
      const response = await apiClient.get('/api/addresses/');
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

export default AddressService;
