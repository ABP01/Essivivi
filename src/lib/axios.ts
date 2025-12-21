import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
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
                    const refreshUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/token/refresh/`;
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

            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
