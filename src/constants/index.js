/**
 * Startup CRM Lite - Centralized Constants
 */

export const LEAD_STAGES = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  MEETING_SCHEDULED: 'Meeting Scheduled',
  PROPOSAL_SENT: 'Proposal Sent',
  WON: 'Won',
  LOST: 'Lost'
};

export const LEAD_STAGE_OPTIONS = [
  LEAD_STAGES.NEW,
  LEAD_STAGES.CONTACTED,
  LEAD_STAGES.MEETING_SCHEDULED,
  LEAD_STAGES.PROPOSAL_SENT,
  LEAD_STAGES.WON,
  LEAD_STAGES.LOST
];

export const LEAD_SOURCES = {
  WEBSITE: 'Website',
  REFERRAL: 'Referral',
  LINKEDIN: 'LinkedIn',
  COLD_CALL: 'Cold Call',
  EMAIL_CAMPAIGN: 'Email Campaign',
  OTHER: 'Other'
};

export const LEAD_SOURCE_OPTIONS = [
  LEAD_SOURCES.WEBSITE,
  LEAD_SOURCES.REFERRAL,
  LEAD_SOURCES.LINKEDIN,
  LEAD_SOURCES.COLD_CALL,
  LEAD_SOURCES.EMAIL_CAMPAIGN,
  LEAD_SOURCES.OTHER
];

export const TEMPERATURES = {
  HOT: 'Hot',
  WARM: 'Warm',
  COLD: 'Cold'
};

export const PRIORITIES = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
};

export const DEFAULT_LEAD_OWNER = 'Alex Rivera';
