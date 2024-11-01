import apiClient from './apiClient'

const materialService = {
  getMaterials: async () => {
    try {
      const url = `/api/materials/`
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar materiais:', error)
      throw error
    }
  },

  getMaterialById: async id => {
    try {
      const response = await apiClient.get(`/api/materials/${id}/`)
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar material ID: ${id}`, error)
      throw error
    }
  },

  getMaterialByName: async name => {
    try {
      const response = await apiClient.get(`/api/materials/?description__icontains=${name}`)
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar material com nome: ${name}`, error)
      throw error
    }
  },

  createMaterial: async data => {
    try {
      const response = await apiClient.post('/api/materials/', data)
      return response.data
    } catch (error) {
      console.error('Erro ao criar material:', error)
      throw error
    }
  },

  updateMaterial: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/materials/${id}/`, data)
      return response.data
    } catch (error) {
      console.error(`Erro ao atualizar material ID: ${id}`, error)
      throw error
    }
  },

  partialUpdateMaterial: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/materials/${id}/`, data)
      return response.data
    } catch (error) {
      console.error(`Erro ao fazer update parcial no material ID: ${id}`, error)
      throw error
    }
  },

  deleteMaterial: async id => {
    try {
      const response = await apiClient.delete(`/api/materials/${id}/`)
      return response.data
    } catch (error) {
      console.error(`Erro ao deletar material ID: ${id}`, error)
      throw error
    }
  },
}

export default materialService
