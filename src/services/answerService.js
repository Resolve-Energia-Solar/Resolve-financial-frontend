import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/answers';

const answerService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar respostas:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar resposta com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar resposta:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro aanswers resposta endereço com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar resposta com id ${id}:`, error);
      throw error;
    }
  },

  getAnswers: async () => {
    try {
      const response = await apiClient.get('/api/answers/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar respostas:', error);
      throw error;
    }
  },

  getAnswerById: async (id) => {
    try {
      const response = await apiClient.get(`/api/answers/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar resposta com id ${id}:`, error);
      throw error;
    }
  },

  getAnswerBySchedule: async (scheduleId) => {
    try {
      const response = await apiClient.get(`/api/answers/?schedule=${scheduleId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar respostas do agendamento ${answererId}:`, error);
      throw error;
    }
  },

  getAnswerFormFiles: async (answerId, params = {}) => {
    try {
      const response = await apiClient.get(`/api/form-files/?answer=${answerId}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar arquivos da resposta ${answerId}:`, error);
      throw error;
    }
  },

  updateAnswer: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/answers/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar resposta com id ${id}:`, error);
      throw error;
    }
  },

  createAnswer: async (data) => {
    try {
      const response = await apiClient.post('/api/answers/', data);

      for (const [key, value] of Object.entries(data.answers)) {
        if (value instanceof File) {
          const formData = new FormData();
          formData.append('answer', response.data.id);
          formData.append('field_id', key);
          formData.append('file', value);

          await apiClient.post('/api/form-files/', formData);
        }
      }

      return response.data;
    } catch (error) {
      console.error('Erro ao criar resposta:', error);
      throw error;
    }
  },

  deleteAnswer: async (id) => {
    try {
      const response = await apiClient.delete(`/api/answers/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar resposta com id ${id}:`, error);
      throw error;
    }
  },
};

export default answerService;
