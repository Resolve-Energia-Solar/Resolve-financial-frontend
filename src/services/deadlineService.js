import apiClient from './apiClient';

const deadlineService = {
  getDeadlines: async () => {
    try {
      const response = await apiClient.get('/api/deadlines/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar prazos:', error);
      throw error;
    }
  },

  getDeadlineById: async (id) => {
    try {
      const response = await apiClient.get(`/api/deadlines/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar prazo com id ${id}:`, error);
      throw error;
    }
  },

  getDeadlineByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/deadlines/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar prazo com nome ${name}:`, error);
      throw error;
    }
  },

  updateDeadline: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/deadlines/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar prazo com id ${id}:`, error);
      throw error;
    }
  },

  createDeadline: async (data) => {
    try {
      const response = await apiClient.post('/api/deadlines/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar prazo:', error);
      throw error;
    }
  },

  deleteDeadline: async (id) => {
    try {
      const response = await apiClient.delete(`/api/deadlines/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar prazo com id ${id}:`, error);
      throw error;
    }
  },
};

export default deadlineService;
