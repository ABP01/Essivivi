import api from '@/lib/axios';

export interface DashboardStats {
    kpis: {
        total_revenue: number;
        total_deliveries: number;
        total_pending_orders: number;
        active_agents: number;
        active_clients: number;
        active_tricycles: number;
    };
    charts: {
        revenue: Array<{ month: string; revenue: number }>;
        deliveries: Array<{ day: string; deliveries: number }>;
    };
}

export const dashboardService = {
    async getStats(): Promise<DashboardStats> {
        const response = await api.get<DashboardStats>('/dashboard/stats/');
        return response.data;
    }
};
