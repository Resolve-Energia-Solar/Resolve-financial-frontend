import { get } from "lodash";
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
  }
};

export default attachmentService;

