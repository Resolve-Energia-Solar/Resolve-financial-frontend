import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/roles';
const roleService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cargos:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar cargo com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cargo:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar cargo com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar cargo com id ${id}:`, error);
      throw error;
    }
  },
  getRole: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await apiClient.get('/api/roles/', {
        params: {
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar roles:', error);
      throw error;
    }
  },
  getRoleByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/roles/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar role com id ${name}:`, error);
      throw error;
    }
  },
  getRoleById: async (id) => {
    try {
      const response = await apiClient.get(`/api/roles/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar Campaign com id ${id}:`, error);
      throw error;
    }
  },

  updateRole: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/roles/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar Campaign com id ${id}:`, error);
      throw error;
    }
  },

  createRole: async (data) => {
    try {
      const response = await apiClient.post('/api/roles/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar setor:', error);
      throw error;
    }
  },
  deleteRole: async (id) => {
    try {
      const response = await apiClient.delete(`/api/roles/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar setor com id ${id}:`, error);
      throw error;
    }
  },
};

export default roleService;
