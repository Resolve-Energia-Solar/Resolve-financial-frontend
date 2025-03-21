import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/payments';

const paymentService = {
  index: function (params) {
    try {
      const response = apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar pagamento com id ${id}:`, error);
      throw error;
    }
  },
  create: function (data) {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar pagamento com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar pagamento com id ${id}:`, error);
      throw error;
    }
  },

  getPayments: async ({ ordering, nextPage, userRole, limit = 25, page = 1, ...filters }) => {
    try {
      const params = {
        ordering: ordering || '',
        page: nextPage || page,
        limit,
        ...filters,
      };
      const response = await apiClient.get('/api/payments/', { params });
      console.log('Pagamentos:', response.data);
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
