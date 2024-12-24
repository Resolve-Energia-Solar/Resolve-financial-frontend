import apiClient from "./apiClient";

const branchService = {
  getBranches: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await apiClient.get('/api/branches/',
        {
          params: {
            page,
            limit
          }
        }
      );
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
  getBranchByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/branches/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar branch com id ${name}:`, error);
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
  deleteBranch: async (id) => {
    try {
      const response = await apiClient.delete(`/api/branches/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar branch com id ${id}:`, error);
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