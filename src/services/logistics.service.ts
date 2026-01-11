import api from '@/lib/axios';

export const logisticsService = {
    async getTricycles() {
        const resp = await api.get('/logistics/tricycles/');
        return resp.data;
    },

    async getTournees() {
        const resp = await api.get('/logistics/tournees/');
        return resp.data;
    },

    /**
     * Get real-time GPS locations of all online agents
     */
    async getAgentLocations() {
        const resp = await api.get('/logistics/agents/locations/');
        return resp.data;
    },

    /**
     * Find nearest agents to a given location
     */
    async findNearestAgents(latitude: number, longitude: number, maxAgents = 5) {
        const resp = await api.post('/logistics/agents/nearest/', {
            latitude,
            longitude,
            max_agents: maxAgents,
        });
        return resp.data;
    },

    /**
     * Update agent location (for testing purposes)
     */
    async updateAgentLocation(agentId: number, data: any) {
        const resp = await api.post(`/logistics/agents/${agentId}/update_location/`, data);
        return resp.data;
    },
};

export default logisticsService;
