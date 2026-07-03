import { memo } from 'react';

const variants = {
  primary: 'bg-primary hover:bg-primary/90 active:scale-[0.98] text-white border-transparent shadow-sm focus:ring-2 focus:ring-primary/20',
  secondary: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 active:scale-[0.98] shadow-sm',
  outline: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 active:scale-[0.98]',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white border-transparent active:scale-[0.98]',
  destructive: 'bg-danger hover:bg-danger/90 active:scale-[0.98] text-white border-transparent shadow-sm focus:ring-2 focus:ring-danger/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm font-semibold rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base font-semibold rounded-xl gap-2.5',
};

const Button = memo(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center border font-sans cursor-pointer transition-all duration-150 outline-none select-none disabled:opacity-50 disabled:pointer-events-none';
  const resolvedVariant = variants[variant] || variants.primary;
  const resolvedSize = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyle} ${resolvedVariant} ${resolvedSize} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
