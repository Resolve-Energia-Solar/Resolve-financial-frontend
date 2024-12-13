import apiClient from './apiClient';

const commissionService = {
    id:1,
    getId: async () => {
        return this.id

    },
    setid: async (id) => {
        this.id = id
    },
    getCommissiomAll: async () => {
        try {
            const response = await apiClient.get('/api/franchise-installments/?expand=sale');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar as vendas:', error);
            throw error;
        }
    },
    getComissionId: async (id) => {
        try {
            const response = await apiClient.get(`/api/franchise-installments/${id}`);
            return response.data;

        } catch (error) {

            console.error('Erro ao buscar as vendas:', error);
            throw error;

        }
    },

    updateComissionId: async (id) => {
        try {
            const response = await apiClient.put(`/api/franchise-installments/${id}`);
            return response.data;

        } catch (error) {

            console.error('Erro ao buscar as vendas:', error);
            throw error;

        }
    },

    patchComissionId: async (id) => {
        try {
            const response = await apiClient.patch(`/api/franchise-installments/${id}`);
            return response.data;

        } catch (error) {

            console.error('Erro ao buscar as vendas:', error);
            throw error;

        }
    },

    createComissionId: async (id) => {
        try {
            const response = await apiClient.post(`/api/franchise-installments/${id}`);
            return response.data;

        } catch (error) {

            console.error('Erro ao buscar as vendas:', error);
            throw error;

        }
    },

    deleteComissionId: async (id) => { 
        try {
            const response = await apiClient.delete(`/api/franchise-installments/${id}`);
            return response.data;

        } catch (error) {

            console.error('Erro ao buscar as vendas:', error);
            throw error;

        }
    }
}

export default commissionService