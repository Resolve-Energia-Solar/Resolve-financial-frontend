import apiClient from './apiClient';

const saleService = {
    getSales: async () => { 
        const response = await apiClient.get(`/api/sales/`);
        return response.data;
    },

    getSale: async (id) => { 
        const response = await apiClient.get(`/api/sales/${id}/`);
        return response.data;
    },

    updateSale: async (id, data) => {
        const response = await apiClient.patch(`/api/sales/${id}/`, data);
        return response.data;
    },

    createSale: async (data) => {
        const response = await apiClient.post(`/api/sales/`, data);
        return response.data;
    },
    
};

export default saleService;
