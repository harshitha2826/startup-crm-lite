import axios from 'axios';
import toast from 'react-hot-toast';

// Create configured Axios instance
const api = axios.create({
  // When VITE_API_URL is set (e.g. in production), use it as the absolute base.
  // When not set (local dev), use empty string — Vite proxy forwards /api/* to backend.
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '',
});

// Request Interceptor: Automatically attach the JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors like token expiration (401) or network failures
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with an error status code
      if (error.response.status === 401) {
        // Clear expired/invalid token
        localStorage.removeItem('crm-token');
        // Prevent infinite loops if already on the login page
        if (!window.location.pathname.endsWith('/login')) {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // Request was made but no response was received (Network error)
      toast.error('Cannot connect to server. Check your connection.', {
        id: 'network-error-toast', // prevent toast spamming
      });
    }
    return Promise.reject(error);
  }
);

export default api;
