import apiClient from "./apiClient";

const departmentService = {
  getDepartment: async () => {
    try {
      const response = await apiClient.get('/api/departments/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar departamentos:', error);
      throw error;
    }
  },

  getDepartmentById: async (id) => {
    try {
      const response = await apiClient.get(`/api/departments/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar departamento com id ${id}:`, error);
      throw error;
    }
  },

  updateDepartment: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/departments/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar departamento com id ${id}:`, error);
      throw error;
    }
  },

  createDepartment: async (data) => {
    try {
      const response = await apiClient.post('/api/departments/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar departamento:', error);
      throw error;
    }
  },

  deleteDepartment: async (id) => {
    try {
      const response = await apiClient.delete(`/api/departments/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar departamento com id ${id}:`, error);
      throw error;
    }
  }
};

export default departmentService;
