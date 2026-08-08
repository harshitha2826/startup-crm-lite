import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global Express error-handling middleware.
 * Intercepts various categories of database and application errors and
 * normalizes them into clean HTTP JSON responses.
 *
 * @param {Error} err - Error object thrown in controllers or upstream middleware
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = null;

  // 1. Mongoose Validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = {};
    // Extract user-friendly schema messages per field
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
  }
  // 2. Mongoose Cast Error (Invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }
  // 3. MongoDB Duplicate Key (code 11000)
  else if (err.code === 11000) {
    statusCode = 409;
    message = 'Email already exists';
  }
  // 4. JWT Authorization errors
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
  }

  // In production, keep 500 errors generic to avoid leakages
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Server error';
  }

  // Construct response payload
  const responseBody = {
    success: false,
    message,
  };

  if (errors !== null) {
    responseBody.errors = errors;
  }

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    responseBody.stack = err.stack;
  }

  return res.status(statusCode).json(responseBody);
};

export default errorHandler;
