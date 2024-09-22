import apiClient from "./apiClient";

const sectorService = {
  getSector: async () => {
    try {
      const response = await apiClient.get('/api/departments/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar departments:', error);
      throw error;
    }
  },

  getSectorById: async (id) => {
    try {
      const response = await apiClient.get(`/api/departments/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar departments com id ${id}:`, error);
      throw error;
    }
  },

  updateSector: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/departments/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar departments com id ${id}:`, error);
      throw error;
    }
  },

  createSector: async (data) => {
    try {
      const response = await apiClient.post('/api/departments/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar departments:', error);
      throw error;
    }
  },
};

export default sectorService;