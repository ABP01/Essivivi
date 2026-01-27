import api from '@/lib/axios';

export const logisticsService = {
    _tricyclesRequest: null as Promise<any> | null,

    async getTricycles() {
        if (this._tricyclesRequest) return this._tricyclesRequest;

        this._tricyclesRequest = (async () => {
            try {
                const resp = await api.get('/logistics/tricycles/');
                return resp.data;
            } finally {
                this._tricyclesRequest = null;
            }
        })();

        return this._tricyclesRequest;
    },


    _tourneesRequest: null as Promise<any> | null,

    async getTournees() {
        if (this._tourneesRequest) return this._tourneesRequest;

        this._tourneesRequest = (async () => {
            try {
                const resp = await api.get('/logistics/tournees/');
                return resp.data;
            } finally {
                this._tourneesRequest = null;
            }
        })();

        return this._tourneesRequest;
    },

    _locationsRequest: null as Promise<any> | null,

    /**
     * Get real-time GPS locations of all online agents
     */
    async getAgentLocations() {
        if (this._locationsRequest) return this._locationsRequest;

        this._locationsRequest = (async () => {
            try {
                const resp = await api.get('/logistics/agents/locations/');
                return resp.data;
            } finally {
                this._locationsRequest = null;
            }
        })();

        return this._locationsRequest;
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
