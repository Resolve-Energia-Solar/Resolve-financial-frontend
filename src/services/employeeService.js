import apiClient from './apiClient';

const employeeService = {
    getEmployee: async ({ page = 1, limit = 10, filters = {} } = {}) => {
        try {
            const response = await apiClient.get('/api/employees/', {
                params: {
                    page,
                    limit,
                    ...filters,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
            throw error;
        }
    },
    updateEmployee: async (id, data) => {
        try {
            const response = await apiClient.patch(`/api/employees/${id}/`, data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar funcionário com id ${id}:`, error);
            throw error;
        }
    },
    putEmployee: async (id, data) => {
        try {
            const response = await apiClient.put(`/api/employees/${id}/`, data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar funcionário com id ${id}:`, error);
            throw error;
        }
    },
    createEmployee: async (data) => {
        try {
            const response = await apiClient.post('/api/employees/', data);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar funcionário:', error);
            throw error;
        }
    },
    deleteEmployee: async (id) => {
        try {
            const response = await apiClient.delete(`/api/employees/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao deletar funcionário com id ${id}:`, error);
            throw error;
        }
    },
    login: async (data) => {
        try {
            const response = await apiClient.post('/api/login/', data);
            return response.data;
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    },
};

export default employeeService;
