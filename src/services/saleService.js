import apiClient from './apiClient';

const saleService = {
    getSales: async () => { 
        const response = await apiClient.patch(`/api/sales/`);
        return response.data;
    },

    updateSale: async (leadId, data) => {
        const response = await apiClient.patch(`/api/leads/${leadId}/`, data);
        return response.data;
    },
    
};

export default saleService;
