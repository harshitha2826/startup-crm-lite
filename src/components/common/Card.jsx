import { memo } from 'react';

const Card = memo(({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm transition-all duration-200 
        ${hoverable ? 'hover:shadow-md dark:hover:shadow-gray-900/30 hover:border-gray-300 dark:hover:border-gray-600 hover:translate-y-[-2px]' : ''} 
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
