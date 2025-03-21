import apiClient from './apiClient';

const DEFAULT_ROUTER = '/api/products';

const ProductService = {
  index: function (params) {
    try {
      const response = apiClient.get(`${DEFAULT_ROUTER}/`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  find: async (id, params) => {
    try {
      const response = await apiClient.get(`${DEFAULT_ROUTER}/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produto com id ${id}:`, error);
      throw error;
    }
  },
  create: function (data) {
    try {
      const response = apiClient.post(`${DEFAULT_ROUTER}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await apiClient.patch(`${DEFAULT_ROUTER}/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar produto com id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`${DEFAULT_ROUTER}/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar produto com id ${id}:`, error);
      throw error;
    }
  },

  getProducts: async (params = {}) => {
    const response = await apiClient.get(`/api/products/`, { params });
    return response.data;
  },
  getProductsDefault: async () => {
    const response = await apiClient.get(`/api/products/?default__in=S`);
    return response.data;
  },
  getProductsByName: async (name) => {
    const response = await apiClient.get(`/api/products/?name__icontains=${name}&default__in=S`);
    return response.data;
  },

  getProductsByNames: async (names) => {
    const response = await apiClient.get(`/api/products/?name__in=${names.join(',')}`);
    return response.data;
  },

  getProductsByDescription: async (description) => {
    const response = await apiClient.get(`/api/products/?description__icontains=${description}`);
    return response.data;
  },

  getProductsByValueRange: async (minValue, maxValue) => {
    const response = await apiClient.get(
      `/api/products/?product_value__gte=${minValue}&product_value__lte=${maxValue}`,
    );
    return response.data;
  },

  getProductsByReferenceValueRange: async (minRefValue, maxRefValue) => {
    const response = await apiClient.get(
      `/api/products/?reference_value__gte=${minRefValue}&reference_value__lte=${maxRefValue}`,
    );
    return response.data;
  },

  getProductsByCostValueRange: async (minCost, maxCost) => {
    const response = await apiClient.get(
      `/api/products/?cost_value__gte=${minCost}&cost_value__lte=${maxCost}`,
    );
    return response.data;
  },

  getProductsByRoofType: async (roofType) => {
    const response = await apiClient.get(`/api/products/?roof_type=${roofType}`);
    return response.data;
  },

  getProductsByBranch: async (branch) => {
    const response = await apiClient.get(`/api/products/?branch=${branch}`);
    return response.data;
  },

  getProductsByDateRange: async (startDate, endDate) => {
    const response = await apiClient.get(
      `/api/products/?created_at__range=${startDate},${endDate}`,
    );
    return response.data;
  },

  getProductById: async (id, params = {}) => {
    const response = await apiClient.get(`/api/products/${id}/`, { params });
    return response.data;
  },

  createProduct: async (data) => {
    const response = await apiClient.post(`/api/products/`, data);
    return response.data;
  },

  updateProduct: async (id, data) => {
    const response = await apiClient.put(`/api/products/${id}/`, data);
    return response.data;
  },

  updateProductPartial: async (id, data) => {
    const response = await apiClient.patch(`/api/products/${id}/`, data);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/api/products/${id}/`);
    return response.data;
  },
};

export default ProductService;
