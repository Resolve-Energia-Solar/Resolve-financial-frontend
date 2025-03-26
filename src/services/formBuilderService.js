import apiClient from './apiClient';
import serviceCatalogService from './serviceCatalogService';

const DEFAULT_ROUTER = '/api/forms';
const formBuilderService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar formulários:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar formulário com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar formulário:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar formulário com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar formulário com id ${id}:`, error);
      throw error;
    }
  },
  getForms: async () => {
    try {
      const response = await apiClient.get('/api/forms/');
      const formattedResults = await Promise.all(
        response.data.results.map(async (item) => {
          const serviceData = await serviceCatalogService.getServiceCatalogByFormId(item.id);
          return {
            ...item,
            service: serviceData.results[0] || null,
          };
        }),
      );
      return formattedResults;
    } catch (error) {
      console.error('Erro ao buscar formulários:', error);
      throw error;
    }
  },

  getFormById: async (id) => {
    try {
      const response = await apiClient.get(`/api/forms/${id}/`);
      const serviceData = await serviceCatalogService.getServiceCatalogByFormId(id);
      return {
        ...response.data,
        service: serviceData.results[0] || null,
      };
    } catch (error) {
      console.error(`Erro ao buscar formulário com id ${id}:`, error);
      throw error;
    }
  },

  getFormByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/forms/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar formulário com nome ${name}:`, error);
      throw error;
    }
  },

  updateForm: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/forms/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar formulário com id ${id}:`, error);
      throw error;
    }
  },

  createForm: async (data) => {
    try {
      const response = await apiClient.post('/api/forms/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar formulário:', error);
      throw error;
    }
  },

  deleteForm: async (id) => {
    try {
      const response = await apiClient.delete(`/api/forms/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar formulário com id ${id}:`, error);
      throw error;
    }
  },
};

export default formBuilderService;
