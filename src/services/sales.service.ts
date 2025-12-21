import api from '@/lib/axios';

export const salesService = {
    async getCommandes() {
        const resp = await api.get('/sales/commandes/');
        return resp.data;
    },

    async getCommandesById(id: string) {
        const resp = await api.get(`/sales/commandes/${id}/`);
        return resp.data;
    },

    async getLivraisons() {
        const resp = await api.get('/sales/livraisons/');
        return resp.data;
    },
};

export default salesService;
