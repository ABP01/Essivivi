import api from '@/lib/axios';

export const salesService = {
    // Commandes
    async getCommandes() {
        const resp = await api.get('/sales/commandes/');
        return resp.data && resp.data.results ? resp.data.results : resp.data;
    },

    async getCommandesById(id: string) {
        const resp = await api.get(`/sales/commandes/${id}/`);
        return resp.data;
    },

    async createCommande(data: any) {
        const resp = await api.post('/sales/commandes/', data);
        return resp.data;
    },

    async updateCommande(id: string, data: any) {
        const resp = await api.patch(`/sales/commandes/${id}/`, data);
        return resp.data;
    },

    async deleteCommande(id: string) {
        const resp = await api.delete(`/sales/commandes/${id}/`);
        return resp.data;
    },

    // Livraisons
    async getLivraisons() {
        const resp = await api.get('/sales/livraisons/');
        return resp.data && resp.data.results ? resp.data.results : resp.data;
    },

    async getLivraisonById(id: string) {
        const resp = await api.get(`/sales/livraisons/${id}/`);
        return resp.data;
    },

    async submitDeliveryProof(id: string, data: FormData) {
        const resp = await api.post(`/sales/livraisons/${id}/submit_proof/`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return resp.data;
    },

    async assignAgent(commandeId: string, agentId: string) {
        const resp = await api.post(`/sales/commandes/${commandeId}/assign/`, {
            agent_id: agentId
        });
        return resp.data;
    },

    // Notifications
    async getNotifications() {
        const resp = await api.get('/sales/notifications/');
        return resp.data && resp.data.results ? resp.data.results : resp.data;
    },

    async markNotificationAsRead(id: string) {
        const resp = await api.post(`/sales/notifications/${id}/mark_read/`);
        return resp.data;
    },

    async markAllNotificationsAsRead() {
        const resp = await api.post('/sales/notifications/mark_all_read/');
        return resp.data;
    },

    // Retours de bouteilles
    async getBottleReturns() {
        const resp = await api.get('/sales/bottle-returns/');
        return resp.data && resp.data.results ? resp.data.results : resp.data;
    },

    async getBottleReturnById(id: string) {
        const resp = await api.get(`/sales/bottle-returns/${id}/`);
        return resp.data;
    },

    async createBottleReturn(data: any) {
        const resp = await api.post('/sales/bottle-returns/', data);
        return resp.data;
    },

    // Abonnements
    async getSubscriptions() {
        const resp = await api.get('/sales/subscriptions/');
        return resp.data && resp.data.results ? resp.data.results : resp.data;
    },

    async getSubscriptionById(id: string) {
        const resp = await api.get(`/sales/subscriptions/${id}/`);
        return resp.data;
    },

    async createSubscription(data: any) {
        const resp = await api.post('/sales/subscriptions/', data);
        return resp.data;
    },

    async updateSubscription(id: string, data: any) {
        const resp = await api.put(`/sales/subscriptions/${id}/`, data);
        return resp.data;
    },

    async pauseSubscription(id: string) {
        const resp = await api.post(`/sales/subscriptions/${id}/pause/`);
        return resp.data;
    },

    async resumeSubscription(id: string) {
        const resp = await api.post(`/sales/subscriptions/${id}/resume/`);
        return resp.data;
    },

    // FAQs
    async getFAQs() {
        const resp = await api.get('/sales/faqs/');
        return resp.data && resp.data.results ? resp.data.results : resp.data;
    },

    async getFAQById(id: string) {
        const resp = await api.get(`/sales/faqs/${id}/`);
        return resp.data;
    },
};

export default salesService;
