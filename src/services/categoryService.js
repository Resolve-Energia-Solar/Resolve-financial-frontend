import { update } from 'lodash';
import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/categories';

const categoryService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar categoria com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar categoria com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar categoria com id ${id}:`, error);
      throw error;
    }
  },

  getCategories: async ({ ordering, params, nextPage }) => {
    const urlParams = params ? `&${params}` : '';
    const urlNextPage = nextPage ? `&page=${nextPage}` : '';
    const response = await apiClient.get(
      `/api/categories/?ordering=${ordering || ''}${urlParams}${urlNextPage}`,
    );
    return response.data;
  },

  getCategoryById: async (id) => {
    try {
      const response = await apiClient.get(`/api/categories/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar categoria com id ${id}:`, error);
      throw error;
    }
  },

  getCategoryByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/categories/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar categoria com nome ${name}:`, error);
      throw error;
    }
  },

  updateCategory: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/categories/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar categoria com id ${id}:`, error);
      throw error;
    }
  },

  createCategory: async (data) => {
    try {
      const response = await apiClient.post('/api/categories/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await apiClient.delete(`/api/categories/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar categoria com id ${id}:`, error);
      throw error;
    }
  },
};

export default categoryService;
