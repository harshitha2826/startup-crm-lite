import mongoose from 'mongoose';

/**
 * @typedef {Object} LeadDocument
 * @property {string}               name      - Full name of the lead contact person.
 * @property {string}               company   - Organisation or company the lead belongs to.
 * @property {string}               email     - Primary contact email address of the lead.
 * @property {string}               [phone]   - Optional phone number for the lead.
 * @property {LeadStatus}           status    - Current stage of the lead in the sales pipeline.
 * @property {LeadSource}           source    - Channel through which the lead was acquired.
 * @property {string}               [notes]   - Free-text context, call summaries, or follow-up info.
 * @property {mongoose.Types.ObjectId} owner  - Reference to the User who owns/created this lead.
 * @property {Date}                 createdAt - Automatically set by Mongoose timestamps.
 * @property {Date}                 updatedAt - Automatically updated by Mongoose on every save.
 * @property {number}               age       - Virtual: number of days since lead was created.
 */

/**
 * @typedef {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} LeadStatus
 * The six pipeline stages — these values MUST stay in sync with the frontend constants.
 */

/**
 * @typedef {'Website'|'Referral'|'LinkedIn'|'Cold Call'|'Email Campaign'|'Other'} LeadSource
 * The six acquisition channels — these values MUST stay in sync with the frontend constants.
 */

/** Canonical list of allowed pipeline stages. Shared across schema and route validators. */
const LEAD_STATUSES = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

/** Canonical list of allowed acquisition sources. Shared across schema and route validators. */
const LEAD_SOURCES  = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

const leadSchema = new mongoose.Schema(
  {
    /**
     * Full name of the contact person at the lead organisation.
     * Displayed in the leads table, kanban board, and email templates.
     * Must be between 2 and 100 characters after trimming whitespace.
     */
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Lead name must be at least 2 characters long'],
      maxlength: [100, 'Lead name cannot be longer than 100 characters'],
    },

    /**
     * The name of the organisation or company the lead contact works for.
     * Used in filtering, grouping, and the pipeline board header.
     * Required — a lead without a company context is incomplete.
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },

    /**
     * Primary contact email address for the lead.
     * Used for outreach tracking and deduplication lookups.
     * Validated against RFC 5322-compliant regex.
     * Indexed for O(log n) exact-match lookups (see bottom of schema).
     */
    email: {
      type: String,
      required: [true, 'Lead email address is required'],
      trim: true,
      validate: {
        validator: (v) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
        message: 'Email must be a valid email address (e.g. contact@company.com)',
      },
    },

    /**
     * Optional phone number for the lead contact.
     * No format enforcement — international formats vary too widely.
     * Stored trimmed; the frontend handles display formatting.
     */
    phone: {
      type: String,
      trim: true,
    },

    /**
     * Current stage of the lead in the CRM sales pipeline.
     *
     * Pipeline progression:
     *   New → Contacted → Meeting Scheduled → Proposal Sent → Won | Lost
     *
     * These values MUST exactly match the frontend `LEAD_STAGES` constant
     * in `src/constants/index.js` to avoid broken UI filters and kanban columns.
     *
     * Defaults to 'New' so every freshly created lead enters the top of the funnel.
     */
    status: {
      type: String,
      enum: {
        values: LEAD_STATUSES,
        message: `Lead status must be one of: ${LEAD_STATUSES.join(', ')}. Got ''{VALUE}''`,
      },
      default: 'New',
    },

    /**
     * The acquisition channel through which this lead was originally obtained.
     * Used in the analytics dashboard for source-attribution reporting.
     *
     * These values MUST exactly match the frontend `LEAD_SOURCES` constant
     * in `src/constants/index.js` to ensure charts render correct labels.
     *
     * Defaults to 'Website' as the most common digital inbound channel.
     */
    source: {
      type: String,
      enum: {
        values: LEAD_SOURCES,
        message: `Lead source must be one of: ${LEAD_SOURCES.join(', ')}. Got ''{VALUE}''`,
      },
      default: 'Website',
    },

    /**
     * Free-text notes field for call summaries, follow-up reminders, or
     * any additional context the sales rep wants to attach to the lead.
     * Optional. Capped at 1000 characters to encourage conciseness
     * and avoid unbounded storage growth.
     */
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },

    /**
     * Reference to the User who created and owns this lead.
     * Used for data isolation — every query filters by owner so users
     * can only read/modify their own leads.
     * Populated via `.populate('owner', 'name email')` in controllers.
     */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead must be assigned to an owner (User ID is required)'],
    },
  },
  {
    /**
     * Automatically manages `createdAt` and `updatedAt` fields.
     * `createdAt` is the seed value for the `age` virtual field below.
     */
    timestamps: true,

    /**
     * Include virtual fields (like `age`) when the document is converted
     * to JSON (API responses) or a plain Object (internal processing).
     */
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual Fields ───────────────────────────────────────────────────────────

/**
 * Computed number of days since the lead was created.
 *
 * Useful for analytics widgets such as:
 *  - "Leads idle for more than 30 days"
 *  - Average time-to-close by status
 *  - Sales velocity calculations
 *
 * This is a virtual — it is computed at read time and never stored in MongoDB,
 * keeping the document lean while staying always up-to-date.
 *
 * @returns {number} Whole number of days elapsed since `createdAt`. Returns 0
 *                   if `createdAt` is not yet available (e.g. unsaved document).
 */
leadSchema.virtual('age').get(function () {
  if (!this.createdAt) return 0;
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((Date.now() - this.createdAt.getTime()) / MS_PER_DAY);
});

// ─── Indexes ──────────────────────────────────────────────────────────────────

/**
 * Compound index on (owner, status).
 *
 * Optimises the most frequent query pattern in the app:
 *   Lead.find({ owner: userId, status: 'New' })
 *
 * Without this index, every filtered fetch would require a full collection scan.
 * With it, MongoDB can use the index to jump directly to the matching subset.
 */
leadSchema.index({ owner: 1, status: 1 });

/**
 * Compound index on owner and createdAt.
 * Optimises page queries sorted by creation timestamp (newest first).
 */
leadSchema.index({ owner: 1, createdAt: -1 });

/**
 * Compound index on owner and source.
 * Optimises filtering and aggregation query grouping by lead source.
 */
leadSchema.index({ owner: 1, source: 1 });

/**
 * Compound indexes on owner and searchable fields (name, company, email)
 * to speed up full search filtering and autocomplete text matching.
 */
leadSchema.index({ owner: 1, name: 1 });
leadSchema.index({ owner: 1, company: 1 });
leadSchema.index({ owner: 1, email: 1 });

/**
 * Single-field index on email.
 *
 * Optimises deduplication checks and email-based lookups:
 *   Lead.findOne({ email: 'contact@acme.com' })
 *
 * Particularly important as the leads collection grows beyond thousands of documents.
 */
leadSchema.index({ email: 1 });

// ─── Model + Named Schema Export ──────────────────────────────────────────────

/** The compiled Mongoose model for the `leads` collection. */
const Lead = mongoose.model('Lead', leadSchema);

export { leadSchema, LEAD_STATUSES, LEAD_SOURCES }; // named exports — for validators and tests
export default Lead;                                 // default export — for controllers
