import apiClient from './apiClient';

const logError = (operation, error, additionalInfo = null) => {
  console.error(`Erro durante "${operation}":`, {
    message: error?.message,
    status: error?.response?.status,
    data: error?.response?.data,
    additionalInfo,
  });
};
const DEFAULT_ROUTER = '/api/contract-submissions';

const contractService = {
  index: function (params) {
    try {
      const response = apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar contratos:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar contrato com id ${id}:`, error);
      throw error;
    }
  },
  create: function (data) {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar contrato:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar contratocom id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar contrato com id ${id}:`, error);
      throw error;
    }
  },

  getContracts: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/contract-submissions/', { ...params });
      return response.data;
    } catch (error) {
      logError('buscar contratos', error);
      throw error;
    }
  },

  getContractsBySaleId: async (saleId) => {
    try {
      const response = await apiClient.get('/api/contract-submissions/', {
        params: { sale: saleId },
      });
      return response.data;
    } catch (error) {
      logError(`buscar contratos pelo ID da venda ${saleId}`, error);
      throw error;
    }
  },
  getContractById: async (id) => {
    try {
      const response = await apiClient.get(`/api/contract-submissions/${id}/`);
      return response.data;
    } catch (error) {
      logError(`buscar contrato com id ${id}`, error);
      throw error;
    }
  },
  createContract: async (data) => {
    try {
      const response = await apiClient.post('/api/contract-submissions/', data);
      return response.data;
    } catch (error) {
      logError('criar contrato', error, { payload: data });
      throw error;
    }
  },
  updateContract: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/contract-submissions/${id}/`, data);
      return response.data;
    } catch (error) {
      logError(`atualizar contrato com id ${id}`, error, { payload: data });
      throw error;
    }
  },
  patchContract: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/contract-submissions/${id}/`, data);
      return response.data;
    } catch (error) {
      logError(`atualizar parcialmente contrato com id ${id}`, error, { payload: data });
      throw error;
    }
  },
  deleteContract: async (id) => {
    try {
      const response = await apiClient.delete(`/api/contract-submissions/${id}/`);
      return response.data;
    } catch (error) {
      logError(`deletar contrato com id ${id}`, error);
      throw error;
    }
  },
};

export default contractService;
