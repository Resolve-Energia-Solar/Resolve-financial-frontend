import apiClient from './apiClient';

const projectService = {
    getProjects: async () => { 
        const response = await apiClient.get(`/api/projects/`);
        return response.data;
    },
    getProjectById: async (id) => { 
        const response = await apiClient.get(`/api/projects/${id}/`);
        return response.data;
    },
    getProjectBySale: async (id) => {
        const response = await apiClient.get(`/api/projects/?sale=${id}`);
        return response.data
    },
    updateProject: async (id, data) => {
        const response = await apiClient.put(`/api/projects/${id}/`, data);
        return response.data;
    },
    partialUpdateProject: async (id, data) => {
        const response = await apiClient.patch(`/api/projects/${id}/`, data);
        return response.data;
    },
    createProject: async (data) => {
        const response = await apiClient.post(`/api/projects/`, data);
        return response.data;
    },

    deleteProject: async (id) => {
        const response = await apiClient.delete(`/api/projects/${id}/`);
        return response.data;
    },
    
};

export default projectService;
