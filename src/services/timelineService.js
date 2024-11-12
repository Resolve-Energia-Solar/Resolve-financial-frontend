import apiClient from './apiClient';

const timelineService = {
  getTimeline: async () => {
    try {
      const response = await apiClient.get('/api/schedule/get_timeline/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  },
};

export default timelineService;
