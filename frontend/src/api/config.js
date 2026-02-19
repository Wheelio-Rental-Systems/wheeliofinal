import axios from 'axios';

// Backend API base URL — uses environment variable with localhost fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle 401 Unauthorized - token expired or invalid
            if (error.response.status === 401) {
                // Clear stale auth data but do NOT redirect — let the app handle it
                clearToken();
                clearUser();
            }
        }
        return Promise.reject(error);
    }
);

// Token management functions
export const setToken = (token) => {
    localStorage.setItem('wheelio_token', token);
};

export const getToken = () => {
    return localStorage.getItem('wheelio_token');
};

export const clearToken = () => {
    localStorage.removeItem('wheelio_token');
};

export const setUser = (user) => {
    localStorage.setItem('wheelio_user', JSON.stringify(user));
};

export const getUser = () => {
    const user = localStorage.getItem('wheelio_user');
    return user ? JSON.parse(user) : null;
};

export const clearUser = () => {
    localStorage.removeItem('wheelio_user');
};

export const clearAuth = () => {
    clearToken();
    clearUser();
};

export default apiClient;
