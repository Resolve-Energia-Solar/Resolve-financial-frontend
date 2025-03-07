import apiClient from './apiClient'

const projectMaterialsService = {
  getProjectMaterials: async ({ page = 1, limit = 50, ...filters } = {}) => {
    try {
      const url = `/api/project-materials/`
      const response = await apiClient.get(url, {
        params: {
          page,
          limit,
          ...filters
        }
      })
      return response.data
    } catch (error) {
      console.error('Erro ao buscar materiais do projeto:', error)
      throw error
    }
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
