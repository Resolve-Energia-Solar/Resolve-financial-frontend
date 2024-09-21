import apiClient from "./apiClient";

const branchService = {
  getBranch: async () => {
    try {
      const response = await apiClient.get('/api/branches/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar branches:', error);
      throw error;
    }
  },

  getBranchById: async (id) => {
    try {
      const response = await apiClient.get(`/api/branches/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar branch com id ${id}:`, error);
      throw error;
    }
  },

  updateBranch: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/branches/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar branch com id ${id}:`, error);
      throw error;
    }
  },

  createBranch: async (data) => {
    try {
      const response = await apiClient.post('/api/branches/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar branch:', error);
      throw error;
    }
  },
};

export default branchService;