import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/requests-energy-companies';
const requestConcessionaireService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar solicitação:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar solicitação com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar solicitação com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar solicitação com id ${id}:`, error);
      throw error;
    }
  },

  getRequests: async ({ ordering, nextPage, limit = 25, page = 1, ...filters }) => {
    try {
      const params = {
        ordering: ordering || '',
        page: nextPage || page,
        limit,
        ...filters,
      };
      const response = await apiClient.get('/api/requests-energy-companies/', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar solicitação:', error);
      throw error;
    }
  },

  getAllByProject: async ({ page = 1, limit = 10, projectId, ...filters } = {}) => {
    const params = { page, limit, ...filters };
    if (projectId) {
      params.project = projectId;
    }
    try {
      const response = await apiClient.get(`/api/requests-energy-companies/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar solicitação:', error);
      throw error;
    }
  },
  find: async (id) => {
    try {
      const response = await apiClient.get(`/api/requests-energy-companies/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar solicitação com id ${id}:`, error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/requests-energy-companies/${id}/`, data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar solicitação com id ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await apiClient.post('/api/requests-energy-companies/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      throw error;
    }
  },
};

export default requestConcessionaireService;
