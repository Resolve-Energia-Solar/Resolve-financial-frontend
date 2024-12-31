import apiClient from "./apiClient";


const GanttService = {
    getGanttList: async () => {
        const response = await apiClient.get(`/api/gantt/`);
        return response.data;
    },
};

export default GanttService;