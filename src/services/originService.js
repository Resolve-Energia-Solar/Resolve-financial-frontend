import apiClient from './apiClient'

const OriginsService = {
  getOriginsList: async () => {
    const response = await apiClient.get('/api/origins/')
    return response.data
  },

  createOrigin: async data => {
    const response = await apiClient.post('/api/origins/', data)
    return response.data
  },

  getOriginById: async id => {
    const response = await apiClient.get(`/api/origins/${id}/`)
    return response.data
  },

  updateOrigin: async (id, data) => {
    const response = await apiClient.put(`/api/origins/${id}/`, data)
    return response.data
  },

  updateOriginPartial: async (id, data) => {
    const response = await apiClient.patch(`/api/origins/${id}/`, data)
    return response.data
  },

  deleteOrigin: async id => {
    const response = await apiClient.delete(`/api/origins/${id}/`)
    return response.data
  },
}

export default OriginsService
