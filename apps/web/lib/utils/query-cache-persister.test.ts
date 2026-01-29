import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { persistCache, restoreCache, clearPersistedCache } from './query-cache-persister';

describe('query-cache-persister', () => {
  let queryClient: QueryClient;
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    // Create a new QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Mock localStorage
    localStorageMock = {};
    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
      key: vi.fn(),
      length: 0,
    };
  });

  it('should persist cache to localStorage', () => {
    // Set some data in the cache
    queryClient.setQueryData(['games', '2024-01-15'], [
      { id: 1, name: 'Game 1' },
      { id: 2, name: 'Game 2' },
    ]);

    // Persist the cache
    persistCache(queryClient);

    // Check that localStorage was called
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'nba-scoreboard-query-cache',
      expect.any(String)
    );

    // Verify the stored data
    const stored = localStorageMock['nba-scoreboard-query-cache'];
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored);
    expect(parsed.version).toBe(1);
    expect(parsed.queries).toBeDefined();
  });

  it('should restore cache from localStorage', () => {
    // Manually set cache data in localStorage
    const cacheData = {
      version: 1,
      timestamp: Date.now(),
      queries: {
        '["games","2024-01-15"]': {
          data: [
            { id: 1, name: 'Game 1' },
            { id: 2, name: 'Game 2' },
          ],
          dataUpdatedAt: Date.now(),
        },
      },
    };
    localStorageMock['nba-scoreboard-query-cache'] = JSON.stringify(cacheData);

    // Restore the cache
    restoreCache(queryClient);

    // Check that the data was restored
    const data = queryClient.getQueryData(['games', '2024-01-15']);
    expect(data).toEqual([
      { id: 1, name: 'Game 1' },
      { id: 2, name: 'Game 2' },
    ]);
  });

  it('should not restore old cache (> 1 hour)', () => {
    // Set cache data with old timestamp
    const cacheData = {
      version: 1,
      timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
      queries: {
        '["games","2024-01-15"]': {
          data: [{ id: 1, name: 'Game 1' }],
          dataUpdatedAt: Date.now(),
        },
      },
    };
    localStorageMock['nba-scoreboard-query-cache'] = JSON.stringify(cacheData);

    // Restore the cache
    restoreCache(queryClient);

    // Check that the data was NOT restored
    const data = queryClient.getQueryData(['games', '2024-01-15']);
    expect(data).toBeUndefined();

    // Check that localStorage was cleared
    expect(localStorage.removeItem).toHaveBeenCalledWith('nba-scoreboard-query-cache');
  });

  it('should not restore cache with wrong version', () => {
    // Set cache data with wrong version
    const cacheData = {
      version: 999,
      timestamp: Date.now(),
      queries: {
        '["games","2024-01-15"]': {
          data: [{ id: 1, name: 'Game 1' }],
          dataUpdatedAt: Date.now(),
        },
      },
    };
    localStorageMock['nba-scoreboard-query-cache'] = JSON.stringify(cacheData);

    // Restore the cache
    restoreCache(queryClient);

    // Check that the data was NOT restored
    const data = queryClient.getQueryData(['games', '2024-01-15']);
    expect(data).toBeUndefined();

    // Check that localStorage was cleared
    expect(localStorage.removeItem).toHaveBeenCalledWith('nba-scoreboard-query-cache');
  });

  it('should clear persisted cache', () => {
    localStorageMock['nba-scoreboard-query-cache'] = 'some-data';

    clearPersistedCache();

    expect(localStorage.removeItem).toHaveBeenCalledWith('nba-scoreboard-query-cache');
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage.setItem to throw an error
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    // Should not throw
    expect(() => {
      queryClient.setQueryData(['games', '2024-01-15'], [{ id: 1 }]);
      persistCache(queryClient);
    }).not.toThrow();
  });
});
