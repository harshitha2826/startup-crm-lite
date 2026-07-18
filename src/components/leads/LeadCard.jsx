import StatusBadge from './StatusBadge';
import { Pencil, Trash2, Mail, Phone, Calendar, Globe } from 'lucide-react';

/**
 * Props definition for the LeadCard component.
 * @typedef {Object} LeadCardProps
 * @property {Object} lead - The CRM lead object.
 * @property {Function} onEdit - Callback triggered when edit button is clicked.
 * @property {Function} onDelete - Callback triggered when delete button is clicked.
 */

/**
 * LeadCard Component
 * Renders a card layout for a single lead, showing contact details and actions.
 * 
 * @param {LeadCardProps} props - Component props.
 * @returns {React.JSX.Element}
 */
const LeadCard = ({ lead, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-900/30 hover:border-primary/20">
      
      {/* Top Header Row: Company and Actions */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate" title={lead.company}>
            {lead.company}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1 mt-0.5">
            <Globe className="w-3.5 h-3.5" />
            <span className="truncate">{lead.source || 'Other'}</span>
          </span>
        </div>
        
        {/* Pencil and Trash Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onEdit(lead)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-primary transition-colors cursor-pointer"
            title="Edit Lead"
            aria-label="Edit Lead"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(lead.id)}
            className="p-1.5 hover:bg-danger/10 rounded-lg text-gray-500 dark:text-gray-400 hover:text-danger transition-colors cursor-pointer"
            title="Delete Lead"
            aria-label="Delete Lead"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lead Contact Name & Status Pill */}
      <div className="flex items-center justify-between gap-2 mb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {lead.name}
        </span>
        <StatusBadge status={lead.status || lead.stage} />
      </div>

      {/* Body Details: Email and Phone */}
      <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
        {lead.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <a 
              href={`mailto:${lead.email}`} 
              className="hover:text-primary hover:underline truncate text-gray-700 dark:text-gray-300"
              title={lead.email}
            >
              {lead.email}
            </a>
          </div>
        )}
        
        {lead.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <a 
              href={`tel:${lead.phone}`} 
              className="hover:text-primary hover:underline truncate text-gray-700 dark:text-gray-300"
              title={lead.phone}
            >
              {lead.phone}
            </a>
          </div>
        )}

        <div className="flex items-center gap-2 text-[10px] text-gray-500/80 dark:text-gray-400/80 pt-1">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>Added: {formatDate(lead.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
