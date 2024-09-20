import apiClient from './apiClient';

const boardService = {
  getBoards: async () => {
    const response = await apiClient.get('/api/boards/');
    return response.data;
  },

  getBoardDetails: async (boardId) => {
    const response = await apiClient.get(`/api/boards/${boardId}/`);
    return response.data;
  },
};

export default boardService;
