import apiClient from "./apiClient";

const departamentService = {
  getDepartament: async () => {
    try {
      const response = await apiClient.get('/api/departments/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar departamentos:', error);
      throw error;
    }
  },

  getDepartamentById: async (id) => {
    try {
      const response = await apiClient.get(`/api/departments/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar departamento com id ${id}:`, error);
      throw error;
    }
  },

  updateDepartament: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/departments/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar departamento com id ${id}:`, error);
      throw error;
    }
  },

  createDepartament: async (data) => {
    try {
      const response = await apiClient.post('/api/departments/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar departamento:', error);
      throw error;
    }
  },

  deleteDepartament: async (id) => {
    try {
      const response = await apiClient.delete(`/api/departments/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar departamento com id ${id}:`, error);
      throw error;
    }
  }
};

export default departamentService;
