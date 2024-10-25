import { create } from "lodash";
import apiClient from "./apiClient";

const paymentService = {
  getPayments: async () => {
    try {
      const response = await apiClient.get('/api/payments/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar payments:', error);
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
};

export default paymentService;