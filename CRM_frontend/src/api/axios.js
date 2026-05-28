import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;

export const apiClient = axios.create({ baseURL: BASE_URL, timeout: TIMEOUT, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, withCredentials: true });

export const setAuthToken = token => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    sessionStorage.setItem('access_token', token);
  } else {
    delete apiClient.defaults.headers.common.Authorization;
    sessionStorage.removeItem('access_token');
  }
};

export const isAuthenticated = () => !!apiClient.defaults.headers.common.Authorization;

export const initializeAuthToken = () => {
  const token = sessionStorage.getItem('access_token');
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return true;
  }
  return false;
};

let isRefreshing = false, failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

const handleApiError = error => {
  if (error.response?.status === 409 || error.response?.status === 404) return Promise.reject(error);
  if (error.response?.data?.message) return Promise.reject(new Error(error.response.data.message));
  return Promise.reject(new Error('An unexpected error occurred.'));
};

const refreshAccessToken = async () => {
  try {
    const { data } = await axios.post(`${BASE_URL}/v1/refresh`, {}, { timeout: TIMEOUT, withCredentials: true, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }});
    if (data?.access_token) {
      setAuthToken(data.access_token);
      return data.access_token;
    }
    throw new Error('No access token in refresh response');
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

apiClient.interceptors.request.use(config => {
  if (config.requireAuth !== false && !config.headers?.Authorization && apiClient.defaults.headers.common.Authorization) {
    config.headers.Authorization = apiClient.defaults.headers.common.Authorization;
  }
  return config;
}, error => Promise.reject(error));

apiClient.interceptors.response.use(res => res.data, async error => {
  const originalRequest = error.config;
  const isAuthEndpoint = originalRequest.url?.includes('/login') || originalRequest.url?.includes('/refresh') || originalRequest.url?.includes('/logout');

  if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => failedQueue.push({ resolve, reject })).then(() => apiClient(originalRequest)).catch(err => Promise.reject(err));
    }
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newAccessToken = await refreshAccessToken();
      processQueue(null, newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      setAuthToken(null);
      if (!window.location.pathname.includes('/login')) {
        console.log('Refresh token expired, redirecting to login');
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
  return handleApiError(error);
});

export const apiRequest = async (endpoint, options = {}, requireAuth = true) => {
  const config = { url: endpoint, requireAuth, ...options, method: options.method?.toLowerCase() || 'get' };
  if (config.method !== 'get' && config.method !== 'head') {
    config.data = options.data || options.body;
  }
  return apiClient(config);
};