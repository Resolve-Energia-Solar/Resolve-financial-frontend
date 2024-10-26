import apiClient from './apiClient'

const KitSolarService = {
  getKitSolar: async (ordering = '') => {
    const response = await apiClient.get(`/api/solar-energy-kits/?ordering=${ordering}`)
    return response.data
  },
  getKitSolarByFullName: async fullName => {
    const response = await apiClient.get(`/api/solar-energy-kits/?q=${fullName}`)
    return response.data
  },

  getKitSolarById: async id => {
    const response = await apiClient.get(`/api/solar-energy-kits/${id}/`)
    return response.data
  },

  updateKitSolar: async (id, data) => {
    const response = await apiClient.put(`/api/solar-energy-kits/${id}/`, data)
    return response.data
  },

  updateKitSolarPartial: async (id, data) => {
    const response = await apiClient.patch(`/api/solar-energy-kits/${id}/`, data)
    return response.data
  },

  createKitSolar: async data => {
    const response = await apiClient.post(`/api/solar-energy-kits/`, data)
    return response.data
  },

  deleteKitSolar: async id => {
    const response = await apiClient.delete(`/api/solar-energy-kits/${id}/`)
    return response.data
  },
}

export default KitSolarService
