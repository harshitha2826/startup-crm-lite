import { BarChart3, Plus } from 'lucide-react';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

/**
 * EmptyAnalyticsState Component
 * Displays a fallback CTA state when no leads database exists in the CRM provider.
 */
const EmptyAnalyticsState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <div className="max-w-md w-full border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xs animate-fade-in">
        <div className="p-4 bg-primary/10 text-primary rounded-full w-fit mx-auto mb-4">
          <BarChart3 className="w-8 h-8 stroke-[1.5]" />
        </div>
        
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
          No analytics available yet
        </h3>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
          Add your first lead to start tracking pipeline conversions, sales velocity, and revenue forecasts.
        </p>

        <Button
          onClick={() => navigate('/leads')}
          className="flex items-center gap-1.5 mx-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lead</span>
        </Button>
      </div>
    </div>
  );
};

export default EmptyAnalyticsState;
