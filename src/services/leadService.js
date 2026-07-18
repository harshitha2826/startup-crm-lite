import api from './api';

/**
 * leadService
 * ───────────
 * Service layer for lead CRUD and metrics aggregation utilizing the global Axios client.
 */
const leadService = {
  /**
   * Fetch leads with optional status, search query, and pagination parameters.
   * GET /api/leads
   */
  async getLeads(params = {}) {
    const response = await api.get('/api/leads', { params });
    return response.data;
  },

  /**
   * Create a new lead.
   * POST /api/leads
   */
  async createLead(leadData) {
    const response = await api.post('/api/leads', leadData);
    return response.data;
  },

  /**
   * Update an existing lead by ID.
   * PUT /api/leads/:id
   */
  async updateLead(id, leadData) {
    const response = await api.put(`/api/leads/${id}`, leadData);
    return response.data;
  },

  /**
   * Update the status/stage of a lead.
   * PATCH /api/leads/:id/status
   */
  async updateLeadStatus(id, status) {
    const response = await api.patch(`/api/leads/${id}/status`, { status });
    return response.data;
  },

  /**
   * Delete a lead by ID.
   * DELETE /api/leads/:id
   */
  async deleteLead(id) {
    const response = await api.delete(`/api/leads/${id}`);
    return response.data;
  },

  /**
   * Fetch aggregated lead pipeline stats.
   * GET /api/leads/stats/summary
   */
  async getLeadStats() {
    const response = await api.get('/api/leads/stats/summary');
    return response.data;
  },

  /**
   * Fetch monthly aggregated counts (last 6 months trend).
   * GET /api/leads/stats/monthly
   */
  async getMonthlyStats() {
    const response = await api.get('/api/leads/stats/monthly');
    return response.data;
  }
};

export default leadService;
