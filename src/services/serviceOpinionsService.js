import apiClient from './apiClient';

const serviceOpinionsService = {
  getServiceOpinions: async ({ ordering, nextPage, limit = 5, page = 1, ...rest }) => {


    const params = {
      ordering: ordering || '',
      page: nextPage || page,
      ...rest
    }

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
  getServiceOpinionsByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/service-opinions/?name=${name}`);
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
