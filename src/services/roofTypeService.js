import apiClient from './apiClient';

const roofTypeService = {
  getRoofTypes: async () => {
    try {
      const response = await apiClient.get('/api/roof-types/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tipos de telhados:', error);
      throw error;
    }
  },

  getRoofTypeByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/roof-types/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar tipo de telhado com nome ${name}:`, error);
      throw error;
    }
  },

  getRoofTypeById: async (id) => {
    try {
      const response = await apiClient.get(`/api/roof-types/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar tipo de telhado com id ${id}:`, error);
      throw error;
    }
  },

  updateRoofType: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/roof-types/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar tipo de telhado com id ${id}:`, error);
      throw error;
    }
  },

  patchRoofType: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/roof-types/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar tipo de telhado com id ${id}:`, error);
      throw error;
    }
  },

  createRoofType: async (data) => {
    try {
      const response = await apiClient.post('/api/roof-types/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar tipo de telhado:', error);
      throw error;
    }
  },

  deleteRoofType: async (id) => {
    try {
      const response = await apiClient.delete(`/api/roof-types/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir tipo de telhado com id ${id}:`, error);
      throw error;
    }
  },
};

export default roofTypeService;
