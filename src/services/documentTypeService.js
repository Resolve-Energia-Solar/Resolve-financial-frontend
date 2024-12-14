import apiClient from './apiClient';

const documentTypeService = {
    getDocumentTypes: async ({ page = 1, limit = 10 } = {}) => { 
        const response = await apiClient.get(`/api/document-types/`, {
            params: { 
                page, 
                limit 
            },
        });
        return response.data;
    },
    getDocumentTypeById: async (id) => { 
        const response = await apiClient.get(`/api/document-types/${id}/`);
        return response.data;
    },
    getDocumentTypeFromEngineering: async () => {
        const response = await apiClient.get(`/api/document-types/`, {
            params: { app_label__in: 'engineering' },
        });
        return response.data;
    },
    getDocumentTypeFromContract: async () => {
        const response = await apiClient.get(`/api/document-types/`, {
            params: { app_label__in: 'contracts' },
        });
        return response.data;
    },
    updateDocumentType: async (id, data) => {
        const response = await apiClient.put(`/api/document-types/${id}/`, data);
        return response.data;
    },
    createDocumentType: async (data) => {
        const response = await apiClient.post(`/api/document-types/`, data);
        return response.data;
    },
    deleteDocumentType: async (id) => {
        const response = await apiClient.delete(`/api/document-types/${id}/`);
        return response.data;
    },
};

export default documentTypeService;
