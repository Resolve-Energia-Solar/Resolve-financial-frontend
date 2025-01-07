import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const PasswordService = {
  passwordReset: async (data) => {
    try {
      const response = await apiClient.post('/api/password-reset-confirm/', data);
      return response;
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      throw error;
    }
  },
  sendPasswordResetEmail: async (data) => {
    try {
      const response = await apiClient.post('/api/password-reset/', data);
      return response;
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      throw error;
    }
  },
};

export default PasswordService;
