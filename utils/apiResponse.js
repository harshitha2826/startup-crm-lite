/**
 * Standardized API response helpers for Startup CRM Lite.
 * Ensures consistent response envelopes across all endpoints.
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {*} data - Payload to return
 * @param {string} message - Descriptive success message
 * @param {number} statusCode - HTTP status code (defaults to 200)
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} message - Error description
 * @param {number} statusCode - HTTP status code (defaults to 500)
 * @param {Array|Object|null} errors - Specific validation or operational errors
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    message,
  };
  if (errors !== null) {
    payload.errors = errors;
  }
  return res.status(statusCode).json(payload);
};

/**
 * Send a paginated list response.
 * @param {import('express').Response} res
 * @param {Array} data - List of page records
 * @param {number} total - Total records in database matching query
 * @param {number} page - Current page index
 * @param {number} limit - Records per page
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
};

// ─── Backward Compatibility Aliases ───────────────────────────────────────────
export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return successResponse(res, data, message, statusCode);
};

export const sendError = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  return errorResponse(res, message, statusCode, errors);
};
