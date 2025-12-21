import api from '@/lib/axios';

export interface LoginResponse {
    access: string;
    refresh: string;
}

export const authService = {
    async login(username: string, password: string): Promise<LoginResponse> {
        try {
            const response = await api.post<LoginResponse>('/users/auth/login/', { username, password });
            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                    // also set a cookie so Next.js middleware (if added) can read auth state on requests
                    try {
                        document.cookie = `access_token=${response.data.access}; path=/`;
                    } catch (e) {
                        // ignore (SSR contexts)
                    }
            }
            return response.data;
        } catch (err: any) {
            // surface the error for callers; keep console minimal
            console.error('[authService] login error:', err?.message || err);
            throw err;
        }
    },

    async register(username: string, email: string, password: string, role: string = 'client', phoneNumber?: string, extra?: Record<string, any>) {
        const payload: any = { username, email, password, role, ...(extra || {}) };
        if (phoneNumber) payload.phone_number = phoneNumber;
        const response = await api.post('/users/auth/signup/', payload);
        return response.data;
    },


    async logout() {
        const refresh = localStorage.getItem('refresh_token');
        if (refresh) {
            try {
                await api.post('/users/auth/logout/', { refresh });
            } catch (error) {
                console.error('Logout failed', error);
            }
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        try {
            // remove cookie
            document.cookie = 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        } catch (e) {}
        if (typeof window !== 'undefined') window.location.replace('/login');
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('access_token');
    }
};
