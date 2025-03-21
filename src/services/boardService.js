import apiClient from './apiClient';


const DEFAULT_ROUTER = '/api/boards';

const boardService = {


  index: function (params) {
    try {
      const response = apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar quadros:', error);
      throw error;
    }
  },

  find: async (id) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar quadro com id ${id}:`, error);
      throw error;
    }
  },
  create: function (data) {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar quadro:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar quadro com id ${id}:`, error);
      throw error;
    }
  },
  getBoards: async (params = {}) => {
    const response = await apiClient.get('/api/boards/', { ...params });
    return response.data;
  },
  createBoard: async (data) => {
    const response = await apiClient.post('/api/boards/', data);
    return response.data;
  },
  getBoardDetails: async (boardId) => {
    const response = await apiClient.get(`/api/boards/${boardId}/`);
    return response.data;
  },
};

export default boardService;
