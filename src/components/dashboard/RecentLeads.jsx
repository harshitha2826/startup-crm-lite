import Badge from '../common/Badge';

/**
 * Props definition for the RecentLeads component.
 * @typedef {Object} RecentLeadsProps
 * @property {Array<Object>} leads - Array of CRM lead objects.
 * @property {Function} [onSelectLead] - Optional callback triggered when a row is clicked.
 */

/**
 * RecentLeads Component
 * Pulls the 5 most recently created leads and structures them inside a clean table.
 * 
 * @param {RecentLeadsProps} props - Component props.
 * @returns {React.JSX.Element}
 */
const RecentLeads = ({ leads = [], onSelectLead }) => {
  // Sort leads by creation timestamp (most recent first) and select the top 5
  const latestLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  /**
   * Helper function to convert ISO string to localized human-readable date.
   * @param {string} dateString - ISO Date string.
   * @returns {string} Formatted date.
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col justify-between">
      {/* Header section */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recent Inbound Deals</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">A list of the latest five leads added to the sales queue.</p>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px] font-bold">
              <th className="py-2.5 px-4 font-semibold select-none">Lead Contact</th>
              <th className="py-2.5 px-4 font-semibold select-none">Company</th>
              <th className="py-2.5 px-4 font-semibold select-none">Pipeline Stage</th>
              <th className="py-2.5 px-4 font-semibold select-none text-right">Date Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {latestLeads.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500 dark:text-gray-400 italic">
                  No recent leads recorded.
                </td>
              </tr>
            ) : (
              latestLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => onSelectLead && onSelectLead(lead)}
                  className={`transition-colors ${
                    onSelectLead 
                      ? 'hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{lead.name}</td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{lead.company}</td>
                  <td className="py-3 px-4">
                    {/* Badge primitive mapping styling variables automatically */}
                    <Badge>{lead.stage}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-400 font-medium">
                    {formatDate(lead.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentLeads;
