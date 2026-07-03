import { Search, FolderOpen, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * Props definition for the EmptyState component.
 * @typedef {Object} EmptyStateProps
 * @property {number} totalLeadsCount - Total number of leads in the CRM database.
 * @property {Function} onClearFilters - Callback triggered to clear search query and filters.
 */

/**
 * EmptyState Component
 * Displays a friendly empty state panel when no leads are found, with custom messaging depending
 * on whether the CRM is completely empty vs. just filtered out.
 * 
 * @param {EmptyStateProps} props - Component props.
 * @returns {React.JSX.Element}
 */
const EmptyState = ({ totalLeadsCount, onClearFilters }) => {
  const isCrmEmpty = totalLeadsCount === 0;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md min-h-[300px] animate-fade-in">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full mb-4">
        {isCrmEmpty ? (
          <FolderOpen className="w-8 h-8 stroke-[1.5]" />
        ) : (
          <Search className="w-8 h-8 stroke-[1.5]" />
        )}
      </div>

      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 select-none">
        {isCrmEmpty ? 'No Leads in CRM' : 'No Matching Leads Found'}
      </h3>
      
      <p className="max-w-xs text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
        {isCrmEmpty
          ? 'Your lead pipeline is currently empty. Click the button in the header to register your first business deal.'
          : 'We couldn’t find any leads matching your current search query or status filter selection.'}
      </p>

      {!isCrmEmpty && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearFilters} 
          className="flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
          <span>Clear Search & Filters</span>
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
