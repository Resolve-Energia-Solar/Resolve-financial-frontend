import apiClient from './apiClient'

const columnService = {
  getCollumn: async () => {
    try {
      const response = await apiClient.get('/api/columns/')
      return response.data.results
    } catch (error) {
      console.error('Erro ao buscar colunas:', error)
      throw error
    }
  },

  getColumnById: async id => {
    try {
      const response = await apiClient.get(`/api/columns/${id}/`)
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar coluna com id ${id}:`, error)
      throw error
    }
  },

  updateColumn: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/columns/${id}/`, data)
      return response.data
    } catch (error) {
      if (error.response) {
        console.error('Erro ao editar status:', error.response.data);
      } else {
        console.error('Erro ao editar status:', error);
      }
    }
    
  },

  createColumn: async data => {
    try {
      const response = await apiClient.post('/api/columns/', data)
      return response.data
    } catch (error) {
      console.error('Erro ao criar uma coluna:', error)
      throw error
    }
  },
}

export default columnService
