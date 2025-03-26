import apiClient from './apiClient';
const DEFAULT_ROUTER = '/api/deadlines';
const deadlineService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar prazos:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar prazo com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar prazo:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar prazo com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar prazo com id ${id}:`, error);
      throw error;
    }
  },

  getDeadlines: async ({ ordering, params, nextPage }) => {
    try {
      const urlParams = params ? `&${params}` : '';
      const urlNextPage = nextPage ? `&page=${nextPage}` : '';
      const response = await apiClient.get(
        `/api/deadlines/?ordering=${ordering || ''}${urlParams}${urlNextPage}`,
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar prazos:', error);
      throw error;
    }
  },

  getDeadlineById: async (id) => {
    try {
      const response = await apiClient.get(`/api/deadlines/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar prazo com id ${id}:`, error);
      throw error;
    }
  },

  getDeadlineByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/deadlines/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar prazo com nome ${name}:`, error);
      throw error;
    }
  },

  updateDeadline: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/deadlines/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar prazo com id ${id}:`, error);
      throw error;
    }
  },

  createDeadline: async (data) => {
    try {
      const response = await apiClient.post('/api/deadlines/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar prazo:', error);
      throw error;
    }
  },

  deleteDeadline: async (id) => {
    try {
      const response = await apiClient.delete(`/api/deadlines/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar prazo com id ${id}:`, error);
      throw error;
    }
  },
};

export default deadlineService;
