import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/project-materials';
const projectMaterialsService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar materiais:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar material com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar material:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar material com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar material com id ${id}:`, error);
      throw error;
    }
  },

  getProjectMaterials: async ({ page = 1, limit = 100, ...filters } = {}) => {
    try {
      const url = `/api/project-materials/`;
      const response = await apiClient.get(url, {
        params: {
          page,
          limit,
          ...filters,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar materiais do projeto:', error);
      throw error;
    }
  },

  createProjectMaterial: async (data) => {
    const response = await apiClient.post(`/api/project-materials/`, data);
    return response.data;
  },

  getProjectMaterialById: async (id) => {
    const response = await apiClient.get(`/api/project-materials/${id}/`);
    return response.data;
  },

  updateProjectMaterial: async (id, data) => {
    const response = await apiClient.put(`/api/project-materials/${id}/`, data);
    return response.data;
  },

  partialUpdateProjectMaterial: async (id, data) => {
    const response = await apiClient.patch(`/api/project-materials/${id}/`, data);
    return response.data;
  },

  deleteProjectMaterial: async (id) => {
    const response = await apiClient.delete(`/api/project-materials/${id}/`);
    return response.data;
  },
};

export default projectMaterialsService;
