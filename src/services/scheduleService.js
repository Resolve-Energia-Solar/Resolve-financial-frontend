import apiClient from './apiClient';

const scheduleService = {
  getSchedules: async () => {
    try {
      const response = await apiClient.get('/api/schedule/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      throw error;
    }
  },

  getScheduleById: async (id) => {
    try {
      const response = await apiClient.get(`/api/schedule/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar agendamento com id ${id}:`, error);
      throw error;
    }
  },

  getMySchedules: async ({ ordering, params, nextPage, userId }) => {
    const urlParams = params ? `&${params}` : '';
    const urlNextPage = nextPage ? `&page=${nextPage}` : '';
    try {
      const response = await apiClient.get(
        `/api/schedule/?schedule_agent=${userId}&ordering=${
          ordering || ''
        }${urlParams}${urlNextPage}`,
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar meus agendamentos:', error);
      throw error;
    }
  },

  updateSchedule: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/schedule/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar agendamento com id ${id}:`, error);
      throw error;
    }
  },

  patchSchedule: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/schedule/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar agendamento com id ${id}:`, error);
      throw error;
    }
  },

  createSchedule: async (data) => {
    try {
      const response = await apiClient.post('/api/schedule/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  },

  deleteSchedule: async (id) => {
    try {
      const response = await apiClient.delete(`/api/schedule/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir agendamento com id ${id}:`, error);
      throw error;
    }
  },
};

export default scheduleService;
