import { create } from "lodash";
import apiClient from "./apiClient";

const financierService = {
  getFinanciers: async (filters = {}) => {
    try {
      const response = await apiClient.get('/api/financiers/', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar financiers:', error);
      throw error;
    }
  },
  getFinancierById: async (id) => {
    try {
      const response = await apiClient.get(`/api/financiers/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar o financier:', error);
      throw error;
    }
  },
};

export default financierService;