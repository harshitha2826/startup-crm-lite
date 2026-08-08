import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ─── Token Generator Helper ──────────────────────────────────────────────────

/**
 * Helper function to generate a JWT for a user.
 * Not a route handler.
 *
 * @param {string} userId - User ObjectId string
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'your_super_secret_key_make_it_long_and_random';
  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ─── Auth Handlers ────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return errorResponse(res, 'Email already exists', 409);
    }

    // 2. Create new user document
    const user = await User.create({
      name,
      email,
      password,
    });

    // 3. Generate token with explicit 7d expiration as requested
    const token = generateToken(user._id);

    // 4. Return user and token. User.toJSON() automatically removes password.
    return successResponse(
      res,
      { token, user },
      'User registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate user and issue JWT.
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find user and explicitly include password field for verification
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // Use generic error for security to prevent email enumeration
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // 2. Check if account is active
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    // 3. Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // 4. Generate JWT
    const token = generateToken(user._id);

    return successResponse(
      res,
      { token, user },
      'Login successful',
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve current user profile.
 * GET /api/auth/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user has already been populated by the protect middleware
    return successResponse(res, req.user, 'Profile retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile (Name or Password).
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, currentPassword, newPassword } = req.body;

    // Fetch user including password hash (needed for password update check)
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return errorResponse(res, 'User no longer exists', 404);
    }

    // 1. Allow updating name only
    if (name) {
      user.name = name;
    }

    // 2. Validate and update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return errorResponse(res, 'Current password is required to change password', 400);
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return errorResponse(res, 'Invalid current password', 401);
      }

      user.password = newPassword; // The pre-save hook will hash this on save
    }

    await user.save();

    // 3. Return updated user (cast to JSON to strip password hash)
    const updatedUser = user.toJSON();

    return successResponse(
      res,
      updatedUser,
      'Profile updated successfully',
      200
    );
  } catch (error) {
    next(error);
  }
};
