import { create, get } from "lodash";
import apiClient from "./apiClient";

const attachmentService = {
  getAttachments: async () => {
    try {
      const response = await apiClient.get('/api/attachments/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar anexos:', error);
      throw error;
    }
  },
  createAttachment: async (data) => {
    try {
      const response = await apiClient.post('/api/attachments/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar anexo:', error);
      throw error;
    }
  },
  getAttachmentByIdSale: async (id) => {
    try {
      const response = await apiClient.get(`/api/attachments/?object_id=${id}&content_type_id=44`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar anexo com id ${id}:`, error);
      throw error;
    }
  },
  deleteAttachment: async (id) => {
    try {
      const response = await apiClient.delete(`/api/attachments/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar anexo com id ${id}:`, error);
      throw error;
    }
  },
};

export default attachmentService;

