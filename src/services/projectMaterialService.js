import apiClient from './apiClient'

const projectMaterialsService = {
  getProjectMaterials: async (params = {}) => {
    const response = await apiClient.get(`/api/project-materials/`, { params })
    return response.data
  },

  createProjectMaterial: async data => {
    const response = await apiClient.post(`/api/project-materials/`, data)
    return response.data
  },

  getProjectMaterialById: async id => {
    const response = await apiClient.get(`/api/project-materials/${id}/`)
    return response.data
  },

  updateProjectMaterial: async (id, data) => {
    const response = await apiClient.put(`/api/project-materials/${id}/`, data)
    return response.data
  },

  partialUpdateProjectMaterial: async (id, data) => {
    const response = await apiClient.patch(`/api/project-materials/${id}/`, data)
    return response.data
  },
  deleteProjectMaterial: async id => {
    const response = await apiClient.delete(`/api/project-materials/${id}/`)
    return response.data
  },
}

export default projectMaterialsService
