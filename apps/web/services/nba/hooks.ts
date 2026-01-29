'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchGames } from './api';
import type { Game, GamesQueryKey } from './types';
import { ErrorCategory } from './types';

/**
 * React Query hook for fetching NBA games by date
 * Implements intelligent caching strategy based on game status:
 * - Final games: 24 hours (immutable data)
 * - In Progress: 1 minute (live updates)
 * - Scheduled: 5 minutes (stable data)
 * - Empty results: 5 minutes (default)
 * 
 * @param dateString - Date in YYYY-MM-DD format
 * @returns UseQueryResult with games array and query state
 * 
 * @example
 * ```typescript
 * const { data, isLoading, error, refetch } = useGames('2024-01-15');
 * if (isLoading) return <Skeleton />;
 * if (error) return <ErrorAlert error={error} onRetry={refetch} />;
 * return data.map(game => <GameCard key={game.id} game={game} />);
 * ```
 */
export function useGames(
  dateString: string
): UseQueryResult<Game[], Error> {
  return useQuery<Game[], Error, Game[], GamesQueryKey>({
    queryKey: ['games', dateString],
    queryFn: async () => {
      const response = await fetchGames({ dates: [dateString] });
      return response.data;
    },
    staleTime: (query) => {
      const games = query.state.data;
      if (!games || games.length === 0) {
        return 5 * 60 * 1000; // 5 minutes for empty results
      }

      // Check game statuses to determine cache duration
      const hasInProgress = games.some((g) => g.status === 'In Progress');
      const hasScheduled = games.some((g) => g.status === 'Scheduled');
      const allFinal = games.every((g) => g.status === 'Final');

      if (allFinal) {
        return 24 * 60 * 60 * 1000; // 24 hours for completed games
      }
      if (hasInProgress) {
        return 1 * 60 * 1000; // 1 minute for live games
      }
      if (hasScheduled) {
        return 5 * 60 * 1000; // 5 minutes for scheduled games
      }

      return 5 * 60 * 1000; // Default 5 minutes
    },
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes after stale
    retry: (failureCount, error) => {
      // Don't retry on rate limit or auth errors
      if ((error as any).category === ErrorCategory.RATE_LIMIT) return false;
      if ((error as any).category === ErrorCategory.AUTHENTICATION) return false;
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
