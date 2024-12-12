import apiClient from './apiClient';

const saleService = {

    getSales: async ({ ordering, params, nextPage }) => {
        const urlParams = params ? `&${params}` : '';
        const urlNextPage = nextPage ? `&page=${nextPage}` : '';
        const response = await apiClient.get(`/api/sales/?ordering=${ordering || ''}${urlParams}${urlNextPage}`);
        return response.data;
    },
    getSaleByFullName: async (fullName) => {
        const response = await apiClient.get(`/api/sales/?q=${fullName}`);
        return response.data;
    },
    getSaleByIdWithPendingContract: async (id) => {
        const response = await apiClient.get(`/api/sales/${id}/?fields=can_generate_contract`);
        return response.data;
    },
    getSalesProducts: async (id) => {
        const response = await apiClient.get(`/api/sales/${id}/?fields=sale_products`);
        return response.data;
    },
    getTotalPaidSales: async (id) => {
        const response = await apiClient.get(`https://crm.resolvenergiasolar.com/api/sales/${id}/?fields=total_paid,total_value`);
        return response.data;
    },
    getSaleByLead: async (lead) => {
        const response = await apiClient.get(`/api/sales/?lead=${lead}`);
        console.log(response.data);
        return response.data;
    },
    createPreSale: async (data) => {
        const response = await apiClient.post(`/api/generate-pre-sale/`, data);
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

    updateSalePartial: async (id, data) => {
        const response = await apiClient.patch(`/api/sales/${id}/`, data);
        return response.data;
    },

    patchSaleProduct: async (id, ids) => {
        const response = await apiClient.patch(`/api/sales/${id}/`, { products_ids: ids });
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
