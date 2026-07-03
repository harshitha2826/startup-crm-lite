import { STATUS_COLORS } from '../constants/analyticsColors';

/**
 * Parses a date string safely, returning null if invalid.
 * @param {string|Date} dateVal - Date representation.
 * @returns {Date|null} Date object or null.
 */
const safeParseDate = (dateVal) => {
  if (!dateVal) return null;
  const d = new Date(dateVal);
  return isNaN(d.getTime()) ? null : d;
};

/**
 * Filter leads by a given start and end date range based on their createdAt timestamp.
 * 
 * @param {Array<Object>} leads - Leads dataset.
 * @param {Date|null} startDate - Start boundary.
 * @param {Date|null} endDate - End boundary.
 * @returns {Array<Object>} Filtered leads array.
 */
export const filterLeadsByDateRange = (leads = [], startDate, endDate) => {
  return leads.filter((lead) => {
    const created = safeParseDate(lead.createdAt);
    if (!created) return false;
    if (startDate && created < startDate) return false;
    if (endDate && created > endDate) return false;
    return true;
  });
};

/**
 * Calculates counts and percentages for each sales status.
 * 
 * @param {Array<Object>} leads - Leads dataset.
 * @returns {Array<{ name: string, value: number, percentage: number, color: string }>}
 */
export const getStatusDistribution = (leads = []) => {
  const total = leads.length;
  const counts = {
    New: 0,
    Contacted: 0,
    Meeting: 0,
    Proposal: 0,
    Won: 0,
    Lost: 0,
  };

  leads.forEach((lead) => {
    const rawStatus = lead.status || lead.stage || 'New';
    let normalized = rawStatus;

    if (rawStatus === 'Meeting Scheduled') {
      normalized = 'Meeting';
    } else if (rawStatus === 'Proposal Sent') {
      normalized = 'Proposal';
    }

    if (counts[normalized] !== undefined) {
      counts[normalized]++;
    }
  });

  return Object.entries(counts).map(([name, count]) => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      name,
      value: count,
      percentage,
      color: STATUS_COLORS[name] || '#94A3B8',
    };
  });
};

/**
 * Groups monthly lead intake counts over the last 6 months.
 * 
 * @param {Array<Object>} leads - Leads dataset.
 * @returns {Array<{ name: string, count: number }>}
 */
export const getMonthlyLeads = (leads = []) => {
  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const name = d.toLocaleString('default', { month: 'short' });
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months.push({ name, key, count: 0 });
  }

  leads.forEach((lead) => {
    const date = safeParseDate(lead.createdAt);
    if (!date) return;

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const target = months.find((m) => m.key === key);
    if (target) {
      target.count++;
    }
  });

  return months.map(({ name, count }) => ({ name, count }));
};

/**
 * Calculates conversion rates (Won / Total) per month over the last 6 months.
 * 
 * @param {Array<Object>} leads - Leads dataset.
 * @returns {Array<{ name: string, rate: number }>}
 */
export const getConversionByMonth = (leads = []) => {
  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const name = d.toLocaleString('default', { month: 'short' });
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months.push({ name, key, won: 0, total: 0 });
  }

  leads.forEach((lead) => {
    const date = safeParseDate(lead.createdAt);
    if (!date) return;

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const target = months.find((m) => m.key === key);
    if (target) {
      target.total++;
      const currentStatus = lead.status || lead.stage || 'New';
      if (currentStatus === 'Won') {
        target.won++;
      }
    }
  });

  return months.map(({ name, won, total }) => {
    const rate = total > 0 ? Math.round((won / total) * 100) : 0;
    return { name, rate };
  });
};

/**
 * Calculates monthly revenue won over the last 6 months.
 * 
 * @param {Array<Object>} leads - Leads dataset.
 * @returns {Array<{ name: string, revenue: number }>}
 */
export const getRevenueByMonth = (leads = []) => {
  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const name = d.toLocaleString('default', { month: 'short' });
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months.push({ name, key, revenue: 0 });
  }

  leads.forEach((lead) => {
    const currentStatus = lead.status || lead.stage || 'New';
    if (currentStatus !== 'Won') return;

    // Use wonAt timestamp if available, otherwise fallback to createdAt
    const date = safeParseDate(lead.wonAt || lead.createdAt);
    if (!date) return;

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const target = months.find((m) => m.key === key);
    if (target) {
      target.revenue += Number(lead.value) || 0;
    }
  });

  return months.map(({ name, revenue }) => ({ name, revenue }));
};

/**
 * Sums all active lead values (excludes Won/Lost).
 * 
 * @param {Array<Object>} leads - Leads dataset.
 * @returns {number}
 */
export const getPipelineValue = (leads = []) => {
  return leads
    .filter((lead) => {
      const status = lead.status || lead.stage || 'New';
      return status !== 'Won' && status !== 'Lost';
    })
    .reduce((acc, lead) => acc + (Number(lead.value) || 0), 0);
};

