import apiClient from './apiClient';
const DEFAULT_ROUTER = '/api/departments';

const departmentService = {
  index: function (params) {
    try {
      const response = apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar departamentos:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar departamento com id ${id}:`, error);
      throw error;
    }
  },
  create: function (data) {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar departamento:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar departamento com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar departamento com id ${id}:`, error);
      throw error;
    }
  },

  getDepartment: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await apiClient.get('/api/departments/', {
        params: {
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar departamentos:', error);
      throw error;
    }
  },
  getDepartmentByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/departments/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar departamento com id ${name}:`, error);
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
  },
};

export default departmentService;
