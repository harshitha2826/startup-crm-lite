import StatusBadge from './StatusBadge';
import { Pencil, Trash2, Mail, Phone, Calendar, Globe } from 'lucide-react';

/**
 * Props definition for the LeadTable component.
 * @typedef {Object} LeadTableProps
 * @property {Array<Object>} leads - Array of CRM lead objects.
 * @property {Function} onEdit - Callback triggered when the edit icon is clicked.
 * @property {Function} onDelete - Callback triggered when the delete icon is clicked.
 */

/**
 * LeadTable Component
 * Renders a tabular list layout for CRM leads, featuring structured columns and row actions.
 * 
 * @param {LeadTableProps} props - Component props.
 * @returns {React.JSX.Element}
 */
const LeadTable = ({ leads = [], onEdit, onDelete }) => {
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px] font-bold">
              <th className="py-3.5 px-5 select-none">Name</th>
              <th className="py-3.5 px-5 select-none">Company</th>
              <th className="py-3.5 px-5 select-none">Status</th>
              <th className="py-3.5 px-5 select-none hidden lg:table-cell">Email</th>
              <th className="py-3.5 px-5 select-none hidden lg:table-cell">Source</th>
              <th className="py-3.5 px-5 select-none">Date Added</th>
              <th className="py-3.5 px-5 select-none text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {leads.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500 dark:text-gray-400 italic">
                  No leads found.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {/* Lead Name */}
                  <td className="py-3.5 px-5 font-semibold text-gray-900 dark:text-white">
                    <div className="flex flex-col">
                      <span>{lead.name}</span>
                      {lead.phone && (
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal md:hidden flex items-center gap-0.5 mt-0.5">
                          <Phone className="w-3 h-3 inline shrink-0" /> {lead.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  {/* Company */}
                  <td className="py-3.5 px-5 text-gray-500 dark:text-gray-400 font-medium">
                    {lead.company}
                  </td>
                  
                  {/* Status Badge */}
                  <td className="py-3.5 px-5">
                    <StatusBadge status={lead.stage} />
                  </td>
                  
                  {/* Email */}
                  <td className="py-3.5 px-5 text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    {lead.email ? (
                      <div className="flex items-center gap-1.5 max-w-[200px]">
                        <Mail className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
                        <a 
                          href={`mailto:${lead.email}`} 
                          className="hover:text-primary hover:underline truncate text-gray-700 dark:text-gray-300"
                          title={lead.email}
                        >
                          {lead.email}
                        </a>
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500/50 italic">-</span>
                    )}
                  </td>
                  
                  {/* Source */}
                  <td className="py-3.5 px-5 text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    <span className="inline-flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
                      <span>{lead.source || 'Other'}</span>
                    </span>
                  </td>
                  
                  {/* Date Added */}
                  <td className="py-3.5 px-5 text-gray-500 dark:text-gray-400 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
                      <span>{formatDate(lead.createdAt)}</span>
                    </span>
                  </td>
                  
                  {/* Actions Column */}
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEdit(lead)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer"
                        title="Edit Lead"
                        aria-label={`Edit ${lead.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="p-1.5 hover:bg-danger/10 rounded-lg text-gray-500 dark:text-gray-400 hover:text-danger transition-colors cursor-pointer"
                        title="Delete Lead"
                        aria-label={`Delete ${lead.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

export default LeadTable;
