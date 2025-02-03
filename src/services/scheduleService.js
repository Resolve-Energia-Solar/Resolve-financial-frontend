import apiClient from './apiClient'

const SERVICE_INSPECTION_ID = process.env.NEXT_PUBLIC_SERVICE_INSPECTION_ID

const scheduleService = {
  getSchedules: async ({ ordering, nextPage, limit = 5, page = 1, ...filters }) => {
    try {
      const params = {
        ordering: ordering || '',
        page: nextPage || page,
        limit,
        ...filters,
      };
  
      const response = await apiClient.get('/api/schedule/', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      throw error;
    }
  },
  getAllSchedulesInspectionByProject: async projectId => {
    try {
      const response = await apiClient.get(
        `/api/schedule/?service=${SERVICE_INSPECTION_ID}&project=${projectId}`,
      )
      return response.data
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error)
      throw error
    }
  },
  getAllSchedulesInspectionByCustomer: async customerId => {
    try {
      const response = await apiClient.get(
        `/api/schedule/?service=${SERVICE_INSPECTION_ID}&customer=${customerId}`,
      )
      return response.data
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error)
      throw error
    }
  },
  getScheduleById: async id => {
    try {
      const response = await apiClient.get(`/api/schedule/${id}/`)
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar agendamento com id ${id}:`, error)
      throw error
    }
  },
  getScheduleByIdAttachments: async id => {
    try {
      const response = await apiClient.get(`/api/schedule/${id}/?fields=attachments,project,id`)
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar agendamento com id ${id}:`, error)
      throw error
    }
  },
  getMySchedules: async ({ ordering, params, nextPage, userId }) => {
    const urlParams = params ? `&${params}` : ''
    const urlNextPage = nextPage ? `&page=${nextPage}` : ''
    try {
      const response = await apiClient.get(
        `/api/schedule/?schedule_agent=${userId}&ordering=${
          ordering || ''
        }${urlParams}${urlNextPage}`,
      )
      return response.data
    } catch (error) {
      console.error('Erro ao buscar meus agendamentos:', error)
      throw error
    }
  },

  updateSchedule: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/schedule/${id}/`, data)
      return response.data
    } catch (error) {
      console.error(`Erro ao atualizar agendamento com id ${id}:`, error)
      throw error
    }
  },

  patchSchedule: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/schedule/${id}/`, data)
      return response.data
    } catch (error) {
      console.error(`Erro ao atualizar agendamento com id ${id}:`, error)
      throw error
    }
  },

  createSchedule: async data => {
    try {
      const response = await apiClient.post('/api/schedule/', data)
      console.log('createSchedule', response.data)
      return response.data
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      throw error
    }
  },

  deleteSchedule: async id => {
    try {
      const response = await apiClient.delete(`/api/schedule/${id}/`)
      return response.data
    } catch (error) {
      console.error(`Erro ao excluir agendamento com id ${id}:`, error)
      throw error
    }
  },
}

export default scheduleService
