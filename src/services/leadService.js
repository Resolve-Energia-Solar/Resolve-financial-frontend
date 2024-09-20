import apiClient from './apiClient';

const leadService = {
  updateLead: async (leadId, data) => {
    const response = await apiClient.patch(`/api/leads/${leadId}/`, data);
    return response.data;
  },
};

export default leadService;
