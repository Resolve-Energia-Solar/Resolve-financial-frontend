import apiClient from './apiClient';

const formBuilderService = {
  getForms: async () => {
    try {
      const response = await apiClient.get('/api/forms/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar formulários:', error);
      throw error;
    }
  },

  getFormById: async (id) => {
    try {
      const response = await apiClient.get(`/api/forms/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar formulário com id ${id}:`, error);
      throw error;
    }
  },

  getFormByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/forms/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar formulário com nome ${name}:`, error);
      throw error;
    }
  },

  updateForm: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/forms/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar formulário com id ${id}:`, error);
      throw error;
    }
  },

  createForm: async (data) => {
    try {
      const response = await apiClient.post('/api/forms/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar formulário:', error);
      throw error;
    }
  },

  deleteForm: async (id) => {
    try {
      const response = await apiClient.delete(`/api/forms/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar formulário com id ${id}:`, error);
      throw error;
    }
  },
};

export default formBuilderService;
