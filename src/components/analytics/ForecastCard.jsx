import { BarChart, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import Card from '../common/Card';

const formatRupees = (num) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

/**
 * ForecastCard Component
 * Displays AI-styled revenue forecast predictions using historical data weights.
 */
const ForecastCard = ({ forecastData }) => {
  const { forecastedRevenue = 0, confidenceScore = 0, trend = 'stable' } = forecastData;

  const trendConfigs = {
    up: {
      color: 'text-success bg-success/10',
      icon: TrendingUp,
      text: 'Accelerating growth momentum'
    },
    down: {
      color: 'text-danger bg-danger/10',
      icon: TrendingDown,
      text: 'Decelerating sales momentum'
    },
    stable: {
      color: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
      icon: RefreshCw,
      text: 'Stable baseline projections'
    }
  };

  const currentTrend = trendConfigs[trend] || trendConfigs.stable;
  const TrendIcon = currentTrend.icon;

  return (
    <Card className="hoverable flex flex-col justify-between h-full" hoverable>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Revenue Forecast</h3>
            <p className="text-xs text-muted font-normal mt-0.5">Calculated using 6-month historical averages.</p>
          </div>
          <span className="p-2.5 rounded-xl shrink-0 bg-primary/10 text-primary">
            <BarChart className="w-4.5 h-4.5 stroke-[2]" />
          </span>
        </div>

        {/* Large predicted metric */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider block">Predicted Next Month</span>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            {formatRupees(forecastedRevenue)}
          </h2>
          
          <div className="flex items-center gap-1.5 text-xs">
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded ${currentTrend.color}`}>
              <TrendIcon className="w-3 h-3 shrink-0" />
              <span>{trend.toUpperCase()}</span>
            </span>
            <span className="text-gray-500 dark:text-gray-400 font-medium text-[11px]">{currentTrend.text}</span>
          </div>
        </div>
      </div>

      {/* Confidence score visual indicator */}
      <div className="space-y-1.5 mt-6 pt-4 border-t border-gray-100/60 dark:border-gray-700/50">
        <div className="flex items-center justify-between text-xs font-semibold select-none">
          <span className="text-gray-500 dark:text-gray-400">Confidence Score</span>
          <span className="text-primary">{confidenceScore}%</span>
        </div>
        
        {/* Progress track */}
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${confidenceScore}%` }}
          />
        </div>
        
        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-normal leading-relaxed select-none">
          Confidence levels scale dynamically depending on deal volumes, cohort counts, and conversion velocities.
        </p>
      </div>
    </Card>
  );
};

export default ForecastCard;
