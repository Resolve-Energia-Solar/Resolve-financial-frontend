import apiClient from './apiClient';

const saleService = {
    getSales: async (ordering = '') => { 
        const response = await apiClient.get(`/api/sales/?ordering=${ordering}`);
        return response.data;
    },
    getSaleByFullName: async (fullName) => {
        const response = await apiClient.get(`/api/sales/?q=${fullName}`);
        return response.data;
    },

    getSaleById: async (id) => { 
        const response = await apiClient.get(`/api/sales/${id}/`);
        return response.data;
    },

    updateSale: async (id, data) => {
        const response = await apiClient.put(`/api/sales/${id}/`, data);
        return response.data;
    },

    createSale: async (data) => {
        const response = await apiClient.post(`/api/sales/`, data);
        return response.data;
    },

    deleteSale: async (id) => {
        const response = await apiClient.delete(`/api/sales/${id}/`);
        return response.data;
    },
    
};

export default saleService;
