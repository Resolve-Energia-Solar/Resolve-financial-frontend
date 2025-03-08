import apiClient from './apiClient'

const saleService = {
  getSales: async ({ ordering, nextPage, userRole, limit = 5, page = 1, fields = [], ...filters }) => {
    const params = {
      ordering: ordering || '',
      page: nextPage || page,
      limit,
      fields,
      ...filters,
    }

    if (userRole?.role === 'Vendedor') {
      params.seller = userRole.user
    }

    const response = await apiClient.get('/api/sales/', { params })
    return response.data
  },

  getSaleByFullName: async fullName => {
    const response = await apiClient.get(`/api/sales/?q=${fullName}`)
    return response.data
  },
  getSaleByIdWithPendingContract: async id => {
    const response = await apiClient.get(`/api/sales/${id}/?fields=can_generate_contract`)
    return response.data
  },
  getSalesProducts: async id => {
    const response = await apiClient.get(`/api/sales/${id}/?fields=sale_products`)
    return response.data
  },
  getTotalPaidSales: async id => {
    const response = await apiClient.get(`/api/sales/${id}/?fields=total_paid,total_value`)
    return response.data
  },
  getSaleByLead: async lead => {
    const response = await apiClient.get(`/api/sales/?lead=${lead}`)
    console.log(response.data)
    return response.data
  },
  createPreSale: async data => {
    const response = await apiClient.post(`/api/generate-pre-sale/`, data)
    return response.data
  },
  getSaleById: async (id, params = {}) => {
    const response = await apiClient.get(`/api/sales/${id}/`, { params })
    return response.data
  },

  updateSale: async (id, data) => {
    const response = await apiClient.put(`/api/sales/${id}/`, data)
    return response.data
  },

  updateSalePartial: async (id, data) => {
    const response = await apiClient.patch(`/api/sales/${id}/`, data)
    return response.data
  },

  updateSaleValue: async (id, baseValue, majoracao = 0, desconto = 0, transferPercentage = 0.1) => {
    const numericBaseValue = Number(baseValue) || 0

    // Calculando o novo total
    const newTotalValue = numericBaseValue + majoracao - desconto

    // Log para verificação
    console.log(
      'updateSaleValue -> Sale ID:',
      id,
      'Base Value:',
      numericBaseValue,
      'Majoração:',
      majoracao,
      'Desconto:',
      desconto,
      'New Value:',
      newTotalValue,
      'Transfer Percentage:',
      transferPercentage,
    )

    // Enviando os dados para o backend
    const response = await apiClient.patch(`/api/sales/${id}/`, {
      total_value: newTotalValue.toString(), // Convertendo para string conforme esperado pelo backend
      transfer_percentage: transferPercentage.toString(),
    })

    return response.data
  },

  patchSaleProduct: async (id, ids) => {
    const response = await apiClient.patch(`/api/sales/${id}/`, { products_ids: ids })
    return response.data
  },

  createSale: async data => {
    const response = await apiClient.post(`/api/sales/`, data)
    return response.data
  },

  deleteSale: async id => {
    const response = await apiClient.delete(`/api/sales/${id}/`)
    return response.data
  },
}

export default saleService
