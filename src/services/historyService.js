import apiClient from './apiClient'

const HistoryService = {
  getHistory: async (contentType, objectId) => {
    const response = await apiClient.get(`/history/`, {
      params: {
        content_type: contentType,
        object_id: objectId,
      },
    })
    return response.data
  },

  getAllHistory: async () => {
    const response = await apiClient.get(`/history/`)
    return response.data
  },
}

export default HistoryService
