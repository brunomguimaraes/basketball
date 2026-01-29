'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing state synchronized with localStorage
 * Handles SSR edge cases and provides type-safe storage
 * 
 * @param key - localStorage key
 * @param initialValue - Default value if no stored value exists (can be a function for lazy initialization)
 * @returns Tuple of [storedValue, setValue] similar to useState
 * 
 * @example
 * ```typescript
 * const [selectedDate, setSelectedDate] = useLocalStorage(
 *   'nba-scoreboard-selected-date',
 *   () => new Date()
 * );
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: T | ((prevValue: T) => T)) => void] {
  // Initialize state with SSR safety
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Return initial value during SSR (avoid calling function to prevent hydration mismatch)
    if (typeof window === 'undefined') {
      return initialValue instanceof Function ? initialValue() : initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        // Parse stored value
        return JSON.parse(item);
      }
      // No stored value, use initial value
      return initialValue instanceof Function ? initialValue() : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  });

  // Hydration fix: sync state with localStorage after mount
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Memoized setter function
  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      try {
        // Allow value to be a function (similar to useState)
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Update state
        setStoredValue(valueToStore);
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
