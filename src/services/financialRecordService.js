import apiClient from './apiClient'

const financialRecordService = {
  getFinancialRecordList: async (filters = {}) => {
    const response = await apiClient.get('/api/financial-records/', { params: filters });
    return response.data;
  },

  createFinancialRecord: async data => {
    const response = await apiClient.post('/api/financial-records/', data)
    return response.data
  },

  getFinancialRecordById: async id => {
    const response = await apiClient.get(`/api/financial-records/${id}/`)
    return response.data
  },

  updateFinancialRecord: async (id, data) => {
    const response = await apiClient.put(`/api/financial-records/${id}/`, data)
    return response.data
  },

  updateFinancialRecordPartial: async (id, data) => {
    const response = await apiClient.patch(`/api/financial-records/${id}/`, data)
    return response.data
  },

  deleteFinancialRecord: async id => {
    const response = await apiClient.delete(`/api/financial-records/${id}/`)
    return response.data
  },
}

export default financialRecordService
