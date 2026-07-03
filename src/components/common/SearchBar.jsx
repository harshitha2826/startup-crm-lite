import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Props definition for the SearchBar component.
 * @typedef {Object} SearchBarProps
 * @property {string} value - The external search query value.
 * @property {Function} onChange - Callback triggered when the query is updated (debounced).
 */

/**
 * SearchBar Component
 * Controlled input element that debounces typing changes by 300ms to optimize search rendering.
 * Includes a quick clear action trigger.
 * 
 * @param {SearchBarProps} props - Component props.
 * @returns {React.JSX.Element}
 */
const SearchBar = ({ value, onChange }) => {
  const [prevValue, setPrevValue] = useState(value);
  const [localValue, setLocalValue] = useState(value);

  // Sync internal state with external value prop during render if value prop changes
  if (value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value);
  }

  // Debounce the change propagation by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        className="block w-full pl-9 pr-10 py-2 h-9 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-400 dark:placeholder:text-gray-500"
        placeholder="Search by name, company, or email..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        aria-label="Search by name, company, or email"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
          title="Clear search"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
