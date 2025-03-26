import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/squads';
const squadService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar squads:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar squad com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar squad:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar squad com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar squad com id ${id}:`, error);
      throw error;
    }
  },

  getSquads: async () => {
    try {
      const response = await apiClient.get('/api/squads/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar squads:', error);
      throw error;
    }
  },

  getSquadById: async (id) => {
    try {
      const response = await apiClient.get(`/api/squads/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar squad com id ${id}:`, error);
      throw error;
    }
  },

  getSquadByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/squads/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar squad com nome ${name}:`, error);
      throw error;
    }
  },

  createSquad: async (data) => {
    try {
      const response = await apiClient.post('/api/squads/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar squad:', error);
      throw error;
    }
  },

  updateSquad: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/squads/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar squad com id ${id}:`, error);
      throw error;
    }
  },

  deleteSquad: async (id) => {
    try {
      const response = await apiClient.delete(`/api/squads/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar squad com id ${id}:`, error);
      throw error;
    }
  },
};

export default squadService;
