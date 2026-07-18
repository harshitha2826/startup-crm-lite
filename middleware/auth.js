import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Protect middleware — ensures the request contains a valid JWT in the Authorization header.
 *
 * Expectations:
 * - Header: Authorization: Bearer <token>
 *
 * Success:
 * - Decodes token, fetches user (without password), attaches to `req.user`, calls next()
 *
 * Failure:
 * - Returns 401 Unauthorized with descriptive messages for missing, invalid, expired tokens, or missing accounts.
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if token is provided
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided, access denied', 401);
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token signature and expiration
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token has expired, please login again', 401);
      }
      return errorResponse(res, 'Token is invalid', 401);
    }

    // 3. Find the user in the database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return errorResponse(res, 'User belonging to this token no longer exists', 401);
    }

    // 4. Attach user to request object and proceed
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
