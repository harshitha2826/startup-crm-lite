import { Calendar } from 'lucide-react';

/**
 * AnalyticsFilters Component
 * Renders selectors for filtering data ranges: Last 7 Days, Last 30 Days, Last 90 Days, This Year, Custom Range.
 *
 * @param {Object} props - Component props.
 * @param {string} props.dateFilter - Active filter state value.
 * @param {Function} props.setDateFilter - Callback to toggle filters.
 * @param {Object} props.customRange - Start and end boundaries.
 * @param {Function} props.setCustomRange - Callback to update boundaries.
 * @returns {React.JSX.Element}
 */
const AnalyticsFilters = ({
  dateFilter,
  setDateFilter,
  customRange,
  setCustomRange
}) => {
  const filterOptions = [
    { value: 'last-7', label: 'Last 7 Days' },
    { value: 'last-30', label: 'Last 30 Days' },
    { value: 'last-90', label: 'Last 90 Days' },
    { value: 'this-year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleCustomChange = (e) => {
    const { name, value } = e.target;
    setCustomRange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xs">
      {/* Filters pill bar */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setDateFilter(opt.value)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors duration-200 ${
              dateFilter === opt.value
                ? 'bg-primary text-white shadow-xs'
                : 'bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200/60 dark:border-gray-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Custom Range calendar inputs */}
      {dateFilter === 'custom' && (
        <div className="flex flex-wrap items-center gap-3 animate-in fade-in duration-200 mt-2 sm:mt-0">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>Range:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              name="start"
              value={customRange.start}
              onChange={handleCustomChange}
              className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-primary placeholder:text-gray-400"
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="date"
              name="end"
              value={customRange.end}
              onChange={handleCustomChange}
              className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-primary placeholder:text-gray-400"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsFilters;
