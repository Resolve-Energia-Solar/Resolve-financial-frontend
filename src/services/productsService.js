import apiClient from './apiClient';

const ProductService = {
  getProducts: async (params = {}) => {
    const response = await apiClient.get(`/api/products/`, { params });
    return response.data;
  },
  getProductsDefault: async () => {
    const response = await apiClient.get(`/api/products/?default__in=S`);
    return response.data;
  },
  getProductsByName: async (name, defaultValue) => {
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
    const response = await apiClient.get(`/api/products/?product_value__gte=${minValue}&product_value__lte=${maxValue}`);
    return response.data;
  },

  getProductsByReferenceValueRange: async (minRefValue, maxRefValue) => {
    const response = await apiClient.get(`/api/products/?reference_value__gte=${minRefValue}&reference_value__lte=${maxRefValue}`);
    return response.data;
  },

  getProductsByCostValueRange: async (minCost, maxCost) => {
    const response = await apiClient.get(`/api/products/?cost_value__gte=${minCost}&cost_value__lte=${maxCost}`);
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
    const response = await apiClient.get(`/api/products/?created_at__range=${startDate},${endDate}`);
    return response.data;
  },

  getProductById: async (id) => {
    const response = await apiClient.get(`/api/products/${id}/`);
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
