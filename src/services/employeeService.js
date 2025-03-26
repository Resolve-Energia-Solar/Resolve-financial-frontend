import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/employees';
const employeeService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar funcionário com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar funcionário com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar funcionário com id ${id}:`, error);
      throw error;
    }
  },

  getEmployee: async ({ page = 1, limit = 10, filters = {} } = {}) => {
    try {
      const response = await apiClient.get('/api/employees/', {
        params: {
          page,
          limit,
          ...filters,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      throw error;
    }
  },
  updateEmployee: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/employees/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar funcionário com id ${id}:`, error);
      throw error;
    }
  },
  putEmployee: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/employees/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar funcionário com id ${id}:`, error);
      throw error;
    }
  },
  createEmployee: async (data) => {
    try {
      const response = await apiClient.post('/api/employees/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      throw error;
    }
  },
  deleteEmployee: async (id) => {
    try {
      const response = await apiClient.delete(`/api/employees/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar funcionário com id ${id}:`, error);
      throw error;
    }
  },
  login: async (data) => {
    try {
      const response = await apiClient.post('/api/login/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },
};

export default employeeService;
