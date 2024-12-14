import apiClient from './apiClient'

const financialRecordService = {
  getFinancialRecordList: async () => {
    const response = await apiClient.get('/api/financial-records/')
    return response.data
  },

  createOrigin: async data => {
    const response = await apiClient.post('/api/financial-records/', data)
    return response.data
  },

  getOriginById: async id => {
    const response = await apiClient.get(`/api/financial-records/${id}/`)
    return response.data
  },

  updateOrigin: async (id, data) => {
    const response = await apiClient.put(`/api/financial-records/${id}/`, data)
    return response.data
  },

  updateOriginPartial: async (id, data) => {
    const response = await apiClient.patch(`/api/financial-records/${id}/`, data)
    return response.data
  },

  deleteOrigin: async id => {
    const response = await apiClient.delete(`/api/financial-records/${id}/`)
    return response.data
  },
}

export default financialRecordService
