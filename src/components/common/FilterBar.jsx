/**
 * Props definition for the FilterBar component.
 * @typedef {Object} FilterBarProps
 * @property {string} activeFilter - Currently active status filter.
 * @property {Function} onFilterChange - Callback triggered when filter is switched.
 * @property {Array<Object>} leads - Leads list to calculate distribution count metrics.
 */

/**
 * FilterBar Component
 * Renders a row of status buttons displaying total counts in parentheses, highlighting the active selection.
 * 
 * @param {FilterBarProps} props - Component props.
 * @returns {React.JSX.Element}
 */
const FilterBar = ({ activeFilter, onFilterChange, leads = [] }) => {
  const filters = ['All', 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];

  /**
   * Calculates the number of leads matching a given filter name.
   * @param {string} filterName - Name of the filter stage.
   * @returns {number} Count of matching leads.
   */
  const getCount = (filterName) => {
    if (filterName === 'All') return leads.length;
    return leads.filter((lead) => (lead.stage || lead.status) === filterName).length;
  };

  return (
    <div className="flex flex-wrap gap-2 items-center w-full">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;
        const count = getCount(filter);
        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 border cursor-pointer select-none ${
              isActive
                ? 'bg-primary border-primary text-white shadow-sm transform active:scale-95'
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 active:bg-gray-100 dark:active:bg-gray-700'
            }`}
            aria-pressed={isActive}
          >
            <span>{filter}</span>
            <span className={`ml-1.5 font-medium text-[10px] ${isActive ? 'text-white/80' : 'text-gray-400/80 dark:text-gray-500/80'}`}>
              ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
