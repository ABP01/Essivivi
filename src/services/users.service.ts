import api from '@/lib/axios';

export const usersService = {
    async getAgents() {
        const resp = await api.get('/users/agents/');
        // DRF may return paginated { results: [...] } or a raw array
        return resp.data && resp.data.results ? resp.data.results : resp.data;
    },

    async getClients() {
        const resp = await api.get('/users/clients/');
        return resp.data && resp.data.results ? resp.data.results : resp.data;
    },

    async getAgentById(id: string) {
        // check local cache first (created recently in the UI)
        try {
            if (typeof window !== 'undefined') {
                const cached = localStorage.getItem(`agent_cache_${id}`);
                if (cached) return JSON.parse(cached);
            }
        } catch (err) {
            // ignore cache errors
        }

        try {
            const resp = await api.get(`/users/agents/${id}/`);
            return resp.data;
        } catch (e) {
            // if fetching by profile id failed, try to resolve from the agents list by user id or username
            try {
                const list = await this.getAgents();
                const found = (list || []).find((item: any) => {
                    const profileId = String(item.id ?? item.profile_id ?? '');
                    const userId = String(item.user?.id ?? item.user_id ?? '');
                    const username = String(item.user?.username ?? item.username ?? '');
                    const emailLocal = String((item.user?.email || item.email || '').split('@')[0] || '');
                    return profileId === String(id) || userId === String(id) || username === String(id) || emailLocal === String(id);
                });
                if (found) return found;
            } catch (e2) {
                // ignore
            }
            throw e;
        }
    },
    
    // Resolve an agent by numeric id or by username identifier (handles URLs like /agents/<username>/edit)
    async getAgentByIdentifier(idOrUsername: string) {
        // try numeric id/profile id first but be resilient
        if (/^\d+$/.test(idOrUsername)) {
            try {
                const resp = await api.get(`/users/agents/${idOrUsername}/`);
                return resp.data;
            } catch (e) {
                // continue to resolve from list
            }
        }

        // otherwise fetch list and match by multiple possible keys (username, email local-part, user id, profile id)
        const list = await this.getAgents();
        const found = (list || []).find((item: any) => {
            const uname = item.user?.username || item.username || item.user?.email?.split('@')?.[0] || '';
            const profileId = String(item.id ?? item.profile_id ?? '');
            const userId = String(item.user?.id ?? item.user_id ?? '');
            return uname === idOrUsername || profileId === String(idOrUsername) || userId === String(idOrUsername);
        });
        if (found) return found;

        // as a last resort, try to fetch users and match
        try {
            const users = await this.getUsers();
            const user = (users || []).find((u: any) => u.username === idOrUsername || (u.email || '').split('@')[0] === idOrUsername || String(u.id) === String(idOrUsername));
            if (user) {
                const profile = (list || []).find((p: any) => String(p.user?.id ?? p.user) === String(user.id));
                if (profile) return profile;
            }
        } catch (e) {
            // ignore
        }

        throw new Error('Agent non trouvé');
    },

    async getClientById(id: string) {
        const resp = await api.get(`/users/clients/${id}/`);
        return resp.data;
    },

    // Resolve a client by numeric id or by username identifier
    async getClientByIdentifier(idOrUsername: string) {
        // try numeric id first
        if (/^\d+$/.test(idOrUsername)) {
            const resp = await api.get(`/users/clients/${idOrUsername}/`);
            return resp.data;
        }

        // otherwise fetch list and match by username/email-derived key
        const list = await this.getClients();
        const found = (list || []).find((item: any) => {
            const uname = item.user?.username || item.username || item.user?.email?.split('@')?.[0];
            return uname === idOrUsername;
        });
        if (found) return found;

        // as a last resort, try to fetch users and match
        try {
            const users = await this.getUsers();
            const user = (users || []).find((u: any) => u.username === idOrUsername || (u.email || '').split('@')?.[0] === idOrUsername);
            if (user) {
                const profile = (list || []).find((p: any) => p.user?.id === user.id || p.user === user.id);
                if (profile) return profile;
            }
        } catch (e) {
            // ignore
        }

        throw new Error('Client non trouvé');
    },

    async getUsers() {
        const resp = await api.get('/users/users/');
        return resp.data && resp.data.results ? resp.data.results : resp.data;
    }

    ,
    async getCurrentUser() {
        const resp = await api.get('/users/me/');
        return resp.data;
    }
    ,
    async deleteAgent(id: string) {
        const resp = await api.delete(`/users/agents/${id}/`);
        return resp.data;
    }
    ,
    async deleteClient(id: string) {
        const resp = await api.delete(`/users/clients/${id}/`);
        return resp.data;
    }
    ,
    async updateAgent(id: string, payload: any) {
        const resp = await api.patch(`/users/agents/${id}/`, payload);
        return resp.data;
    }
    ,
    async updateUser(id: string | number, payload: any) {
        const resp = await api.patch(`/users/users/${id}/`, payload);
        return resp.data;
    }
    ,
    async updateClient(id: string, payload: any) {
        const resp = await api.patch(`/users/clients/${id}/`, payload);
        return resp.data;
    }
};

export default usersService;
