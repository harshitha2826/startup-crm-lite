import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
  searchLeads,
} from '../controllers/leadController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

// Apply protect middleware to ALL routes in this file
router.use(protect);

// ─── Constants for Validation ────────────────────────────────────────────────

const VALID_STATUSES = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
const VALID_SOURCES = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

// ─── Validation Constraints ──────────────────────────────────────────────────

const createLeadRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),

  body('company')
    .trim()
    .notEmpty().withMessage('Company is required'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address'),

  body('phone')
    .optional()
    .trim(),

  body('status')
    .optional()
    .isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),

  body('source')
    .optional()
    .isIn(VALID_SOURCES).withMessage(`Source must be one of: ${VALID_SOURCES.join(', ')}`),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
];

const updateLeadRules = [
  param('id')
    .isMongoId().withMessage('Invalid lead ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),

  body('company')
    .optional()
    .trim()
    .notEmpty().withMessage('Company cannot be empty'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email must be a valid email address'),

  body('phone')
    .optional()
    .trim(),

  body('status')
    .optional()
    .isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),

  body('source')
    .optional()
    .isIn(VALID_SOURCES).withMessage(`Source must be one of: ${VALID_SOURCES.join(', ')}`),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
];

const updateStatusRules = [
  param('id')
    .isMongoId().withMessage('Invalid lead ID'),

  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(VALID_STATUSES).withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
];

const getLeadsRules = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  query('status')
    .optional()
    .custom((val) => val === 'All' || VALID_STATUSES.includes(val))
    .withMessage('Invalid status filter value'),
];

const idParamRule = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
];

// ─── Lead Routes ──────────────────────────────────────────────────────────────

// Note: Aggregation / Stats endpoints must be registered BEFORE the parametric /:id route
// to avoid parameter collisions (e.g. treating 'stats' as a lead ID).

// 0. GET /api/leads/search - Quick search autocomplete (React SearchBar debounce)
router.get('/search', searchLeads);

// 1. GET /api/leads/stats/summary - Fetch pipeline stats (conversion rate, totals)
router.get('/stats/summary', getLeadStats);
router.get('/stats', getLeadStats); // fallback

// 2. GET /api/leads/stats/monthly - Fetch monthly aggregated counts (last 6 months)
router.get('/stats/monthly', getMonthlyStats);
router.get('/monthly', getMonthlyStats); // fallback

// 3. GET /api/leads - Fetch all leads for authenticated user (paginated, searchable)
router.get('/', validate(getLeadsRules), getLeads);

// 4. POST /api/leads - Create a new lead
router.post('/', validate(createLeadRules), createLead);

// 5. GET /api/leads/:id - Fetch single lead by ID
router.get('/:id', validate(idParamRule), getLeadById);

// 6. PUT /api/leads/:id - Update lead details by ID
router.put('/:id', validate(updateLeadRules), updateLead);

// 7. PATCH /api/leads/:id/status - Update lead status only
router.patch('/:id/status', validate(updateStatusRules), updateLeadStatus);

// 8. DELETE /api/leads/:id - Delete lead by ID
router.delete('/:id', validate(idParamRule), deleteLead);

export default router;
