import apiClient from './apiClient'

const ProposalService = {
  getProposals: async (ordering = '') => {
    const response = await apiClient.get(`/api/comercial-proposals/?ordering=${ordering}`)
    return response.data
  },
  getProposalByFullName: async fullName => {
    const response = await apiClient.get(`/api/comercial-proposals/?q=${fullName}`)
    return response.data
  },

  getProposalById: async id => {
    const response = await apiClient.get(`/api/comercial-proposals/${id}/`)
    return response.data
  },

  updateProposal: async (id, data) => {
    const response = await apiClient.put(`/api/comercial-proposals/${id}/`, data)
    return response.data
  },

  updateProposalPartial: async (id, data) => {
    const response = await apiClient.patch(`/api/comercial-proposals/${id}/`, data)
    return response.data
  },

  createProposal: async data => {
    const response = await apiClient.post(`/api/comercial-proposals/`, data)
    return response.data
  },

  deleteProposal: async id => {
    const response = await apiClient.delete(`/api/comercial-proposals/${id}/`)
    return response.data
  },
}

export default ProposalService
