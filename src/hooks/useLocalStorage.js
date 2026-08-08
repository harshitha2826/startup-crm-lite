import { useState, useCallback } from 'react';

// Single check conducted on module initialization to verify localStorage access
const isStorageAvailable = typeof window !== 'undefined' && (() => {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
})();

/**
 * Custom Hook: useLocalStorage
 * Manages reactive state synced with the window's Local Storage API.
 * Safely handles parse errors and fallback configurations when storage is unavailable.
 * Supports standard values and functional state updater callbacks.
 * 
 * @param {string} key - Storage key name.
 * @param {any} initialValue - Default fallback value if no storage entry is matched.
 * @returns {[any, Function]} Standard React [state, setState] tuple.
 */
const useLocalStorage = (key, initialValue) => {
  // 1. Initial State Load (Lazy Initialization)
  const [storedValue, setStoredValue] = useState(() => {
    const initial = typeof initialValue === 'function' ? initialValue() : initialValue;
    
    if (!isStorageAvailable) {
      return initial;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
      return initial;
    } catch (error) {
      console.warn(`Error parsing localStorage key "${key}":`, error);
      return initial;
    }
  });

  // 2. State Mutation Setter Wrapper
  const setValue = useCallback((value) => {
    try {
      setStoredValue((prevValue) => {
        // Resolve value if passed as a function updater callback
        const valueToStore = typeof value === 'function' ? value(prevValue) : value;
        
        if (isStorageAvailable) {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error writing localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage;
