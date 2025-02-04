import apiClient from './apiClient'

const leadService = {
  getLeads: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/leads/', { ...params });
      return response.data
    } catch (error) {
      console.error('Erro ao buscar leads:', error)
      throw error
    }
  },
  createLead: async data => {
    const response = await apiClient.post('/api/leads/', data)
    return response.data
  },
  getAllSalesByLead: async leadId => {
    try {
      const response = await apiClient.get(`/api/leads/${leadId}/`)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar vendas do lead:', error)
      throw error
    }
  },
  updateLead: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/leads/${id}/`, data)
      return response.data
    } catch (error) {
      console.error('Erro na requisição de atualização do lead:', error)
      console.error('Dados enviados:', data)
      throw error
    }
  },
  patchLead: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/leads/${id}/`, data)
      return response.data
    } catch (error) {
      console.error('Erro na requisição de atualização do lead:', error)
      console.error('Dados enviados:', data)
      throw error
    }
  },

  getLeadsByColumn: async (boardId, columnId, page = 1, pageSize = 60, searchTerm = '') => {
    try {
      const params = {
        board_id: boardId,
        column: columnId,
        page,
        page_size: pageSize,
      }

      if (searchTerm) {
        params.name__icontains = searchTerm
      }

      console.log('Enviando requisição com params:', params)

      const response = await apiClient.get('/api/leads/', { params })

      if (response.data && Array.isArray(response.data.results)) {
        console.log('Leads recebidos:', response.data.results)
        return response.data.results
      } else {
        console.warn('Resposta inesperada da API:', response.data)
        return []
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Erro de autenticação. Redirecionando para login.')
        window.location.href = '/login'
      } else {
        console.error('Erro ao buscar leads:', error)
      }
      return []
    }
  },

  getLeadByName: async name => {
    try {
      const response = await apiClient.get(`/api/leads/?name=${name}`)
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar lead com nome ${name}:`, error)
      throw error
    }
  },

  deleteLead: async leadId => {
    const response = await apiClient.delete(`/api/leads/${leadId}/`)
    return response.data
  },
  getLeadById: async leadId => {
    const response = await apiClient.get(`/api/leads/${leadId}/`)
    return response.data
  },
}

export default leadService
