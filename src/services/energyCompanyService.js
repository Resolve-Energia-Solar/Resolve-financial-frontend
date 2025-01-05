import apiClient from "./apiClient";

const CompanyService = {
  getCompanies: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const response = await apiClient.get('/api/energy-companies/',
        {params: {
            page,
            limit
          }}
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar as companhias de energias:', error);
      throw error;
    }
  },
  getCompanyByName: async (name) => {
    try {
      const response = await apiClient.get(`/api/energy-companies/?name=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar departamento com id ${name}:`, error);
      throw error;
    }
  },
  getCompanyById: async (id) => {
    try {
      const response = await apiClient.get(`/api/energy-companies/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar departamento com id ${id}:`, error);
      throw error;
    }
  },

  updateCompany: async (id, data) => {
    try {
      const response = await apiClient.patch(`/api/energy-companies/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar departamento com id ${id}:`, error);
      throw error;
    }
  },

  createCompany: async (data) => {
    try {
      const response = await apiClient.post('/api/energy-companies/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar departamento:', error);
      throw error;
    }
  },

  deleteCompany: async (id) => {
    try {
      const response = await apiClient.delete(`/api/energy-companies/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar departamento com id ${id}:`, error);
      throw error;
    }
  }
};

export default CompanyService;
