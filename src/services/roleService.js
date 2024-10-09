import apiClient from "./apiClient";

const roleService = {
  getRole: async () => {
    try {
      const response = await apiClient.get('/api/roles/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar roles:', error);
      throw error;
    }
  },
  getRoleByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/roles/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar role com id ${name}:`, error);
      throw error;
    }
  },
  getRoleById: async (id) => {
    try {
      const response = await apiClient.get(`/api/roles/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar Campaign com id ${id}:`, error);
      throw error;
    }
  },

  updateRole: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/roles/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar Campaign com id ${id}:`, error);
      throw error;
    }
  },

  createRole: async (data) => {
    try {
      const response = await apiClient.post('/api/roles/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar setor:', error);
      throw error;
    }
  },
  deleteRole: async (id) => {
    try {
      const response = await apiClient.delete(`/api/roles/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar setor com id ${id}:`, error);
      throw error;
    }
  }
};

export default roleService;