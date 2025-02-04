import apiClient from "./apiClient";

const paymentService = {
  getPayments: async ({ ordering, nextPage, userRole, limit = 25, page = 1, ...filters }) => {
    try {
      console.log('Buscando payments com os parâmetros:', { ordering, nextPage, userRole, limit, page, ...filters });

      const params = {
        ordering: ordering || '',
        page: nextPage || page,
        limit,
        ...filters,
      };

      const response = await apiClient.get('/api/payments/', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar payments:', error);
      throw error;
    }
  },
  
  getAllPaymentsBySale: async (saleId) => {
    try {
      const response = await apiClient.get(`/api/payments/?sale=${saleId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar payments pelo ID da venda:', error);
      throw error;
    }
  },
  getPaymentsBySale: async (saleId, fields) => {
    try {
      const response = await apiClient.get(`/api/payments/?sale=${saleId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar payments pelo ID da venda:', error);
      throw error;
    }
  },
  getPaymentById: async (id) => {
    try {
      const response = await apiClient.get(`/api/payments/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar payment por ID:', error);
      throw error;
    }
  },
  createPayment: async (data) => {
    try {
      const response = await apiClient.post('/api/payments/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar payment:', error);
      throw error;
    }
  },
  updatePayment: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/payments/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar payment:', error);
      throw error;
    }
  },
  deletePayment: async (id) => {
    try {
      const response = await apiClient.delete(`/api/payments/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar payment:', error);
      throw error;
    }
  },
};

export default paymentService;