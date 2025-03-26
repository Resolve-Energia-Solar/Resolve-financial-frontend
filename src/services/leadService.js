import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/leads';
const leadService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar lead com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar lead com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar lead com id ${id}:`, error);
      throw error;
    }
  },
  getLeads: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/leads/', { ...params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      throw error;
    }
  },
  getLeadById: async (leadId, data) => {
    try {
      const response = await apiClient.get(`/api/leads/${leadId}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar lead:', error);
      throw error;
    }
  },
  createLead: async (data) => {
    const response = await apiClient.post('/api/leads/', data);
    return response.data;
  },
  getAllSalesByLead: async (leadId) => {
    try {
      const response = await apiClient.get(`/api/leads/${leadId}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar vendas do lead:', error);
      throw error;
    }
  },
  updateLead: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/leads/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro na requisição de atualização do lead:', error);
      console.error('Dados enviados:', data);
      throw error;
    }
  },
  patchLead: async (id, data) => {
    try {
      console.error('Enviando requisição de atualização do lead:', data);
      const response = await apiClient.patch(`/api/leads/${id}/`, data);
      return response?.data;
    } catch (error) {
      console.error('Erro na requisição de atualização do lead:', error);
      throw error;
    }
  },

  getLeadsByColumn: async (boardId, columnId, page = 1, pageSize = 60, searchTerm = '') => {
    try {
      const params = {
        board_id: boardId,
        column: columnId,
        page,
        page_size: pageSize,
      };

      if (searchTerm) {
        params.name__icontains = searchTerm;
      }

      console.log('Enviando requisição com params:', params);

      const response = await apiClient.get('/api/leads/', { params });

      if (response.data && Array.isArray(response.data.results)) {
        console.log('Leads recebidos:', response.data.results);
        return response.data.results;
      } else {
        console.warn('Resposta inesperada da API:', response.data);
        return [];
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Erro de autenticação. Redirecionando para login.');
        window.location.href = '/login';
      } else {
        console.error('Erro ao buscar leads:', error);
      }
      return [];
    }
  },

  getLeadByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/leads/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar lead com nome ${name}:`, error);
      throw error;
    }
  },

  deleteLead: async (leadId) => {
    const response = await apiClient.delete(`/api/leads/${leadId}/`);
    return response.data;
  },
  getLeadById: async (leadId, params = {}) => {
    const response = await apiClient.get(`/api/leads/${leadId}/`, { ...params });
    return response.data;
  },
};

export default leadService;
