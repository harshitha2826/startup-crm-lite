/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ThemeContext = createContext(null);

/**
 * ThemeProvider Component
 * Context provider tracking application dark/light theme choices and applying root changes.
 * 
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child elements.
 * @returns {React.JSX.Element}
 */
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('startup-crm-theme', false);

  // Keep theme class synced
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  /**
   * Toggles dark mode state.
   */
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Provide "theme" string for backward compatibility with Layout
  const theme = isDarkMode ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme Custom Hook
 * Custom consumer hook fetching theme configuration and toggle commands.
 * 
 * @returns {Object} Theme context properties and toggle actions.
 * @throws {Error} If context is used outside a ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
