import api from './api';

/**
 * authService
 * ───────────
 * Service layer for user authentication utilizing the global Axios client.
 */
const authService = {
  /**
   * Register a new user.
   * POST /api/auth/register
   */
  async register(name, email, password) {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
  },

  /**
   * Login an existing user.
   * POST /api/auth/login
   */
  async login(email, password) {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  /**
   * Logout the user locally (Stateless API).
   */
  logout() {
    localStorage.removeItem('crm-token');
  },

  /**
   * Get the profile details of the current authenticated user.
   * GET /api/auth/profile
   */
  async getProfile() {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  /**
   * Update the user profile (e.g. Name, Password).
   * PUT /api/auth/profile
   */
  async updateProfile(data) {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  }
};

export default authService;
