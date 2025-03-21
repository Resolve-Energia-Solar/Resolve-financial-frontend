import apiClient from './apiClient'

const RoofTypeService = {
  getRoofTypes: async (ordering = '') => {
    const response = await apiClient.get(`/api/roof-types/${ordering ? `?ordering=${ordering}` : ''}`)
    return response.data
  },

  getRoofTypeById: async (id) => {
    const response = await apiClient.get(`/api/roof-types/${id}/`)
    return response.data
  },

  getRoofTypeByName: async (name) => {
    const response = await apiClient.get(`/api/roof-types/?q=${name}`)
    return response.data
  },

  createRoofType: async (data) => {
    const response = await apiClient.post('/api/roof-types/', data)
    return response.data
  },

  updateRoofType: async (id, data) => {
    const response = await apiClient.put(`/api/roof-types/${id}/`, data)
    return response.data
  },

  updateRoofTypePartial: async (id, data) => {
    const response = await apiClient.patch(`/api/roof-types/${id}/`, data)
    return response.data
  },

  deleteRoofType: async (id) => {
    const response = await apiClient.delete(`/api/roof-types/${id}/`)
    return response.data
  }
}

export default RoofTypeService