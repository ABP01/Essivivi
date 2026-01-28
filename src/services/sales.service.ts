import api from '@/lib/axios';

export const salesService = {
    // Cache promises
    _commandesRequest: null as Promise<any> | null,
    _notificationsRequest: null as Promise<any> | null,

    // Commandes
    async getCommandes() {
        if (this._commandesRequest) return this._commandesRequest;

        this._commandesRequest = (async () => {
            try {
                const resp = await api.get('/sales/commandes/');
                return resp.data && resp.data.results ? resp.data.results : resp.data;
            } finally {
                this._commandesRequest = null;
            }
        })();

        return this._commandesRequest;
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
        if (this._notificationsRequest) return this._notificationsRequest;

        this._notificationsRequest = (async () => {
            try {
                const resp = await api.get('/sales/notifications/');
                return resp.data && resp.data.results ? resp.data.results : resp.data;
            } finally {
                this._notificationsRequest = null;
            }
        })();

        return this._notificationsRequest;
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

    _subscriptionsRequest: null as Promise<any> | null,

    // Abonnements
    async getSubscriptions() {
        if (this._subscriptionsRequest) return this._subscriptionsRequest;

        this._subscriptionsRequest = (async () => {
            try {
                const resp = await api.get('/sales/subscriptions/');
                return resp.data && resp.data.results ? resp.data.results : resp.data;
            } finally {
                this._subscriptionsRequest = null;
            }
        })();

        return this._subscriptionsRequest;
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

    _faqsRequest: null as Promise<any> | null,

    // FAQs
    async getFAQs() {
        if (this._faqsRequest) return this._faqsRequest;

        this._faqsRequest = (async () => {
            try {
                const resp = await api.get('/sales/faqs/');
                return resp.data && resp.data.results ? resp.data.results : resp.data;
            } finally {
                this._faqsRequest = null;
            }
        })();

        return this._faqsRequest;
    },

    async getFAQById(id: string) {
        const resp = await api.get(`/sales/faqs/${id}/`);
        return resp.data;
    },

    // Products
    async getProducts() {
        const resp = await api.get('/sales/products/');
        return resp.data && resp.data.results ? resp.data.results : resp.data;
    },

    async getProductById(id: number) {
        const resp = await api.get(`/sales/products/${id}/`);
        return resp.data;
    },

    async createProduct(data: any) {
        const resp = await api.post('/sales/products/', data);
        return resp.data;
    },

    async updateProduct(id: number, data: any) {
        const resp = await api.patch(`/sales/products/${id}/`, data);
        return resp.data;
    },

    async deleteProduct(id: number) {
        const resp = await api.delete(`/sales/products/${id}/`);
        return resp.data;
    },
};

export default salesService;
