import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getProfile,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

// ==============================================================================
// PRODUCTION SECURITY NOTE:
// In production, an API rate limiter should be placed on auth routes to prevent
// brute-force credential stuffing and DoS attacks.
// e.g.:
// import rateLimit from 'express-rate-limit';
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // Limit each IP to 5 login/register requests per windowMs
//   message: 'Too many authentication requests, please try again after 15 minutes'
// });
// router.use(authLimiter);
// ==============================================================================

// ─── Validation Constraints ──────────────────────────────────────────────────

const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

const updateProfileRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('currentPassword')
    .optional()
    .notEmpty().withMessage('Current password is required to change password'),

  body('newPassword')
    .optional()
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
];

// ─── Auth Routes ──────────────────────────────────────────────────────────────

// 1. POST /api/auth/register - Register a new user
router.post('/register', validate(registerRules), register);

// 2. POST /api/auth/login - Login user and return token
router.post('/login', validate(loginRules), login);

// 3. GET /api/auth/profile - Retrieve authenticated user profile
router.get('/profile', protect, getProfile);

// 4. PUT /api/auth/profile - Update authenticated user profile details
router.put('/profile', protect, validate(updateProfileRules), updateProfile);

// 5. GET /api/auth/me - Alias path for profile retrieval (common convention)
router.get('/me', protect, getProfile);

export default router;
