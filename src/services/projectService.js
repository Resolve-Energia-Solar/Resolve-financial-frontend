import apiClient from './apiClient'

const projectService = {
  getProjects: async (params = {}) => {
    const response = await apiClient.get(`/api/projects/?expand=units`, { params })
    return response.data
  },
  getProjectById: async id => {
    const response = await apiClient.get(`/api/projects/${id}/?&expand=units`)
    console.log('sending2', response.data)
    return response.data
  },
  getProjectBySale: async id => {
    const response = await apiClient.get(`/api/projects/?sale=${id}&expand=units`)
    return response.data
  },
  generateProjectBySale: async id => {
    const response = await apiClient.post(`/api/generate-projects/`, { sale_id: id })
    return response.data
  },
  getPreviewGenerateProject: async id => {
    const response = await apiClient.get(`/api/generate-projects/?sale_id=${id}`)
    return response.data
  },
  updateProject: async (id, data) => {
    const response = await apiClient.put(`/api/projects/${id}/`, data)
    return response.data
  },
  partialUpdateProject: async (id, data) => {
    const response = await apiClient.patch(`/api/projects/${id}/`, data)
    return response.data
  },
  createProject: async data => {
    const response = await apiClient.post(`/api/projects/`, data)
    return response.data
  },
  insertMaterial: async (data, onUploadProgress) => {
    console.log('insertMaterial - Enviando FormData:', data)
    try {
      console.log('insertMaterial - Recebido FormData:')
      for (let pair of data.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`)
      }

      const response = await apiClient.post('/api/projects/insert-materials/', data, {
        onUploadProgress,
      })
      console.log('insertMaterial - Resposta da API:', response.data)
      return response.data
    } catch (error) {
      console.error('insertMaterial - Erro ao enviar:', error)
      throw error
    }
  },
  deleteProject: async id => {
    const response = await apiClient.delete(`/api/projects/${id}/`)
    return response.data
  },
}

export default projectService
