import { create, get } from "lodash";
import apiClient from "./apiClient";


const commentService = {
  getComment: async (id, content_type) => {
      try {
          const response = await apiClient.get(`/api/comments/?object_id=${id}&content_type=${content_type}&ordering=created_at`);
          console.log(response.data);
          return response.data;
      } catch (error) {
          console.error(`Erro ao buscar anexo com id ${id}:`, error);
          throw error;
      }
      },
  createComment: async (data) => {
    try {
      const response = await apiClient.post('/api/comments/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar anexo:', error);
      throw error;
    }
  },
  updateComment: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/comments/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar anexo com id ${id}:`, error);
      throw error;
    }
  },
  patchComment: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/comments/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar anexo com id ${id}:`, error);
      throw error;  
    }
  },
  deleteComment: async (id) => {
    try {
      const response = await apiClient.delete(`/api/comments/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar anexo com id ${id}:`, error);
      throw error;
    }
  },
};

export default commentService;

