import { memo } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * Props definition for the StatsCard component.
 * @typedef {Object} StatsCardProps
 * @property {string} title - The title/label of the metric.
 * @property {string|number} value - The actual value of the metric.
 * @property {React.ComponentType} icon - The Lucide React icon component to render.
 * @property {number} change - The percentage change vs last month.
 * @property {'primary' | 'success' | 'warning' | 'danger'} color - The color theme for the card icon and badge.
 */

/**
 * StatsCard Component
 * Renders a single KPI metric block with status indicators, numeric values, and trend indicators.
 * 
 * @param {StatsCardProps} props - Component props.
 * @returns {React.JSX.Element}
 */
const StatsCard = memo(({ title, value, icon: Icon, change, color = 'primary' }) => {
  // Map semantic color configurations to Tailwind CSS classes
  const colorMaps = {
    primary: {
      bg: 'bg-primary/15',
      text: 'text-primary',
      border: 'border-primary/20',
    },
    success: {
      bg: 'bg-success/15',
      text: 'text-success',
      border: 'border-success/20',
    },
    warning: {
      bg: 'bg-warning/15',
      text: 'text-warning',
      border: 'border-warning/20',
    },
    danger: {
      bg: 'bg-danger/15',
      text: 'text-danger',
      border: 'border-danger/20',
    },
  };

  const selectedColor = colorMaps[color] || colorMaps.primary;
  const isPositive = change >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-900/30 hover:-translate-y-0.5">
      {/* Card Header row */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 select-none">
          {title}
        </span>
        <div className={`p-2 rounded-lg border ${selectedColor.bg} ${selectedColor.text} ${selectedColor.border}`}>
          {Icon && <Icon className="w-4 h-4" />}
        </div>
      </div>

      {/* Main Numeric Metric Value */}
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {value}
        </h3>
        
        {/* Metric Trend Growth Indicator */}
        <div className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${
          isPositive 
            ? 'bg-success/10 text-success border-success/20' 
            : 'bg-danger/10 text-danger border-danger/20'
        }`}>
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
    </div>
  );
});

StatsCard.displayName = 'StatsCard';

export default StatsCard;
