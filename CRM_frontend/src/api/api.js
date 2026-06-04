import axios from 'axios';

// Get API base URL from environment variables
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
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
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized error
        if (error.response?.status === 401) {
            // Remove token from storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect to login page
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
