import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/services';
const serviceCatalogService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar serviço com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar serviço com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar serviço com id ${id}:`, error);
      throw error;
    }
  },

  getServicesCatalog: async (options = {}) => {
    const { filters, expand, fields, ...rest } = options;
    const params = { ...rest };
    if (filters) Object.assign(params, filters);
    if (expand) params.expand = expand;
    if (fields) params.fields = fields;
    try {
      const response = await apiClient.get('/api/services/', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar catálogo de serviços:', error);
      throw error;
    }
  },

  getServiceCatalogById: async (id, options = {}) => {
    const { filters, expand, fields, ...rest } = options;
    const params = { ...rest };
    if (filters) Object.assign(params, filters);
    if (expand) params.expand = expand;
    if (fields) params.fields = fields;
    try {
      const response = await apiClient.get(`/api/services/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar serviço com id ${id}:`, error);
      throw error;
    }
  },

  getServiceCatalogByName: async (name, options = {}) => {
    const { filters, expand, fields, ...rest } = options;
    const params = { name__icontains: name, ...rest };
    if (filters) Object.assign(params, filters);
    if (expand) params.expand = expand;
    if (fields) params.fields = fields;
    try {
      const response = await apiClient.get('/api/services/', { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar serviço com nome ${name}:`, error);
      throw error;
    }
  },

  getServiceCatalogByFormId: async (formId, options = {}) => {
    const { filters, expand, fields, ...rest } = options;
    const params = { form: formId, ...rest };
    if (filters) Object.assign(params, filters);
    if (expand) params.expand = expand;
    if (fields) params.fields = fields;
    try {
      const response = await apiClient.get('/api/services/', { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar serviço com form_id ${formId}:`, error);
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
