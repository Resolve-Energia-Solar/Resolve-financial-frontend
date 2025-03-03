import apiClient from './apiClient';

const serviceReason = {
  getReason: async ({ ordering, nextPage, limit = 5, page = 1, ...rest }) => {

    
    const params = {
      ordering: ordering || '',
      page: nextPage || page,
      ...rest
    }

    const response = await apiClient.get(`/api/reasons/`, { params });
    return response.data;
  },

  updateReason: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/reasons/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar parecer com id ${id}:`, error);
      throw error;
    }
  },

  createReason: async (data) => {
    try {
      const response = await apiClient.post('/api/reasons/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar parecer:', error);
      throw error;
    }
  },

  deleteReason: async (id) => {
    try {
      const response = await apiClient.delete(`/api/reasons/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar parecer com id ${id}:`, error);
      throw error;
    }
  },
};

export default serviceReason;
