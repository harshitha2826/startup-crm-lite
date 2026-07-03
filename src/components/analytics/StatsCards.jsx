import {
  Users,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  Award,
  Clock,
  Skull
} from 'lucide-react';
import Card from '../common/Card';

/**
 * Formats a numeric value into the Indian Rupee system (₹).
 * 
 * @param {number} num - The value to format.
 * @returns {string} Formatted currency.
 */
const formatRupees = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

/**
 * Helper to render trend growth badges.
 * 
 * @param {number} rate - The difference percentage.
 * @param {boolean} isLowerBetter - Invert warning classes if lower is desired (e.g. Lost Rate, Sales Cycle).
 */
const renderTrendBadge = (rate, isLowerBetter = false) => {
  if (rate === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-md">
        <span>0%</span>
      </span>
    );
  }

  const isPositive = rate > 0;
  const isGood = isLowerBetter ? !isPositive : isPositive;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md ${
        isGood
          ? 'text-success bg-success/10 dark:bg-success/15'
          : 'text-danger bg-danger/10 dark:bg-danger/15'
      }`}
    >
      {isPositive ? (
        <TrendingUp className="w-3 h-3 shrink-0" />
      ) : (
        <TrendingDown className="w-3 h-3 shrink-0" />
      )}
      <span>{isPositive ? `+${rate}` : rate}%</span>
    </span>
  );
};

/**
 * StatsCards Component
 * Renders the top summary KPI section containing 6 responsive metrics block.
 */
const StatsCards = ({ kpis }) => {
  const cards = [
    {
      title: 'Total Leads',
      value: kpis.totalLeads.value,
      growth: kpis.totalLeads.growth,
      icon: Users,
      color: 'bg-primary/10 text-primary',
      formatter: (v) => v.toLocaleString()
    },
    {
      title: 'Conversion Rate',
      value: kpis.conversionRate.value,
      growth: kpis.conversionRate.growth,
      icon: Award,
      color: 'bg-success/10 text-success',
      formatter: (v) => `${v}%`
    },
    {
      title: 'Pipeline Value',
      value: kpis.pipelineValue.value,
      growth: kpis.pipelineValue.growth,
      icon: CircleDollarSign,
      color: 'bg-indigo-500/10 text-indigo-500',
      formatter: formatRupees
    },
    {
      title: 'Won Revenue',
      value: kpis.wonRevenue.value,
      growth: kpis.wonRevenue.growth,
      icon: Award,
      color: 'bg-emerald-500/10 text-emerald-500',
      formatter: formatRupees
    },
    {
      title: 'Average Sales Cycle',
      value: kpis.salesCycle.value,
      growth: kpis.salesCycle.growth,
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-500',
      formatter: (v) => `${v} Day${v === 1 ? '' : 's'}`,
      isLowerBetter: true
    },
    {
      title: 'Lost Rate',
      value: kpis.lostRate.value,
      growth: kpis.lostRate.growth,
      icon: Skull,
      color: 'bg-danger/10 text-danger',
      formatter: (v) => `${v}%`,
      isLowerBetter: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="hoverable flex flex-col justify-between" hoverable>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider block select-none">
                  {card.title}
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {card.formatter(card.value)}
                </h3>
              </div>
              <span className={`p-2.5 rounded-xl shrink-0 ${card.color}`}>
                <Icon className="w-4 h-4 stroke-[2]" />
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100/60 dark:border-gray-700/50 pt-2 text-[10px]">
              <span className="text-gray-400 dark:text-gray-500 select-none">vs prev period</span>
              {renderTrendBadge(card.growth, card.isLowerBetter)}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
