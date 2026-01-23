import api from '@/lib/axios';
import { AgentProfile, ClientProfile, User } from '@/types/index';

export const usersService = {
    async getAgents(): Promise<AgentProfile[]> {
        const resp = await api.get('/users/agents/');
        // DRF may return paginated { results: [...] } or a raw array
        return resp.data && resp.data.results ? resp.data.results : resp.data;
    },

    async getClients(): Promise<ClientProfile[]> {
        const resp = await api.get('/users/clients/');
        return resp.data && resp.data.results ? resp.data.results : resp.data;
    },

    async getAgentById(id: string): Promise<AgentProfile> {
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
                const found = (list || []).find((item: AgentProfile) => {
                    const profileId = String(item.id ?? '');
                    // @ts-ignore - backend consistency issue
                    const userId = String(item.user?.id ?? item.user ?? '');
                    // @ts-ignore
                    const username = String(item.user?.username ?? item.username ?? '');
                    // @ts-ignore
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
    async getAgentByIdentifier(idOrUsername: string): Promise<AgentProfile> {
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
        const found = (list || []).find((item: AgentProfile) => {
            // @ts-ignore
            const uname = item.user?.username || item.username || item.user?.email?.split('@')?.[0] || '';
            const profileId = String(item.id ?? '');
            // @ts-ignore
            const userId = String(item.user?.id ?? item.user ?? '');
            return uname === idOrUsername || profileId === String(idOrUsername) || userId === String(idOrUsername);
        });
        if (found) return found;

        // as a last resort, try to fetch users and match
        try {
            const users = await this.getUsers();
            const user = (users || []).find((u: User) => u.username === idOrUsername || (u.email || '').split('@')[0] === idOrUsername || String(u.id) === String(idOrUsername));
            if (user) {
                // @ts-ignore
                const profile = (list || []).find((p: AgentProfile) => String(p.user?.id ?? p.user) === String(user.id));
                if (profile) return profile;
            }
        } catch (e) {
            // ignore
        }

        throw new Error('Agent non trouvé');
    },

    async getClientById(id: string): Promise<ClientProfile> {
        const resp = await api.get(`/users/clients/${id}/`);
        return resp.data;
    },

    // Resolve a client by numeric id or by username identifier
    async getClientByIdentifier(idOrUsername: string): Promise<ClientProfile> {
        // try numeric id first
        if (/^\d+$/.test(idOrUsername)) {
            const resp = await api.get(`/users/clients/${idOrUsername}/`);
            return resp.data;
        }

        // otherwise fetch list and match by username/email-derived key
        const list = await this.getClients();
        const found = (list || []).find((item: ClientProfile) => {
            // @ts-ignore
            const uname = item.user?.username || item.username || item.user?.email?.split('@')?.[0];
            return uname === idOrUsername;
        });
        if (found) return found;

        // as a last resort, try to fetch users and match
        try {
            const users = await this.getUsers();
            const user = (users || []).find((u: User) => u.username === idOrUsername || (u.email || '').split('@')?.[0] === idOrUsername);
            if (user) {
                // @ts-ignore
                const profile = (list || []).find((p: ClientProfile) => p.user?.id === user.id || p.user === user.id);
                if (profile) return profile;
            }
        } catch (e) {
            // ignore
        }

        throw new Error('Client non trouvé');
    },

    async getUsers(): Promise<User[]> {
        const resp = await api.get('/users/users/');
        return resp.data && resp.data.results ? resp.data.results : resp.data;
    },

    async getCurrentUser(): Promise<User> {
        const resp = await api.get('/users/me/');
        return resp.data;
    },

    async deleteAgent(id: string) {
        const resp = await api.delete(`/users/agents/${id}/`);
        return resp.data;
    },

    async deleteClient(id: string) {
        const resp = await api.delete(`/users/clients/${id}/`);
        return resp.data;
    },

    async updateAgent(id: string, payload: Partial<AgentProfile>) {
        const resp = await api.patch(`/users/agents/${id}/`, payload);
        return resp.data;
    },

    async updateUser(id: string | number, payload: Partial<User>) {
        const resp = await api.patch(`/users/users/${id}/`, payload);
        return resp.data;
    },

    async updateClient(id: string, payload: Partial<ClientProfile>) {
        const resp = await api.patch(`/users/clients/${id}/`, payload);
        return resp.data;
    },

    // Préférences utilisateur
    async getUserPreferences() {
        const resp = await api.get('/users/preferences/');
        return resp.data;
    },

    async updateUserPreferences(data: any) {
        const resp = await api.put('/users/preferences/', data);
        return resp.data;
    },

    // Changement de mot de passe
    async changePassword(oldPassword: string, newPassword: string) {
        const resp = await api.post('/users/auth/change-password/', {
            old_password: oldPassword,
            new_password: newPassword,
        });
        return resp.data;
    },
};

export default usersService;
