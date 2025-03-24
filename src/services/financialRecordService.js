import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/financial-records';
const financialRecordService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
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
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
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

  getFinancialRecordList: async (filters = {}) => {
    const response = await apiClient.get('/api/financial-records/', { params: filters });
    return response.data;
  },

  createFinancialRecord: async (data) => {
    const response = await apiClient.post('/api/financial-records/', data);
    return response.data;
  },

  getFinancialRecordById: async (id, fields = '*') => {
    const response = await apiClient.get(`/api/financial-records/${id}/`, { params: { fields } });
    return response.data;
  },

  generateFinancialRecordPDFById: async (id) => {
    const response = await apiClient.get(`/api/financial-records/${id}/?generate_pdf=true`, {
      responseType: 'blob',
    });
    return response.data;
  },

  updateFinancialRecord: async (id, data) => {
    const response = await apiClient.put(`/api/financial-records/${id}/`, data);
    return response.data;
  },

  updateFinancialRecordPartial: async (id, data) => {
    const response = await apiClient.patch(`/api/financial-records/${id}/`, data);
    return response.data;
  },

  deleteFinancialRecord: async (id) => {
    const response = await apiClient.delete(`/api/financial-records/${id}/`);
    return response.data;
  },
  updateFinancialRecordResponsibleStatus: async (id, data) => {
    const rows = data.map((item) => ({
      financial_record_id: id,
      manager_status: item.status === 'A' ? 'Aprovado' : 'Reprovado',
      manager_note: item.manager_note || '',
    }));

    const payload = {
      Action: 'Edit',
      Rows: rows,
    };

    const response = await apiClient.patch(
      `/api/financial/approve-financial-record/${id}/`,
      payload,
    );
    return response.data;
  },
};

export default financialRecordService;
