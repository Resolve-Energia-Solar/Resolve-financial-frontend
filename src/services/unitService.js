import apiClient from './apiClient';

const unitService = {
  getUnits: async () => {
    try {
      const response = await apiClient.get('/api/units/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar units:', error);
      throw error;
    }
  },
  createUnit: async (data) => {
    const response = await apiClient.post('/api/units/', data);
    return response.data;
  },
  updateUnit: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/units/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro na requisição de atualização do unit:', error);
      console.error('Dados enviados:', data);
      throw error;
    }
  },
  patchUnit: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/units/${id}/`, data);
      console.log('patchUnit response:', response);
      return response.data;
    } catch (error) {
      console.error('Erro na requisição de atualização do unit:', error);
      console.error('Dados enviados:', data);
      throw error;
    }
  },
  getUnitByIdProject: async (id) => {
    try {
      const response = await apiClient.get(`/api/units/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar unit com nome ${id}:`, error);
      throw error;
    }
  },
  
  deleteUnit: async (unitId) => {
    const response = await apiClient.delete(`/api/units/${unitId}/`);
    return response.data;
  },
  getUnitById: async (unitId) => {
    const response = await apiClient.get(`/api/units/${unitId}/`);
    return response.data;
  },
};

export default unitService;