/**
 * Sums Won lead values.
 * 
 * @param {Array<Object>} leads - Leads dataset.
 * @returns {number}
 */
export const getWonRevenue = (leads = []) => {
  return leads
    .filter((lead) => {
      const status = lead.status || lead.stage || 'New';
      return status === 'Won';
    })
    .reduce((acc, lead) => acc + (Number(lead.value) || 0), 0);
};

/**
 * Computes average sales cycle in days (wonAt - createdAt).
 * 
 * @param {Array<Object>} leads - Leads dataset.
 * @returns {number}
 */
export const getAverageSalesCycle = (leads = []) => {
  const wonLeads = leads.filter((lead) => {
    const status = lead.status || lead.stage || 'New';
    return status === 'Won' && lead.createdAt;
  });

  if (wonLeads.length === 0) return 0;

  let totalDays = 0;
  let count = 0;

  wonLeads.forEach((lead) => {
    const start = safeParseDate(lead.createdAt);
    // Use wonAt or find historical Won transition
    let end = safeParseDate(lead.wonAt);
    if (!end) {
      const wonHistory = lead.history?.find(
        (h) =>
          h.type === 'status' &&
          (h.text.toLowerCase().includes('won') || h.text.toLowerCase().includes('closed'))
      );
      if (wonHistory) {
        end = safeParseDate(wonHistory.time);
      }
    }

    if (start && end) {
      const diffMs = end.getTime() - start.getTime();
      if (diffMs >= 0) {
        totalDays += diffMs / (1000 * 60 * 60 * 24);
        count++;
      }
    }
  });

  if (count === 0) {
    // Return standard fallback if there are Won leads but no transitions logged
    return wonLeads.length > 0 ? 5 : 0;
  }

  return Math.round(totalDays / count);
};

/**
 * Calculates lost rate percentage (Lost Leads / Total Leads).
 * 
 * @param {Array<Object>} leads - Leads dataset.
 * @returns {number}
 */
export const getLostRate = (leads = []) => {
  if (leads.length === 0) return 0;
  const lostLeads = leads.filter((lead) => {
    const status = lead.status || lead.stage || 'New';
    return status === 'Lost';
  });
  return Math.round((lostLeads.length / leads.length) * 100);
};

/**
 * Aggregates count of leads per source, sorted descending.
 * 
 * @param {Array<Object>} leads - Leads dataset.
 * @returns {Array<{ name: string, count: number }>}
 */
