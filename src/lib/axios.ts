import axios from 'axios';

// Ensure NEXT_PUBLIC_API_URL may be provided without the trailing /api
const _rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const base = _rawBase.endsWith('/api') ? _rawBase : _rawBase.replace(/\/+$/, '') + '/api';

const api = axios.create({
    baseURL: base,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        // Skip adding auth header for login/signup to prevent 401s from invalid prior tokens
        if (config.url?.includes('/login') || config.url?.includes('/signup')) {
            return config;
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If request is for login, don't try to refresh (guard for undefined url)
        if (originalRequest?.url && originalRequest.url.includes('/auth/login')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    // Attempt refresh using plain axios to avoid interceptor loop
                    const refreshUrl = `${base}/token/refresh/`;
                    const resp = await axios.post(refreshUrl, { refresh: refreshToken });
                    if (resp?.data?.access) {
                        localStorage.setItem('access_token', resp.data.access);
                        api.defaults.headers.common['Authorization'] = `Bearer ${resp.data.access}`;
                        originalRequest.headers['Authorization'] = `Bearer ${resp.data.access}`;
                        return api(originalRequest);
                    }
                }
            } catch (e) {
                // Refresh failed
            }

            // Clear tokens but do not perform a hard redirect here.
            // Let the UI (RequireAuth or pages) handle navigation so users
            // already on protected pages aren't unexpectedly bounced.
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            return Promise.reject(error);
        }

        // Handle 403 Forbidden errors (invalid tokens, insufficient permissions)
        if (error.response?.status === 403) {
            // Clear invalid tokens and redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default api;
