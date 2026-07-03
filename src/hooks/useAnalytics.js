import { useState, useMemo } from 'react';
import { useLeads } from '../context/LeadContext';
import {
  filterLeadsByDateRange,
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getPipelineValue,
  getWonRevenue,
  getAverageSalesCycle,
  getLostRate,
  getLeadSourceStats,
  getFunnelData,
  getSalesVelocity,
  getForecastRevenue,
  getTopPerformers,
  getActivityHeatmapData
} from '../utils/analyticsHelpers';

/**
 * useAnalytics Hook
 * Custom consumer hook fetching, filtering, and preparing CRM data for the Analytics Dashboard.
 *
 * @returns {Object} Analytics state, filtered records, computed stats, and change handler callbacks.
 */
export const useAnalytics = () => {
  const { leads = [] } = useLeads();
  const [dateFilter, setDateFilter] = useState('last-30'); // 'last-7' | 'last-30' | 'last-90' | 'this-year' | 'custom'
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  // Compute date boundaries
  const dateBoundaries = useMemo(() => {
    const now = new Date();
    let startDate = null;
    let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    let prevStartDate = null;
    let prevEndDate = null;

    switch (dateFilter) {
      case 'last-7':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0);
        prevEndDate = new Date(startDate.getTime() - 1);
        prevStartDate = new Date(prevEndDate.getFullYear(), prevEndDate.getMonth(), prevEndDate.getDate() - 6, 0, 0, 0, 0);
        break;
      case 'last-30':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29, 0, 0, 0, 0);
        prevEndDate = new Date(startDate.getTime() - 1);
        prevStartDate = new Date(prevEndDate.getFullYear(), prevEndDate.getMonth(), prevEndDate.getDate() - 29, 0, 0, 0, 0);
        break;
      case 'last-90':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 89, 0, 0, 0, 0);
        prevEndDate = new Date(startDate.getTime() - 1);
        prevStartDate = new Date(prevEndDate.getFullYear(), prevEndDate.getMonth(), prevEndDate.getDate() - 89, 0, 0, 0, 0);
        break;
      case 'this-year':
        startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        prevEndDate = new Date(startDate.getTime() - 1);
        prevStartDate = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
        break;
      case 'custom':
        if (customRange.start) {
          startDate = new Date(customRange.start);
          startDate.setHours(0, 0, 0, 0);
        }
        if (customRange.end) {
          endDate = new Date(customRange.end);
          endDate.setHours(23, 59, 59, 999);
        }
        if (startDate && endDate) {
          const rangeDiffMs = endDate.getTime() - startDate.getTime();
          prevEndDate = new Date(startDate.getTime() - 1);
          prevStartDate = new Date(prevEndDate.getTime() - rangeDiffMs);
        }
        break;
      default:
        break;
    }

    return { startDate, endDate, prevStartDate, prevEndDate };
  }, [dateFilter, customRange]);

  // Current period and previous period filtered datasets
  const { currentLeads, previousLeads } = useMemo(() => {
    const current = filterLeadsByDateRange(leads, dateBoundaries.startDate, dateBoundaries.endDate);
    const previous = dateBoundaries.prevStartDate && dateBoundaries.prevEndDate
      ? filterLeadsByDateRange(leads, dateBoundaries.prevStartDate, dateBoundaries.prevEndDate)
      : [];
    return { currentLeads: current, previousLeads: previous };
  }, [leads, dateBoundaries]);

  // Memoized KPI metrics calculations
  const kpis = useMemo(() => {
    // Current period metrics
    const totalLeads = currentLeads.length;
    const wonLeadsCount = currentLeads.filter((l) => (l.status || l.stage) === 'Won').length;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeadsCount / totalLeads) * 100) : 0;
    const pipelineValue = getPipelineValue(currentLeads);
    const wonRevenue = getWonRevenue(currentLeads);
    const salesCycle = getAverageSalesCycle(currentLeads);
    const lostRate = getLostRate(currentLeads);

    // Previous period metrics for comparison
    const prevTotalLeads = previousLeads.length;
    const prevWonLeadsCount = previousLeads.filter((l) => (l.status || l.stage) === 'Won').length;
    const prevConversionRate = prevTotalLeads > 0 ? Math.round((prevWonLeadsCount / prevTotalLeads) * 100) : 0;
    const prevPipelineValue = getPipelineValue(previousLeads);
    const prevWonRevenue = getWonRevenue(previousLeads);
    const prevSalesCycle = getAverageSalesCycle(previousLeads);
    const prevLostRate = getLostRate(previousLeads);

    // Calculate growth percentages
    const getGrowth = (currentVal, prevVal) => {
      if (!prevVal || prevVal === 0) return currentVal > 0 ? 100 : 0;
      return Math.round(((currentVal - prevVal) / prevVal) * 100);
    };

    return {
      totalLeads: {
        value: totalLeads,
        growth: getGrowth(totalLeads, prevTotalLeads),
      },
      conversionRate: {
        value: conversionRate,
        growth: conversionRate - prevConversionRate, // direct point difference
      },
      pipelineValue: {
        value: pipelineValue,
        growth: getGrowth(pipelineValue, prevPipelineValue),
      },
      wonRevenue: {
        value: wonRevenue,
        growth: getGrowth(wonRevenue, prevWonRevenue),
      },
      salesCycle: {
        value: salesCycle,
        growth: prevSalesCycle > 0 ? salesCycle - prevSalesCycle : 0, // change in days
      },
      lostRate: {
        value: lostRate,
        growth: lostRate - prevLostRate, // direct point difference
      },
    };
  }, [currentLeads, previousLeads]);

  // Memoized Chart calculations
  const chartData = useMemo(() => {
    return {
      statusDistribution: getStatusDistribution(currentLeads),
      monthlyLeads: getMonthlyLeads(leads), // Uses all historical leads for 6 month growth overview
      conversionByMonth: getConversionByMonth(leads), // Uses all historical leads for 6 month cohort overview
      revenueByMonth: getRevenueByMonth(leads), // Uses all historical leads for 6 month revenue overview
      leadSourceStats: getLeadSourceStats(currentLeads),
      funnelData: getFunnelData(currentLeads),
      salesVelocity: getSalesVelocity(currentLeads),
      prevSalesVelocity: getSalesVelocity(previousLeads),
      forecast: getForecastRevenue(leads), // Uses all historical leads for predicting next month
      topPerformers: getTopPerformers(currentLeads),
      activityHeatmap: getActivityHeatmapData(currentLeads),
    };
  }, [currentLeads, previousLeads, leads]);

  return {
    dateFilter,
    setDateFilter,
    customRange,
    setCustomRange,
    kpis,
    chartData,
    currentLeads,
    totalLeadsAllTime: leads.length,
  };
};
