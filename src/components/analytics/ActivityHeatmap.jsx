import Card from '../common/Card';

/**
 * ActivityHeatmap Component
 * Renders a contribution-like activity grid showing sales activities over the last 30 days.
 */
const ActivityHeatmap = ({ data = [] }) => {
  // Map level integers (0-4) to success-green hex background classes
  const colorLevels = [
    'bg-gray-100 dark:bg-gray-800 border-gray-200/50 dark:border-gray-700/50', // 0
    'bg-emerald-200/60 dark:bg-emerald-950/30 border-emerald-300/20 text-emerald-800 dark:text-emerald-400', // 1
    'bg-emerald-300 dark:bg-emerald-900/50 border-emerald-450/20', // 2
    'bg-emerald-500 dark:bg-emerald-700 border-emerald-600/20', // 3
    'bg-emerald-700 dark:bg-emerald-500 border-emerald-800/20' // 4
  ];

  const formatDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="hoverable flex flex-col justify-between h-full" hoverable>
      <div>
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground">Sales Operations Intensity</h3>
          <p className="text-xs text-muted">Daily operations index tracking leads created, status upgrades, and log comments.</p>
        </div>

        {/* Heatmap Grid wrapper */}
        <div className="flex flex-wrap gap-1.5 justify-center py-4 select-none">
          {data.map((day) => (
            <div
              key={day.date}
              className={`w-6 h-6 rounded-md border flex items-center justify-center text-[9px] font-bold transition-all hover:scale-110 cursor-pointer ${
                colorLevels[day.value] || colorLevels[0]
              }`}
              title={`${formatDateLabel(day.date)}: ${day.count} activities logged`}
            >
              {day.count > 0 && day.count}
            </div>
          ))}
        </div>
      </div>

      {/* Grid Legend bar */}
      <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 border-t border-gray-100/60 dark:border-gray-700/50 pt-3 select-none">
        <span>Operational activity (Last 30 Days)</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          <div className="w-2.5 h-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded" />
          <div className="w-2.5 h-2.5 bg-emerald-200/60 dark:bg-emerald-950/30 border border-emerald-300/20 rounded" />
          <div className="w-2.5 h-2.5 bg-emerald-300 dark:bg-emerald-900/50 border border-emerald-450/20 rounded" />
          <div className="w-2.5 h-2.5 bg-emerald-500 dark:bg-emerald-700 border border-emerald-600/20 rounded" />
          <div className="w-2.5 h-2.5 bg-emerald-700 dark:bg-emerald-500 border border-emerald-800/20 rounded" />
          <span>More</span>
        </div>
      </div>
    </Card>
  );
};

export default ActivityHeatmap;
