import { Suspense } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import StatsCards from '../components/analytics/StatsCards';
import PieChartCard from '../components/analytics/PieChartCard';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import RevenueChartCard from '../components/analytics/RevenueChartCard';
import LeadSourceChart from '../components/analytics/LeadSourceChart';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';
import ForecastCard from '../components/analytics/ForecastCard';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';
import TopPerformersCard from '../components/analytics/TopPerformersCard';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';
import LoadingSkeleton from '../components/analytics/LoadingSkeleton';

/**
 * Analytics Page Component
 * Master analytics view for Startup CRM Lite, integrating all metrics, charts,
 * filters, forecasts, and leaderboards into a responsive SaaS-grade dashboard.
 *
 * @returns {React.JSX.Element}
 */
const Analytics = () => {
  const {
    dateFilter,
    setDateFilter,
    customRange,
    setCustomRange,
    kpis,
    chartData,
    currentLeads,
    totalLeadsAllTime
  } = useAnalytics();

  // If no leads exist at all in the system, render an empty CTA state
  if (totalLeadsAllTime === 0) {
    return <EmptyAnalyticsState />;
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <div className="p-4 md:p-6 space-y-6 w-full">

        {/* ─────────────── Page Header ─────────────── */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Track sales performance, growth trends, and revenue forecasts.
          </p>
        </div>

        {/* ─────────────── Date Range Filters ─────────────── */}
        <AnalyticsFilters
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          customRange={customRange}
          setCustomRange={setCustomRange}
        />

        {/* ─────────────── KPI Summary Cards (6 metrics) ─────────────── */}
        <StatsCards kpis={kpis} />

        {/* ─────────────── Leads with no data in current filter range ─────────────── */}
        {currentLeads.length === 0 && (
          <div className="flex items-center justify-center py-10 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-center">
            <div className="max-w-sm space-y-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                No leads found in selected date range
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Try expanding the date filter or choose "This Year" to see all records.
              </p>
            </div>
          </div>
        )}

        {currentLeads.length > 0 && (
          <>
            {/* ─────────────── Row 1: Status Distribution + Funnel ─────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PieChartCard data={chartData.statusDistribution} />
              <FunnelChartCard data={chartData.funnelData} />
            </div>

            {/* ─────────────── Row 2: Monthly Leads + Conversion Trend ─────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BarChartCard data={chartData.monthlyLeads} />
              <LineChartCard data={chartData.conversionByMonth} />
            </div>

            {/* ─────────────── Row 3: Revenue + Lead Sources ─────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RevenueChartCard data={chartData.revenueByMonth} />
              <LeadSourceChart data={chartData.leadSourceStats} />
            </div>

            {/* ─────────────── Row 4: Activity Heatmap (full width) ─────────────── */}
            <div className="w-full">
              <ActivityHeatmap data={chartData.activityHeatmap} />
            </div>

            {/* ─────────────── Row 5: Top Performers + Forecast + Sales Velocity ─────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TopPerformersCard data={chartData.topPerformers} />
              <ForecastCard forecastData={chartData.forecast} />
              <SalesVelocityCard
                velocityData={chartData.salesVelocity}
                prevVelocityData={chartData.prevSalesVelocity}
              />
            </div>
          </>
        )}

      </div>
    </Suspense>
  );
};

export default Analytics;
