import apiClient from './apiClient';

const boardService = {
  getBoards: async (params = {}) => {
    const response = await apiClient.get('/api/boards/', { params });
    return response.data;
  },

  getBoardDetails: async (boardId) => {
    const response = await apiClient.get(`/api/boards/${boardId}/`);
    return response.data;
  },
};

export default boardService;
