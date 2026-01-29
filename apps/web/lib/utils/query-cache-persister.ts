import { QueryClient } from '@tanstack/react-query';

const CACHE_KEY = 'nba-scoreboard-query-cache';
const CACHE_VERSION = 1;

interface CacheData {
  version: number;
  timestamp: number;
  queries: Record<string, {
    data: any;
    dataUpdatedAt: number;
  }>;
}

/**
 * Persist React Query cache to localStorage
 */
export function persistCache(queryClient: QueryClient): void {
  try {
    const cache = queryClient.getQueryCache();
    const queries: CacheData['queries'] = {};
    
    cache.getAll().forEach((query) => {
      const { queryKey, state } = query;
      if (state.data && state.status === 'success') {
        const key = JSON.stringify(queryKey);
        queries[key] = {
          data: state.data,
          dataUpdatedAt: state.dataUpdatedAt,
        };
      }
    });

    const cacheData: CacheData = {
      version: CACHE_VERSION,
      timestamp: Date.now(),
      queries,
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to persist query cache:', error);
  }
}

/**
 * Restore React Query cache from localStorage
 */
export function restoreCache(queryClient: QueryClient): void {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (!stored) return;

    const cacheData: CacheData = JSON.parse(stored);
    
    if (cacheData.version !== CACHE_VERSION) {
      localStorage.removeItem(CACHE_KEY);
      return;
    }

    const cacheAge = Date.now() - cacheData.timestamp;
    if (cacheAge > 60 * 60 * 1000) {
      localStorage.removeItem(CACHE_KEY);
      return;
    }

    Object.entries(cacheData.queries).forEach(([key, value]) => {
      try {
        const queryKey = JSON.parse(key);
        queryClient.setQueryData(queryKey, value.data);
      } catch (error) {
        console.warn('Failed to restore query:', key, error);
      }
    });
  } catch (error) {
    console.warn('Failed to restore query cache:', error);
    localStorage.removeItem(CACHE_KEY);
  }
}

/**
 * Clear persisted cache
 */
export function clearPersistedCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn('Failed to clear persisted cache:', error);
  }
}
