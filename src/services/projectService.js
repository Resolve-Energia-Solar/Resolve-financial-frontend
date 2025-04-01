import qs from 'qs';
import apiClient from './apiClient';
import { find } from 'lodash';

const DEFAULT_ROUTER = '/api/projects';

const projectService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar origens:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar origem com id ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar origem:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar origem com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar origem com id ${id}:`, error);
      throw error;
    }
  },

  getIndicators: async (params) => {
    try {
      const response = await apiClient.get('/api/projects/indicators/', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar indicadores de projetos:', error);
      throw error;
    }
  },

  getProjects: async (params = {}) => {
    const query = qs.stringify({ expand: 'units', ...params }, { addQueryPrefix: true, arrayFormat: 'brackets' });
    const response = await apiClient.get(`/api/projects/${query}`);
    return response.data;
  },
  getProjectsIndicators: async (params = {}) => {
    const query = qs.stringify({ ...params }, { addQueryPrefix: true, arrayFormat: 'brackets' });
    const response = await apiClient.get(`/api/projects/indicators/${query}`);
    return response.data;
  },
  findOneProject: async (id, params = {}) => {
    const query = qs.stringify({ ...params }, { addQueryPrefix: true });
    console.log('findOneProject - Query:', query);
    const response = await apiClient.get(`/api/projects/${id}/${query}`);
    return response.data;
  },
  getProjectById: async (id) => {
    const query = qs.stringify({ expand: 'units' }, { addQueryPrefix: true });
    const response = await apiClient.get(`/api/projects/${id}/${query}`);
    return response.data;
  },
  getProjectBySale: async (id) => {
    const query = qs.stringify({ sale: id, expand: 'units' }, { addQueryPrefix: true, arrayFormat: 'brackets' });
    const response = await apiClient.get(`/api/projects/${query}`);
    return response.data;
  },
  generateProjectBySale: async (id) => {
    const response = await apiClient.post(`/api/generate-projects/`, { sale_id: id });
    return response.data;
  },
  getPreviewGenerateProject: async (id) => {
    const query = qs.stringify({ sale_id: id }, { addQueryPrefix: true });
    const response = await apiClient.get(`/api/generate-projects/${query}`);
    return response.data;
  },
  updateProject: async (id, data) => {
    const response = await apiClient.put(`/api/projects/${id}/`, data);
    return response.data;
  },
  partialUpdateProject: async (id, data) => {
    const response = await apiClient.patch(`/api/projects/${id}/`, data);
    return response.data;
  },
  createProject: async (data) => {
    const response = await apiClient.post(`/api/projects/`, data);
    return response.data;
  },
  insertMaterial: async (data, onUploadProgress) => {
    console.log('insertMaterial - Enviando FormData:', data);
    try {
      // Mantemos os logs para debug conforme a lógica original
      for (let pair of data.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      const response = await apiClient.post('/api/projects/insert-materials/', data, { onUploadProgress });
      console.log('insertMaterial - Resposta da API:', response.data);
      return response.data;
    } catch (error) {
      console.error('insertMaterial - Erro ao enviar:', error);
      throw error;
    }
  },
  deleteProject: async (id) => {
    const response = await apiClient.delete(`/api/projects/${id}/`);
    return response.data;
  },
};

export default projectService;
