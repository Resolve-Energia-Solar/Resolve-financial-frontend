import apiClient from './apiClient';

const serviceCatalogService = {
  getServicesCatalog: async () => {
    try {
      const response = await apiClient.get('/api/services/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar catálogo de serviços:', error);
      throw error;
    }
  },

  getServiceCatalogById: async (id) => {
    try {
      const response = await apiClient.get(`/api/services/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar serviço com id ${id}:`, error);
      throw error;
    }
  },

  getServiceCatalogByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/services/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar serviço com nome ${name}:`, error);
      throw error;
    }
  },

  updateServiceCatalog: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/services/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar serviço com id ${id}:`, error);
      throw error;
    }
  },

  createServiceCatalog: async (data) => {
    try {
      const response = await apiClient.post('/api/services/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      throw error;
    }
  },

  deleteServiceCatalog: async (id) => {
    try {
      const response = await apiClient.delete(`/api/services/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar serviço com id ${id}:`, error);
      throw error;
    }
  },
};

export default serviceCatalogService;
