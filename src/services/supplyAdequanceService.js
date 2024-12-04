import apiClient from './apiClient';

const supplyService = {
    getSupplyAd: async () => { 
        const response = await apiClient.get(`/api/supply-adequances/`);
        return response.data;
    },
    getSupplyAdById: async (id) => { 
        const response = await apiClient.get(`/api/supply-adequances/${id}/`);
        return response.data;
    },
    getFieldsDocuments: async (document) => {
        const response = await apiClient.post(`/api/fatura/`, document);
        return response.data;
    },
    getSupplyByName: async name => {
        const response = await apiClient.get(`/api/supply-adequances/?name__icontains=${name}`);
        return response.data;
    },
    updateSupplyAd: async (id, data) => {
        const response = await apiClient.put(`/api/supply-adequances/${id}/`, data);
        return response.data;
    },

    createSupplyAd: async (data) => {
        const response = await apiClient.post(`/api/supply-adequances/`, data);
        return response.data;
    },

    deleteSupplyAd: async (id) => {
        const response = await apiClient.delete(`/api/supply-adequances/${id}/`);
        return response.data;
    },
    
};

export default supplyService;
