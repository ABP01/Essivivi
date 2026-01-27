import api from '@/lib/axios';

export interface LoginResponse {
    access: string;
    refresh: string;
}

export const authService = {
    async login(username: string, password: string): Promise<LoginResponse> {
        const u = username.trim();
        const p = password.trim();
        try {
            console.log('Login attempt:', { u, p });
            const response = await api.post<LoginResponse>('/users/auth/login/', { username: u, password: p });
            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                // Note: Backend now sets HttpOnly cookies, so no need to set client-side cookie here
                // The middleware will read the HttpOnly cookie set by the server
            }
            return response.data;
        } catch (err: any) {
            // surface the error for callers; keep console minimal
            console.error('[authService] login error:', err?.message || err);
            throw err;
        }
    },

    async getCurrentUser() {
        const response = await api.get('/users/me/');
        return response.data;
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
            // remove cookie (match attributes used when setting)
            const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
            const secureFlag = isSecure ? '; Secure' : '';
            document.cookie = `access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax${secureFlag}`;
        } catch (e) { }
        if (typeof window !== 'undefined') window.location.replace('/login');
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('access_token');
    }
};
