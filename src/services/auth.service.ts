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
                // also set a cookie so Next.js middleware (if added) can read auth state on requests
                // set SameSite=Lax so cookie is available for top-level navigation while avoiding cross-site issues
                try {
                    // Set cookie with sensible attributes:
                    // - If running over HTTPS, use SameSite=None and Secure so middleware on server receives it in cross-site contexts.
                    // - On HTTP (localhost dev), use SameSite=Lax to allow top-level navigation.
                    const expires = new Date(Date.now() + 8 * 60 * 60 * 1000).toUTCString(); // 8 hours
                    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
                    const sameSite = isSecure ? 'None' : 'Lax';
                    const secureFlag = isSecure ? '; Secure' : '';
                    // include Domain for localhost/127.0.0.1 to ensure middleware reads it consistently
                    let domainPart = '';
                    try {
                        const host = window.location.hostname;
                        if (host && (host === 'localhost' || host === '127.0.0.1')) {
                            domainPart = `; Domain=${host}`;
                        }
                    } catch (e) {
                        // ignore
                    }
                    document.cookie = `access_token=${response.data.access}; Path=/; Expires=${expires}; SameSite=${sameSite}${domainPart}${secureFlag}`;
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
