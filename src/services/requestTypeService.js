import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/resquest-types';

const RequestTypeService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
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
  create: async (data) => {
    try {
      const response = await apiClient.post(`${DEFAULT_ROUTER}/`, data);
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

  getTypes: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await apiClient.get('/api/resquest-types/', {
        params: {
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar as companhias de energias:', error);
      throw error;
    }
  },
  getTypeByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/resquest-types/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar departamento com id ${name}:`, error);
      throw error;
    }
  },
  getTypeById: async (id) => {
    try {
      const response = await apiClient.get(`/api/resquest-types/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar departamento com id ${id}:`, error);
      throw error;
    }
  },

  updateType: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/resquest-types/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar departamento com id ${id}:`, error);
      throw error;
    }
  },

  createType: async (data) => {
    try {
      const response = await apiClient.post('/api/resquest-types/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar departamento:', error);
      throw error;
    }
  },

  deleteType: async (id) => {
    try {
      const response = await apiClient.delete(`/api/resquest-types/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar departamento com id ${id}:`, error);
      throw error;
    }
  },
};

export default RequestTypeService;
