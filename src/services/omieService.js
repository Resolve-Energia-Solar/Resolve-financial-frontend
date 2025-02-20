import apiClient from "./apiClient";

const omieService = {
    getDepartments: async ({ call = 'ListarDepartamentos' } = {}) => {
        try {
            const response = await apiClient.post('api/financial/omie/', {
                call
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao obter departamentos:', error);
            throw error;
        }
    },
    getCategories: async ({ call = 'ListarCategorias' } = {}) => {
        try {
            const response = await apiClient.post('api/financial/omie/', {
                call
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao obter categorias:', error);
            throw error;
        }
    },
    getCustomers: async ({ call = 'ListarClientesResumido', filter } = {}) => {
        try {
            const response = await apiClient.post('api/financial/omie/', {
                call,
                filter
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao obter clientes:', error);
            throw error;
        }
    },
    addCustomer: async ({ call = 'IncluirCliente', customer } = {}) => {
        try {
            const response = await apiClient.post('api/financial/omie/', {
                call,
                customer
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao adicionar cliente:', error);
            throw error;
        }
    }
};

export default omieService;