export const getLeadSourceStats = (leads = []) => {
  const sources = {};
  leads.forEach((lead) => {
    const src = lead.source || 'Other';
    sources[src] = (sources[src] || 0) + 1;
  });

  return Object.entries(sources)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Calculates progression volume, drop-off rates, and conversion metrics for funnel stages.
 * Stages: New -> Contacted -> Meeting -> Proposal -> Won
 * 
 * @param {Array<Object>} leads - Leads dataset.
 * @returns {Array<{ name: string, count: number, conversionRate: number, dropOffRate: number }>}
 */
export const getFunnelData = (leads = []) => {
  const stageWeights = {
    New: 1,
    Contacted: 2,
    Meeting: 3,
    Proposal: 4,
    Won: 5,
  };

  // Convert "Meeting Scheduled" -> "Meeting", "Proposal Sent" -> "Proposal"
  const getStageLevel = (stageName) => {
    let normalized = stageName || 'New';
    if (normalized === 'Meeting Scheduled') normalized = 'Meeting';
    else if (normalized === 'Proposal Sent') normalized = 'Proposal';
    return stageWeights[normalized] || 1;
  };

  const totals = {
    New: 0,
    Contacted: 0,
    Meeting: 0,
    Proposal: 0,
    Won: 0,
  };

  leads.forEach((lead) => {
    const currentStage = lead.status || lead.stage || 'New';
    const level = getStageLevel(currentStage);

    // If a lead reaches a level, it has conceptually gone through all previous levels
    if (level >= 1) totals.New++;
    if (level >= 2) totals.Contacted++;
    if (level >= 3) totals.Meeting++;
    if (level >= 4) totals.Proposal++;
    if (level >= 5) totals.Won++;
  });

  const stages = ['New', 'Contacted', 'Meeting', 'Proposal', 'Won'];

  return stages.map((name, index) => {
    const count = totals[name];
    const prevCount = index > 0 ? totals[stages[index - 1]] : count;

    // Conversion rate relative to the absolute first stage (New)
    const conversionRate = totals.New > 0 ? Math.round((count / totals.New) * 100) : 0;
    
    // Drop-off rate relative to previous stage
    const dropOffRate = prevCount > 0 ? Math.round(((prevCount - count) / prevCount) * 100) : 0;

    return {
      name,
      count,
      conversionRate,
      dropOffRate,
    };
  });
};

/**
 * Computes Sales Velocity metric: (Opportunities * Win Rate * Avg Deal Size) / Cycle Length.
 * Displayed in ₹/day.
 * 
 * @param {Array<Object>} leads - Leads dataset.
 * @returns {{ velocity: number, opportunities: number, winRate: number, avgDealSize: number, cycleLength: number }}
 */
export const getSalesVelocity = (leads = []) => {
  const opportunities = leads.length;
  if (opportunities === 0) return { velocity: 0, opportunities: 0, winRate: 0, avgDealSize: 0, cycleLength: 0 };

  const wonLeads = leads.filter((l) => (l.status || l.stage) === 'Won');
  const winRate = opportunities > 0 ? wonLeads.length / opportunities : 0;

  const totalWonVal = wonLeads.reduce((acc, l) => acc + (Number(l.value) || 0), 0);
  const avgDealSize = wonLeads.length > 0 ? totalWonVal / wonLeads.length : 0;

  const cycleLength = getAverageSalesCycle(leads) || 5; // default fallback 5 days to avoid dividing by 0

  const velocity = cycleLength > 0 ? (opportunities * winRate * avgDealSize) / cycleLength : 0;

  return {
    velocity: Math.round(velocity),
    opportunities,
    winRate: Math.round(winRate * 100),
    avgDealSize: Math.round(avgDealSize),
    cycleLength,
  };
};

/**
 * Predicts next month revenue using average Won revenue of last 6 months.
 * 
 * @param {Array<Object>} leads - Leads dataset.
 * @returns {{ forecastedRevenue: number, confidenceScore: number, trend: 'up' | 'down' | 'stable' }}
 */
export const getForecastRevenue = (leads = []) => {
  const monthlyRevenue = getRevenueByMonth(leads);
  const totalRevenues = monthlyRevenue.reduce((acc, m) => acc + m.revenue, 0);
  const avgRevenue = monthlyRevenue.length > 0 ? totalRevenues / monthlyRevenue.length : 0;

  // Compute a simple growth/trend gradient to estimate forecast and confidence
  let trend = 'stable';
  let growthFactor = 1.0;
  let confidenceScore = 80; // default base percentage

  if (monthlyRevenue.length >= 2) {
    const firstHalf = monthlyRevenue.slice(0, 3).reduce((acc, m) => acc + m.revenue, 0);
    const secondHalf = monthlyRevenue.slice(3).reduce((acc, m) => acc + m.revenue, 0);

    if (secondHalf > firstHalf) {
      trend = 'up';
      growthFactor = 1.1; // 10% forecasted growth
      confidenceScore = 85;
    } else if (secondHalf < firstHalf) {
      trend = 'down';
      growthFactor = 0.9; // 10% forecasted drop
      confidenceScore = 70;
    }
  }

  if (leads.length === 0) confidenceScore = 0;

  return {
    forecastedRevenue: Math.round(avgRevenue * growthFactor),
    confidenceScore,
    trend,
  };
};

/**
 * Ranks owners/sales reps based on won revenue.
 * 
 * @param {Array<Object>} leads - Leads dataset.
 * @returns {Array<{ name: string, revenue: number, count: number }>}
 */
export const getTopPerformers = (leads = []) => {
  const stats = {};
  leads.forEach((lead) => {
    const ownerName = lead.owner || 'Unassigned';
    if (!stats[ownerName]) {
      stats[ownerName] = { revenue: 0, count: 0 };
    }
    const currentStatus = lead.status || lead.stage || 'New';
    if (currentStatus === 'Won') {
      stats[ownerName].revenue += Number(lead.value) || 0;
      stats[ownerName].count++;
    }
  });

  return Object.entries(stats)
    .map(([name, data]) => ({
      name,
      revenue: data.revenue,
      count: data.count,
    }))
    .sort((a, b) => b.revenue - a.revenue);
};

/**
 * Group active log updates by day for the last 30 days to populate the Heatmap grid.
 * 
 * @param {Array<Object>} leads - Leads dataset.
 * @returns {Array<{ date: string, value: number, count: number }>}
 */
export const getActivityHeatmapData = (leads = []) => {
  const activityCounts = {};
  
  // Fill last 30 days with 0 initial counts
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    activityCounts[dateStr] = 0;
  }

  // Iterate over history entries and count logs
  leads.forEach((lead) => {
    if (lead.history) {
      lead.history.forEach((h) => {
        if (!h.time) return;
        const dateStr = h.time.split('T')[0];
        if (activityCounts[dateStr] !== undefined) {
          activityCounts[dateStr]++;
        }
      });
    }
  });

  return Object.entries(activityCounts).map(([date, count]) => {
    // Value represents standard heatmap level: 0 (none), 1 (1-2), 2 (3-4), 3 (5-6), 4 (7+)
    let value = 0;
    if (count > 0 && count <= 2) value = 1;
    else if (count > 2 && count <= 4) value = 2;
    else if (count > 4 && count <= 6) value = 3;
    else if (count > 6) value = 4;

    return {
      date,
      count,
      value,
    };
  });
};
