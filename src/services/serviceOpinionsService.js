import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/service-opinions';
const serviceOpinionsService = {
  index: function (params) {
    try {
      const response = apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pareceres:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar parecer com id ${id}:`, error);
      throw error;
    }
  },
  create: function (data) {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar parecer:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar parecer com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar parecer com id ${id}:`, error);
      throw error;
    }
  },

  getServiceOpinions: async ({ ordering, nextPage, limit = 5, page = 1, ...rest }) => {
    const params = {
      ordering: ordering || '',
      page: nextPage || page,
      ...rest,
    };

    const response = await apiClient.get(`/api/service-opinions/`, { params });
    return response.data;
  },

  getServiceOpinionsById: async (id) => {
    try {
      const response = await apiClient.get(`/api/service-opinions/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar parecer com id ${id}:`, error);
      throw error;
    }
  },
  getServiceOpinionsByName: async (name, params = { limit: 60 }) => {
    try {
      const response = await apiClient.get(
        `/api/service-opinions/?name__icontains=${name}`,
        params,
      );
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar parecer com id ${name}:`, error);
      throw error;
    }
  },

  getServiceOpinionsByService: async (serviceId) => {
    try {
      const response = await apiClient.get(`/api/service-opinions/?service=${serviceId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar parecer do serviço com id ${serviceId}:`, error);
      throw error;
    }
  },

  updateServiceOpinions: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/service-opinions/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar parecer com id ${id}:`, error);
      throw error;
    }
  },

  createServiceOpinions: async (data) => {
    try {
      const response = await apiClient.post('/api/service-opinions/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar parecer:', error);
      throw error;
    }
  },

  deleteServiceOpinions: async (id) => {
    try {
      const response = await apiClient.delete(`/api/service-opinions/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar parecer com id ${id}:`, error);
      throw error;
    }
  },
};

export default serviceOpinionsService;
