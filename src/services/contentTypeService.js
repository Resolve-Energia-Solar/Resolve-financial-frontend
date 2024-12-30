import apiClient from "./apiClient";

const DEFAULT_ROUTER = '/api/tasks'

const contentType = {
    find: async function (id, params) {
        try {
            const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params: params });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            throw error;
        }
    },
    index: async function (params) {
        try {
            const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params: params });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            throw error;
        }
    },
    update: async function (id, body) {
        try {
            const response = await apiClient.put(`${DEFAULT_ROUTER}/${id}/`, body);
            return response.data;
        }
        catch (error) {
            console.error('Erro ao buscar dados:', error);
            throw error;
        }
    },
    delete: async function (id) {
        try {
            const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
            return response.data;
        }
        catch (error) {
            console.error('Erro ao buscar dados:', error);
            throw error;
        }
    },
    create: async function (body) {
        try {
            const response = await apiClient.post(`${DEFAULT_ROUTER}/`, body);
            return response.data;

        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            throw error;
        }
    }
}

export default contentType;