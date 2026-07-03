import { Zap, TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../common/Card';

const formatRupees = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

/**
 * SalesVelocityCard Component
 * Displays the speed of closing revenue in Rupees per day, with mathematical formula breakdowns.
 */
const SalesVelocityCard = ({ velocityData, prevVelocityData }) => {
  const current = velocityData.velocity || 0;
  const prev = prevVelocityData?.velocity || 0;
  
  // Calculate change vs previous period
  const change = prev > 0 ? Math.round(((current - prev) / prev) * 100) : 0;
  const hasWonDeals = velocityData.opportunities > 0 && velocityData.winRate > 0;

  return (
    <Card className="hoverable flex flex-col justify-between h-full" hoverable>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Sales Velocity</h3>
            <p className="text-xs text-muted font-normal mt-0.5">Average revenue entering the pipeline per day.</p>
          </div>
          <span className="p-2.5 rounded-xl shrink-0 bg-primary/10 text-primary animate-pulse">
            <Zap className="w-4.5 h-4.5 fill-primary/20 stroke-[2]" />
          </span>
        </div>

        {/* Large velocity metric display */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            {hasWonDeals ? `${formatRupees(current)}/day` : '₹0/day'}
          </h2>
          
          <div className="flex items-center gap-1.5 text-xs">
            {change !== 0 ? (
              <span className={`inline-flex items-center gap-0.5 font-bold ${change > 0 ? 'text-success' : 'text-danger'}`}>
                {change > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{change > 0 ? `+${change}%` : `${change}%`}</span>
              </span>
            ) : (
              <span className="text-gray-400 dark:text-gray-500 font-medium">0% change</span>
            )}
            <span className="text-gray-400 dark:text-gray-500 font-normal">vs previous period</span>
          </div>
        </div>
      </div>

      {/* Math breakdown detail cards */}
      <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100/60 dark:border-gray-700/50 text-[10px] select-none">
        <div className="bg-gray-50/50 dark:bg-gray-900/40 p-2 border border-gray-100/50 dark:border-gray-800/40 rounded-xl space-y-0.5">
          <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-semibold">Opps</span>
          <span className="font-bold text-gray-800 dark:text-gray-300 text-xs block">{velocityData.opportunities} Leads</span>
        </div>

        <div className="bg-gray-50/50 dark:bg-gray-900/40 p-2 border border-gray-100/50 dark:border-gray-800/40 rounded-xl space-y-0.5">
          <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-semibold">Win Rate</span>
          <span className="font-bold text-gray-800 dark:text-gray-300 text-xs block">{velocityData.winRate}%</span>
        </div>

        <div className="bg-gray-50/50 dark:bg-gray-900/40 p-2 border border-gray-100/50 dark:border-gray-800/40 rounded-xl space-y-0.5 col-span-2 flex items-center justify-between">
          <div>
            <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-semibold">Avg Deal Size</span>
            <span className="font-bold text-gray-800 dark:text-gray-300 text-xs block">{formatRupees(velocityData.avgDealSize)}</span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 dark:text-gray-500 uppercase tracking-wider block font-semibold">Avg Cycle</span>
            <span className="font-bold text-gray-800 dark:text-gray-300 text-xs block">{velocityData.cycleLength} Days</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SalesVelocityCard;
