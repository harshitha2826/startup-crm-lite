import Button from '../common/Button';
import { Plus, Eye, Download } from 'lucide-react';

/**
 * Props definition for the QuickActions component.
 * @typedef {Object} QuickActionsProps
 * @property {Function} onAddLead - Callback triggered when the "Add New Lead" button is clicked.
 * @property {Function} onViewAll - Callback triggered when the "View All Leads" button is clicked.
 * @property {Function} onExport - Callback triggered when the "Export Data" button is clicked.
 */

/**
 * QuickActions Component
 * Provides key functional shortcut actions for the dashboard viewport.
 * 
 * @param {QuickActionsProps} props - Component props.
 * @returns {React.JSX.Element}
 */
const QuickActions = ({ onAddLead, onViewAll, onExport }) => {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
      {/* Component Title Header */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Action Shortcuts</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Quick triggers for CRM operations and report extraction.</p>
      </div>

      {/* Button Shortcuts List */}
      <div className="grid grid-cols-1 gap-3">
        {/* Shortcut 1: Create Lead */}
        <Button 
          variant="primary" 
          size="md" 
          onClick={onAddLead} 
          className="flex items-center justify-center gap-2 w-full py-2.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lead</span>
        </Button>

        {/* Shortcut 2: Nav to Leads */}
        <Button 
          variant="secondary" 
          size="md" 
          onClick={onViewAll} 
          className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          <Eye className="w-4 h-4" />
          <span>View All Leads</span>
        </Button>

        {/* Shortcut 3: Data Backup Export */}
        <Button 
          variant="outline" 
          size="md" 
          onClick={onExport} 
          className="flex items-center justify-center gap-2 w-full py-2.5"
        >
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
