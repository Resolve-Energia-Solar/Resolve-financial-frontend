import { id } from 'date-fns/locale';
import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/energy-consumptions';

const EnergyConsumptionService = {
    index: async (params) => {
        try {
            const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar cadastros de consumo energético! :/) ', error);
            throw error;
        }
    },

    find: async (id, params) => {
        try {
            const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar cadastro de consumo energético com id ${id}: `, error);
            throw error;
        }
    },

    create: async (data) => {
        try {
            const response = await apiClient.post(`${DEFAULT_ROUTER}/`, data);
            return response.data;
        } catch (error) {
            console.error('Erro criar cadastro de consumo energético! ', error);
            throw error;
        }
    },

    update: async (id, data) => {
        try {
            const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar cadastro de consumo energético com id ${id}: `, error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const respponse = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
            return respponse.data;
        } catch (error) {
            console.error(`Erro ao remover cadastro de consumo energético com id ${id}: `);
            throw error;
        }
    }
}