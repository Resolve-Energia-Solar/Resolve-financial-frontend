import apiClient from './apiClient';

const HistoryService = {
  getHistory: async (contentType, objectId, token, get_related) => {
    if (!token) {
      console.error('Erro: Token não fornecido.');
      throw new Error('Token não fornecido.');
    }

    try {
      const params = {
        content_type: contentType,
        object_id: objectId,
      };

      if (get_related) {
        params.get_related = true;
      }

      const response = await apiClient.get('/api/history/', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: params,
      });

      console.log('Histórico:', response.data);

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar histórico:', {
        message: error.message,
        status: error.response?.status || 'Sem status',
        data: error.response?.data || 'Sem dados de resposta',
        headers: error.response?.headers || 'Sem cabeçalhos',
        config: error.config || 'Sem configuração',
      });

      throw error;
    }
  },
};

export default HistoryService;
