import axios from 'axios';
import toast from 'react-hot-toast';

// Determine API base URL: Force relative path on Vercel deployments to route to Vercel Serverless Functions
const getBaseURL = () => {
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('.vercel.app')) {
    return '';
  }
  return import.meta.env.VITE_API_URL || '';
};

const api = axios.create({
  baseURL: getBaseURL(),
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
