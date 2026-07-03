import { memo } from 'react';

const presetStyles = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  muted: 'bg-muted/10 text-muted border-muted/20',
};

const getCRMStyle = (value) => {
  if (!value) return presetStyles.muted;
  
  const normalized = value.toLowerCase().trim();
  
  // Stages
  if (normalized === 'new') return presetStyles.primary;
  if (normalized === 'contacted') return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
  if (normalized === 'demo scheduled' || normalized === 'meeting scheduled') return presetStyles.warning;
  if (normalized === 'proposal sent') return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
  if (normalized === 'closed won' || normalized === 'won') return presetStyles.success;
  if (normalized === 'closed lost' || normalized === 'lost') return presetStyles.danger;
  
  // Temperatures
  if (normalized === 'hot') return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  if (normalized === 'warm') return presetStyles.warning;
  if (normalized === 'cold') return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
  
  // Priorities
  if (normalized === 'high') return presetStyles.danger;
  if (normalized === 'medium') return presetStyles.warning;
  if (normalized === 'low') return presetStyles.muted;
  
  return presetStyles.primary;
};

const Badge = memo(({ children, variant, className = '' }) => {
  const resolvedStyle = variant ? presetStyles[variant] : getCRMStyle(children);
  
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${resolvedStyle} ${className}`}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
