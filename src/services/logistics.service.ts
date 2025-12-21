import api from '@/lib/axios';

export const logisticsService = {
    async getTricycles() {
        const resp = await api.get('/logistics/tricycles/');
        return resp.data;
    },

    async getTournees() {
        const resp = await api.get('/logistics/tournees/');
        return resp.data;
    }
};

export default logisticsService;
