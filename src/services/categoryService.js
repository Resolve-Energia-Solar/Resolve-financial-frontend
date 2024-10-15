import { update } from 'lodash';
import apiClient from './apiClient';

const categoryService = {
  getCategories: async () => {
    try {
      const response = await apiClient.get('/api/categories/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
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
