import apiClient from "./apiClient";

const phoneNumberService = {
  getPhoneNumbers: async () => {
    try {
      const response = await apiClient.get('/api/phone_numbers/');
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

