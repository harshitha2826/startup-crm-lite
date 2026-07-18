import Lead from '../models/Lead.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

/**
 * Helper to log operations when in development mode.
 * @param {string} message - Description of the operation
 * @param {*} data - Accompanying payload details
 */
const devLog = (message, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DevLog] ${message}:`, JSON.stringify(data));
  }
};

// ─── Fetch All Leads (Filter, Search, Paginate, Sort) ─────────────────────────

/**
 * Retrieves a list of leads owned by the authenticated user with advanced filters and pagination.
 *
 * Inputs (req.query):
 * - page (number) - Current page (default 1)
 * - limit (number) - Records per page (default 20)
 * - sortBy (string) - Sort field (default 'createdAt')
 * - sortOrder (string) - Sort order: 'asc' or 'desc' (default 'desc')
 * - status (string) - Filter by status
 * - search (string) - Search matching name, company, or email
 * - source (string) - Filter by source
 * - dateFrom (string) - Start date filter (createdAt >= dateFrom)
 * - dateTo (string) - End date filter (createdAt <= dateTo)
 *
 * Outputs:
 * - JSON: Returns status 200 with the array of leads and a pagination object.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<Response>} API Response envelope.
 */
export const getLeads = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      search,
      source,
      dateFrom,
      dateTo,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 20);

    // Build dynamic query filters (enforce user isolation)
    const filter = { owner: req.user._id };

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (source && source !== 'All') {
      filter.source = source;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    // Build sorting configurations
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    devLog('Fetching leads with filters', { filter, sort, pageNum, limitNum });

    // Run queries concurrently for optimal performance
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sort)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Create Lead ──────────────────────────────────────────────────────────────

/**
 * Creates a new lead owned by the authenticated user.
 *
 * Inputs:
 * - Body: name, company, email, phone, status, source, notes
 *
 * Outputs:
 * - JSON: Returns status 201 with the created Lead document.
 *
 * Side Effects:
 * - Saves a new lead document to the database.
 */
export const createLead = async (req, res, next) => {
  try {
    const { name, company, email, phone, status, source, notes } = req.body;

    devLog('Creating new lead', { name, company, email, owner: req.user._id });

    // Create the lead object with the authenticated user ID as owner
    const lead = await Lead.create({
      name,
      company,
      email,
      phone,
      status,
      source,
      notes,
      owner: req.user._id,
    });

    return successResponse(res, lead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// ─── Get Single Lead by ID ────────────────────────────────────────────────────

/**
 * Retrieves a single lead details by ID, checking owner validation.
 *
 * Inputs:
 * - Params: id (string) - MongoDB ObjectId of the lead
 *
 * Outputs:
 * - JSON: Returns status 200 with the Lead document if found and owned by the user.
 * - JSON: Returns status 404 if not found or not owned by user.
 *
 * Side Effects:
 * - None.
 */
export const getLeadById = async (req, res, next) => {
  try {
    const leadId = req.params.id;

    devLog('Retrieving lead by ID', { leadId, owner: req.user._id });

    // Enforce owner isolation inside query directly
    const lead = await Lead.findOne({ _id: leadId, owner: req.user._id });
    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead, 'Lead details retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

// ─── Update Lead ──────────────────────────────────────────────────────────────

/**
 * Updates an existing lead. Restricts modification of the owner field.
 *
 * Inputs:
 * - Params: id (string) - MongoDB ObjectId of the lead
 * - Body: Update payload fields
 *
 * Outputs:
 * - JSON: Returns status 200 with the updated Lead document.
 * - JSON: Returns status 404 if lead is not found/owned by the user.
 *
 * Side Effects:
 * - Modifies an existing lead document in the database.
 */
export const updateLead = async (req, res, next) => {
  try {
    const leadId = req.params.id;
    const updateData = { ...req.body };

    // Security check: never allow changing the lead owner or id parameters
    delete updateData.owner;
    delete updateData._id;

    devLog('Updating lead', { leadId, updateData, owner: req.user._id });

    // Enforce owner isolation inside the update query directly
    const lead = await Lead.findOneAndUpdate(
      { _id: leadId, owner: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead, 'Lead updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

// ─── Update Lead Status Only ──────────────────────────────────────────────────

/**
 * Updates status on a lead (useful for fast drag-and-drop Kanban updates).
 *
 * Inputs:
 * - Params: id (string) - MongoDB ObjectId of the lead
 * - Body: status (string) - New status value
 *
 * Outputs:
 * - JSON: Returns status 200 with the updated Lead document.
 * - JSON: Returns status 404 if lead not found/owned.
 *
 * Side Effects:
 * - Modifies the status attribute on the lead document in the database.
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    const leadId = req.params.id;
    const { status } = req.body;

    devLog('Updating lead status', { leadId, status, owner: req.user._id });

    // Find and update the status in one step
    const lead = await Lead.findOneAndUpdate(
      { _id: leadId, owner: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead, 'Lead status updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

// ─── Delete Lead ──────────────────────────────────────────────────────────────

/**
 * Deletes a lead, ensuring owner access.
 *
 * Inputs:
 * - Params: id (string) - MongoDB ObjectId of the lead
 *
 * Outputs:
 * - JSON: Returns status 200 with a clean success message on deletion.
 * - JSON: Returns status 404 if not found/owned.
 *
 * Side Effects:
 * - Removes the lead document from the database collection.
 */
export const deleteLead = async (req, res, next) => {
  try {
    const leadId = req.params.id;

    devLog('Deleting lead', { leadId, owner: req.user._id });

    const lead = await Lead.findOne({ _id: leadId, owner: req.user._id });
    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    // Call document instance method for delete hook support if added in the future
    await lead.deleteOne();

    return successResponse(res, null, 'Lead deleted successfully', 200);
  } catch (error) {
    next(error);
  }
};

// ─── Get Pipeline Aggregation Statistics ──────────────────────────────────────

/**
 * Computes aggregated pipeline stats for the authenticated user's dashboard cards in a single query.
 *
 * Inputs:
 * - None (req.user._id from protect middleware)
 *
 * Outputs:
 * - JSON: Returns status 200 with the stats aggregation payload.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<Response>} API Response envelope.
 */
export const getLeadStats = async (req, res, next) => {
  try {
    devLog('Running lead pipeline stats aggregation', { owner: req.user._id });

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Run aggregation to calculate all totals, distributions, and growth rates in one pass
    const stats = await Lead.aggregate([
      { $match: { owner: req.user._id } },
      {
        $group: {
          _id: null,
          totalLeads: { $sum: 1 },
          wonLeads: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
          statusNew: { $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] } },
          statusContacted: { $sum: { $cond: [{ $eq: ['$status', 'Contacted'] }, 1, 0] } },
          statusMeetingScheduled: { $sum: { $cond: [{ $eq: ['$status', 'Meeting Scheduled'] }, 1, 0] } },
          statusProposalSent: { $sum: { $cond: [{ $eq: ['$status', 'Proposal Sent'] }, 1, 0] } },
          statusWon: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
          statusLost: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } },
          sourceWebsite: { $sum: { $cond: [{ $eq: ['$source', 'Website'] }, 1, 0] } },
          sourceReferral: { $sum: { $cond: [{ $eq: ['$source', 'Referral'] }, 1, 0] } },
          sourceLinkedIn: { $sum: { $cond: [{ $eq: ['$source', 'LinkedIn'] }, 1, 0] } },
          sourceColdCall: { $sum: { $cond: [{ $eq: ['$source', 'Cold Call'] }, 1, 0] } },
          sourceEmailCampaign: { $sum: { $cond: [{ $eq: ['$source', 'Email Campaign'] }, 1, 0] } },
          sourceOther: { $sum: { $cond: [{ $eq: ['$source', 'Other'] }, 1, 0] } },
          thisMonthLeads: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', startOfThisMonth] },
                1,
                0
              ]
            }
          },
          lastMonthLeads: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ['$createdAt', startOfLastMonth] },
                    { $lt: ['$createdAt', startOfThisMonth] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalLeads: 1,
          thisMonthLeads: 1,
          lastMonthLeads: 1,
          statusBreakdown: {
            New: '$statusNew',
            Contacted: '$statusContacted',
            'Meeting Scheduled': '$statusMeetingScheduled',
            'Proposal Sent': '$statusProposalSent',
            Won: '$statusWon',
            Lost: '$statusLost'
          },
          sourceBreakdown: {
            Website: '$sourceWebsite',
            Referral: '$sourceReferral',
            LinkedIn: '$sourceLinkedIn',
            'Cold Call': '$sourceColdCall',
            'Email Campaign': '$sourceEmailCampaign',
            Other: '$sourceOther'
          },
          conversionRate: {
            $cond: [
              { $gt: ['$totalLeads', 0] },
              { $round: [{ $multiply: [{ $divide: ['$wonLeads', '$totalLeads'] }, 100] }, 1] },
              0
            ]
          },
          growthRate: {
            $cond: [
              { $gt: ['$lastMonthLeads', 0] },
              { $round: [{ $multiply: [{ $divide: [{ $subtract: ['$thisMonthLeads', '$lastMonthLeads'] }, '$lastMonthLeads'] }, 100] }, 1] },
              0
            ]
          }
        }
      }
    ]);

    const defaultStats = {
      totalLeads: 0,
      statusBreakdown: {
        New: 0,
        Contacted: 0,
        'Meeting Scheduled': 0,
        'Proposal Sent': 0,
        Won: 0,
        Lost: 0
      },
      conversionRate: 0,
      sourceBreakdown: {
        Website: 0,
        Referral: 0,
        LinkedIn: 0,
        'Cold Call': 0,
        'Email Campaign': 0,
        Other: 0
      },
      thisMonthLeads: 0,
      lastMonthLeads: 0,
      growthRate: 0
    };

    const result = stats[0] || defaultStats;
    return successResponse(res, result, 'Lead stats compiled successfully', 200);
  } catch (error) {
    next(error);
  }
};

// ─── Get Monthly Statistics (Last 6 Months Trend) ──────────────────────────────

/**
 * Aggregates lead creation volume and won outcomes for the last 6 calendar months.
 * Formats results oldest to newest, fills missing months, and calculates conversion rates.
 *
 * Inputs:
 * - None (req.user._id from protect middleware)
 *
 * Outputs:
 * - JSON: Returns status 200 with an array of exactly 6 month records in chronological order.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<Response>} API Response envelope.
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    devLog('Running monthly stats trend aggregation', { owner: req.user._id });

    // 1. Calculate the start boundary of the last 6 months (5 months ago + current month)
    const startBoundary = new Date();
    startBoundary.setDate(1); // Set to 1st first to avoid day-overflow (e.g. July 31 -> Feb 31 -> March 3)
    startBoundary.setMonth(startBoundary.getMonth() - 5);
    startBoundary.setHours(0, 0, 0, 0);

    // 2. Perform year/month aggregation grouped by createdAt dates
    const stats = await Lead.aggregate([
      {
        $match: {
          owner: req.user._id,
          createdAt: { $gte: startBoundary },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: 1 },
          won: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } }
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    // 3. Standardize output to include all 6 months (filling empty months with 0s)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1); // Set to 1st first to avoid day-overflow
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-indexed month index matching mongo $month
      const monthLabel = `${monthNames[d.getMonth()]} ${year}`;

      const matchedStats = stats.find(
        (s) => s._id.year === year && s._id.month === month
      );

      const total = matchedStats ? matchedStats.total : 0;
      const won = matchedStats ? matchedStats.won : 0;
      const lost = matchedStats ? matchedStats.lost : 0;
      const conversionRate = total > 0 ? parseFloat(((won / total) * 100).toFixed(1)) : 0.0;

      monthlyStats.push({
        month: monthLabel,
        total,
        won,
        lost,
        conversionRate,
      });
    }

    return successResponse(res, monthlyStats, 'Monthly trend stats compiled successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Performs a fast autocomplete search on name, company, and email for React SearchBar.
 * Enforces owner isolation, limits projection to vital fields, and caps results at 5.
 *
 * Inputs (req.query):
 * - q (string) - Query string to search
 * - limit (number) - Max results to return (default 5, capped at 5)
 *
 * Outputs:
 * - JSON: Returns status 200 with the matched autocomplete leads array.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<Response>} API Response envelope.
 */
export const searchLeads = async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;
    const limitNum = Math.min(5, Math.max(1, parseInt(limit, 10) || 5));

    if (!q || !q.trim()) {
      return successResponse(res, [], 'Empty query string');
    }

    const query = q.trim();

    // Owner isolated search filter
    const filter = {
      owner: req.user._id,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    };

    // Project only the required autocomplete fields
    const leads = await Lead.find(filter)
      .select('_id name company email status')
      .limit(limitNum);

    return successResponse(res, leads, 'Search autocomplete results fetched successfully');
  } catch (error) {
    next(error);
  }
};
