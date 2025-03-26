import apiClient from './apiClient';

const unitService = {
  getUnits: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await apiClient.get('/api/units/',
        {params: {
            page,
            limit
          }}
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar units:', error);
      throw error;
    }
  },
  getUnitsByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/units/?name__icontains=${name}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar units:', error);
      throw error;
    }
  },
  getUnitsByProject: async (projectID) => {
    try {
      const response = await apiClient.get(`/api/units/?project=${projectID}`);
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
  getUnitByIdProject: async (id, params = {}) => {
    try {
      const response = await apiClient.get(`/api/units/?project=${id}`, { params });
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
  getUnitById: async (unitId, params = {}) => {
    const response = await apiClient.get(`/api/units/${unitId}/`);
    return response.data;
  },
};

export default unitService;
