/**
 * Props definition for the PipelineOverview component.
 * @typedef {Object} PipelineOverviewProps
 * @property {Array<Object>} leads - Array of CRM lead objects.
 */

/**
 * PipelineOverview Component
 * Analyzes active leads stages and renders a visual, color-segmented progress bar
 * representing the pipeline weight and deals distribution.
 * 
 * @param {PipelineOverviewProps} props - Component props.
 * @returns {React.JSX.Element}
 */
const PipelineOverview = ({ leads = [] }) => {
  // Define stage order, names, and visual themes
  const stagesConfig = [
    { name: 'New', colorBg: 'bg-primary', colorText: 'text-primary', colorBorder: 'border-primary/20' },
    { name: 'Contacted', colorBg: 'bg-sky-400', colorText: 'text-sky-500', colorBorder: 'border-sky-400/20' },
    { name: 'Meeting Scheduled', colorBg: 'bg-warning', colorText: 'text-warning', colorBorder: 'border-warning/20' },
    { name: 'Proposal Sent', colorBg: 'bg-indigo-500', colorText: 'text-indigo-500', colorBorder: 'border-indigo-500/20' },
    { name: 'Won', colorBg: 'bg-success', colorText: 'text-success', colorBorder: 'border-success/20' },
    { name: 'Lost', colorBg: 'bg-danger', colorText: 'text-danger', colorBorder: 'border-danger/20' },
  ];

  const totalLeads = leads.length;

  // Compute counts and ratios for each stage
  const stagesCalculated = stagesConfig.map((stage) => {
    const count = leads.filter((l) => l.stage === stage.name).length;
    const percentage = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
    return {
      ...stage,
      count,
      percentage
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
      {/* Component Title Header */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Pipeline Stage Distribution</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Proportionate breakdown of active deals in the qualification funnel.</p>
      </div>

      {/* Segmented Horizontal Progress Bar */}
      <div className="flex h-3.5 w-full rounded-full overflow-hidden bg-gray-100 dark:bg-gray-950 mb-6 shadow-inner gap-[2px]">
        {totalLeads === 0 ? (
          <div className="w-full h-full bg-foreground/10 animate-pulse" />
        ) : (
          stagesCalculated.map(
            (stage) =>
              stage.count > 0 && (
                <div
                  key={stage.name}
                  style={{ width: `${stage.percentage}%` }}
                  className={`${stage.colorBg} h-full transition-all duration-300`}
                  title={`${stage.name}: ${stage.count} (${stage.percentage}%)`}
                />
              )
          )
        )}
      </div>

      {/* Legend Grid Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stagesCalculated.map((stage) => (
          <div
            key={stage.name}
            className="flex items-center gap-2.5 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"
          >
            {/* Status Color Dot Indicator */}
            <span className={`w-2.5 h-2.5 rounded-full ${stage.colorBg} shrink-0`} />
            
            {/* Metadata values */}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-gray-900 dark:text-white truncate select-none">
                {stage.name}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                {stage.count} {stage.count === 1 ? 'deal' : 'deals'} ({stage.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineOverview;
