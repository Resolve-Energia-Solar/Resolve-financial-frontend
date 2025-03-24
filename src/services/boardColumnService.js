import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/columns';

const columnService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar colunas:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar coluna com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar coluna:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar coluna com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar coluna com id ${id}:`, error);
      throw error;
    }
  },
  getColumns: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/columns/', { ...params });
      return response.data.results;
    } catch (error) {
      console.error('Erro ao buscar colunas:', error);
      throw error;
    }
  },
  getColumnById: async (id) => {
    try {
      const response = await apiClient.get(`/api/columns/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar coluna com id ${id}:`, error);
      throw error;
    }
  },

  updateColumnPut: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/columns/${id}/`, data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Erro ao editar coluna (PUT):', error.response.data);
      } else {
        console.error('Erro ao editar coluna (PUT):', error);
      }
      throw error;
    }
  },

  updateColumnPatch: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/columns/${id}/`, data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Erro ao editar coluna (PATCH):', error.response.data);
      } else {
        console.error('Erro ao editar coluna (PATCH):', error);
      }
      throw error;
    }
  },

  createColumn: async (data) => {
    try {
      const response = await apiClient.post('/api/columns/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar uma coluna:', error);
      throw error;
    }
  },

  deleteColumn: async (id, data) => {
    try {
      const response = await apiClient.delete(`/api/columns/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir coluna com id ${id}:`, error);
      throw error;
    }
  },
};

export default columnService;
