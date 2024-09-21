import apiClient from "./apiClient";

const userService = {
  getUser: async () => {
    try {
      const response = await apiClient.get('/api/users/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await apiClient.get(`/api/users/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário com id ${id}:`, error);
      throw error;
    }
  },

  updateUser: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/users/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar usuário com id ${id}:`, error);
      throw error;
    }
  },

  createUser: async (data) => {
    try {
      const response = await apiClient.post('/api/users/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },
};

export default userService;

