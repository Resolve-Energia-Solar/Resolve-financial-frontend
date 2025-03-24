import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/branches';

const branchService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar unidade com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar unidade:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar unidade com id ${id}:`, error);
      throw error;
    }
  },

  getBranches: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await apiClient.get('/api/branches/', {
        params: {
          page,
          limit,
        },
      });
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
      const response = await apiClient.get(`/api/branches/?name__icontains=${name}`);
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
