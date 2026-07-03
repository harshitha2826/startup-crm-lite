import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

/**
 * DarkModeToggle Component
 * Renders an animated pill-shaped switch to control light and dark modes,
 * displaying icons and the text representation of the active mode.
 * 
 * @returns {React.JSX.Element}
 */
const DarkModeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 select-none">
      <button
        onClick={toggleTheme}
        className="relative flex items-center justify-between w-12 h-6 p-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Toggle Dark Mode"
        title="Toggle dark mode preference"
      >
        {/* Sliding toggle knob */}
        <div
          className={`absolute w-4 h-4 bg-white dark:bg-gray-900 rounded-full shadow-md flex items-center justify-center transition-transform duration-200 ${
            isDarkMode ? 'translate-x-6' : 'translate-x-0'
          }`}
        >
          {isDarkMode ? (
            <Moon className="w-2.5 h-2.5 text-blue-400" />
          ) : (
            <Sun className="w-2.5 h-2.5 text-amber-500" />
          )}
        </div>
        
        {/* Static icons inside the pill track */}
        <Sun className="w-3.5 h-3.5 text-amber-500/70" />
        <Moon className="w-3.5 h-3.5 text-blue-400/70" />
      </button>
      
      {/* Current mode descriptor */}
      <span className="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider min-w-[32px]">
        {isDarkMode ? 'Dark' : 'Light'}
      </span>
    </div>
  );
};

export default DarkModeToggle;
