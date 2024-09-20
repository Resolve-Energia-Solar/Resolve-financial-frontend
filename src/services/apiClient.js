// src/services/api/apiClient.js

import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor de requisição para adicionar o token de autenticação
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta para lidar com erros globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aqui você pode lidar com erros específicos, como redirecionar em caso de 401
    return Promise.reject(error);
  }
);

export default apiClient;
