import apiClient from './apiClient';

const squadService = {
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
