import apiClient from './apiClient';

const tagService = {
  getTags: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await apiClient.get('/api/tags/',
        {params: {
            page,
            limit
          }}
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tags:', error);
      throw error;
    }
  },
  createTag: async (data) => {
    const response = await apiClient.post('/api/tags/', data);
    return response.data;
  },
  updateTag: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/tags/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro na requisição de atualização do tag:', error);
      console.error('Dados enviados:', data);
      throw error;
    }
  },
  patchTag: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/tags/${id}/`, data);
      console.log('patchTag response:', response);
      return response.data;
    } catch (error) {
      console.error('Erro na requisição de atualização do tag:', error);
      console.error('Dados enviados:', data);
      throw error;
    }
  },  
  deleteTag: async (tagId) => {
    const response = await apiClient.delete(`/api/tags/${tagId}/`);
    return response.data;
  }
};

export default tagService;
