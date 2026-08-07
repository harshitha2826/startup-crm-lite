/**
 * Props definition for the StatusBadge component.
 * @typedef {Object} StatusBadgeProps
 * @property {string} status - The status value to display.
 * @property {string} [className] - Additional Tailwind classes for customization.
 */

/**
 * StatusBadge Component
 * Displays a pill-shaped badge with semantic coloring based on lead status.
 * 
 * @param {StatusBadgeProps} props - Component props.
 * @returns {React.JSX.Element}
 */
const StatusBadge = ({ status, className = '' }) => {
  const getBadgeStyles = (statusVal) => {
    if (!statusVal) return 'bg-muted/10 text-muted border-muted/20';

    const normalized = statusVal.toLowerCase().trim();

    switch (normalized) {
      case 'new':
        return 'bg-muted/10 text-muted border-muted/25';
      case 'contacted':
        return 'bg-primary/10 text-primary border-primary/25';
      case 'meeting scheduled':
        return 'bg-accent/10 text-accent border-accent/25';
      case 'proposal sent':
        return 'bg-secondary/10 text-secondary border-secondary/25';
      case 'won':
        return 'bg-success/10 text-success border-success/25';
      case 'lost':
        return 'bg-danger/10 text-danger border-danger/25';
      default:
        return 'bg-primary/10 text-primary border-primary/25';
    }
  };

  const badgeStyle = getBadgeStyles(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle} ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
