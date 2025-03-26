import apiClient from './apiClient';

const CONTENT_TYPE_PROJECT_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_PROJECT_ID;
const CONTENT_TYPE_SALE_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_PROJECT_ID;

const DEFAULT_ROUTER = '/api/attachments';

const attachmentService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar documento com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar documento com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar documento com id ${id}:`, error);
      throw error;
    }
  },

  getAttachments: async (limit = 30, page = 1, content_type = '', filters = {}) => {
    try {
      const query = new URLSearchParams({ limit, page, content_type, ...filters }).toString();
      const response = await apiClient.get(`/api/attachments/?${query}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar anexos:', error);
      throw error;
    }
  },
  getAttachmentsByObjectIdAndContentType: async (
    object_id,
    content_type,
    limit = 30,
    filters = {},
  ) => {
    try {
      const query = new URLSearchParams({ object_id, content_type, limit, ...filters }).toString();
      const response = await apiClient.get(`/api/attachments/?${query}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar anexos:`, error);
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
  updateAttachment: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/attachments/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar anexo com id ${id}:`, error);
      throw error;
    }
  },
  patchAttachment: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/attachments/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar anexo com id ${id}:`, error);
      throw error;
    }
  },
  getAttachmentByIdSale: async (id, limit = 30) => {
    try {
      const response = await apiClient.get(
        `/api/attachments/?object_id=${id}&content_type=${CONTENT_TYPE_SALE_ID}&limit=${limit}`,
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar anexo com id ${id}:`, error);
      throw error;
    }
  },
  getAttachment: async (id, content_type, limit = 30) => {
    try {
      const response = await apiClient.get(
        `/api/attachments/?object_id=${id}&content_type=${content_type}&limit=${limit}`,
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar anexo com id ${id}:`, error);
      throw error;
    }
  },
  getAttanchmentByIdProject: async (id, limit = 30) => {
    try {
      const response = await apiClient.get(
        `/api/attachments/?object_id=${id}&content_type=${CONTENT_TYPE_PROJECT_ID}&limit=${limit}`,
      );
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
