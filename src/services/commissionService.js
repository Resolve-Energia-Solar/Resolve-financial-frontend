import apiClient from './apiClient';

const commissionService = {
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
    }
}

export default commissionService