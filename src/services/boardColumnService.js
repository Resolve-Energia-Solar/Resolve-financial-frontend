import apiClient from './apiClient';

const columnService = {
  getColumns: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/columns/', { params });
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
};

export default columnService;
