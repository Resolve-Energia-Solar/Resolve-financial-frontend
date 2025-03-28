import { indexOf } from 'lodash';
import apiClient from './apiClient';

const formatTime = (time) => {
  if (!time || time === 'Invalid') {
    return null; // Retorna null para horários inválidos
  }
  return time; // Retorna o horário válido
};
const DEFAULT_ROUTER = '/api/users';
const userService = {
  index: async (params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário com id ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await apiClient.post(`${DEFAULT_ROUTER}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar usuário com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar usuário com id ${id}:`, error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`/api/users/${id}/`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário com id ${id}:`, error);
      throw error;
    }
  },

  index: async (params) => {
    try {
      const response = await apiClient.get(`/api/users/`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuários`, error);
      throw error;
    }
  },

  update: async (id, body) => {
    try {
      const response = await apiClient.patch(`/api/users/${id}/`, body);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário com id ${id}:`, error);
      throw error;
    }
  },

  upInsert: async (id, body) => {
    console.log('afahjsdfjagsd', id);

    try {
      if (id) {
        const response = await apiClient.put(`/api/users/${id}/`, body);
        return response.data;
      } else {
        const response = await apiClient.post(`/api/users/`, body);
        return response.data;
      }
    } catch (error) {
      console.error(`Erro:`, error);
      throw error;
    }
  },

  getUser: async ({ page = 1, limit = 10, filters = {} } = {}) => {
    try {
      const response = await apiClient.get('/api/users/', {
        params: {
          page,
          limit,
          expand: 'employee',
          ...filters,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },
  getEmployeeById: async (id) => {
    try {
      const response = await apiClient.get(`/api/employees/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar funcionário com id ${id}:`, error);
      throw error;
    }
  },
  getUserById: async (id, expand = 'employee', fields = '*') => {
    try {
      const response = await apiClient.get(`/api/users/${id}/`, {
        params: {
          expand,
          fields,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário com id ${id}:`, error);
      throw error;
    }
  },
  getAddressByUserId: async (id, expand = 'addresses', fields = 'addresses') => {
    try {
      const response = await apiClient.get(`/api/users/${id}/?expand=addresses&fields=addresses`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar endereço do usuário com id ${id}:`, error);
      throw error;
    }
  },
  getPhoneByUserId: async (id) => {
    try {
      const response = await apiClient.get(
        `/api/users/${id}/?expand=phone_numbers&fields=phone_numbers`,
      );
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar telefone do usuário com id ${id}:`, error);
      throw error;
    }
  },
  getUserByIdQuery: async (id, query) => {
    try {
      // Define os parâmetros apenas se `id` não for fornecido
      const params = id
        ? {} // Sem parâmetros se `id` existir
        : {
            category: query?.category || null,
            date: query?.scheduleDate || null,
            start_time: formatTime(query?.scheduleStartTime),
            end_time: formatTime(query?.scheduleEndTime),
            latitude: query?.scheduleLatitude || null,
            longitude: query?.scheduleLongitude || null,
            complete_name__icontains: query?.complete_name || null,
          };

      const response = await apiClient.get(`/api/users/${id || ''}/`, {
        params,
      });

      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário com id ${id}:`, error);
      throw error;
    }
  },

  getUserByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/users/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário com id ${name}:`, error);
      throw error;
    }
  },

  getUsersBySchedule: async (query) => {
    try {
      const response = await apiClient.get(`/api/users/`, {
        params: {
          category: query.category,
          date: query.scheduleDate,
          start_time: query.scheduleStartTime,
          end_time: query.scheduleEndTime,
          latitude: query.scheduleLatitude,
          longitude: query.scheduleLongitude,
          complete_name__icontains: query.complete_name, // Adiciona o filtro pelo nome completo
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuários:`, error);
      throw error;
    }
  },

  updateUser: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/users/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar usuário com id ${id}:`, error);
      throw error;
    }
  },
  putUser: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/users/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar usuário com id ${id}:`, error);
      throw error;
    }
  },
  createUser: async (data) => {
    try {
      const response = await apiClient.post('/api/users/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },
  deleteUser: async (id) => {
    try {
      const response = await apiClient.delete(`/api/users/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar usuário com id ${id}:`, error);
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

export default userService;
