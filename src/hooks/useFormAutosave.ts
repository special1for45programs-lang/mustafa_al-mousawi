import { useEffect, useRef } from 'react';

/**
 * Custom hook for automatically saving form data to localStorage
 * @param key - localStorage key
 * @param data - data to save
 * @param delay - debounce delay in milliseconds (default: 1000)
 */
export const useFormAutosave = <T,>(key: string, data: T, delay: number = 1000) => {
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for debounced save
        timeoutRef.current = setTimeout(() => {
            try {
                localStorage.setItem(key, JSON.stringify(data));
                console.log(`✅ Form autosaved to ${key}`);
            } catch (error) {
                console.error('Failed to autosave form data:', error);
            }
        }, delay);

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [key, data, delay]);
};

/**
 * Load saved form data from localStorage
 * @param key - localStorage key
 * @returns saved data or null
 */
export const loadSavedFormData = <T,>(key: string): T | null => {
    try {
        const saved = localStorage.getItem(key);
        if (saved) {
            return JSON.parse(saved) as T;
        }
    } catch (error) {
        console.error('Failed to load saved form data:', error);
    }
    return null;
};

/**
 * Clear saved form data from localStorage
 * @param key - localStorage key
 */
export const clearSavedFormData = (key: string) => {
    try {
        localStorage.removeItem(key);
        console.log(`🗑️ Cleared saved form data from ${key}`);
    } catch (error) {
        console.error('Failed to clear saved form data:', error);
    }
};
