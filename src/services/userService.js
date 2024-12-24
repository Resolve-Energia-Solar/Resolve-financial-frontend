import apiClient from './apiClient';

const formatTime = (time) => {
  if (!time) return null;
  const date = new Date(time);
  return date.toTimeString().split(' ')[0];
};

const userService = {
  getUser: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await apiClient.get('/api/users/', { 
        params: { 
          page, 
          limit 
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
  getUserById: async (id) => {
    try {
      const response = await apiClient.get(`/api/users/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário com id ${id}:`, error);
      throw error;
    }
  },
  getAddressByUserId: async (id) => {
    try {
      const response = await apiClient.get(`/api/users/${id}/?fields=addresses`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar endereço do usuário com id ${id}:`, error);
      throw error;
    }
  },
  getPhoneByUserId: async (id) => {
    try {
      const response = await apiClient.get(`/api/users/${id}/?fields=phone_numbers`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar telefone do usuário com id ${id}:`, error);
      throw error;
    }
  },
  getUserByIdQuery: async (id, query) => {
    try {
      const response = await apiClient.get(`/api/users/${id}/`, {
        params: {
          category: query.category,
          date: query.scheduleDate,
          start_time: formatTime(query.scheduleStartTime),
          end_time: formatTime(query.scheduleEndTime),
          latitude: query.scheduleLatitude,
          longitude: query.scheduleLongitude,
        },
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
          start_time: formatTime(query.scheduleStartTime),
          end_time: formatTime(query.scheduleEndTime),
          latitude: query.scheduleLatitude,
          longitude: query.scheduleLongitude,
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
