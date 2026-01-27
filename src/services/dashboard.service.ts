import api from '@/lib/axios';

export interface DashboardStats {
    kpis: {
        total_revenue: number;
        total_deliveries: number;
        total_pending_orders: number;
        active_agents: number;
        active_clients: number;
        active_tricycles: number;
        avg_delivery_time: number;
    };
    charts: {
        revenue: Array<{ month: string; revenue: number }>;
        deliveries: Array<{ day: string; deliveries: number }>;
    };
    agent_performance: Array<{
        name: string;
        deliveries: number;
        photo: string | null;
    }>;
}

export const dashboardService = {
    _statsRequest: null as Promise<DashboardStats> | null,

    async getStats(): Promise<DashboardStats> {
        if (this._statsRequest) return this._statsRequest;

        this._statsRequest = (async () => {
            try {
                const response = await api.get<DashboardStats>('/dashboard/stats/');
                return response.data;
            } finally {
                this._statsRequest = null;
            }
        })();

        return this._statsRequest;
    }
};
