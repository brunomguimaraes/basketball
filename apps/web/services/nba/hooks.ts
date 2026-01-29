'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchGames } from './api';
import { fetchTeamRoster } from './roster-api';
import type { Game, GamesQueryKey, Player } from './types';
import { ErrorCategory } from './types';

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
        return 5 * 60 * 1000;
      }

      const isInProgress = (status: string) => {
        return status === 'In Progress' || 
               status.includes('Qtr') || 
               status.toLowerCase().includes('halftime') ||
               status.toLowerCase().includes('ot');
      };

      const isScheduled = (status: string) => {
        return status === 'Scheduled' || status.match(/^\d{4}-\d{2}-\d{2}T/);
      };

      const hasInProgress = games.some((g) => isInProgress(g.status));
      const hasScheduled = games.some((g) => isScheduled(g.status));
      const allFinal = games.every((g) => g.status === 'Final');

      if (allFinal) {
        return 24 * 60 * 60 * 1000;
      }
      if (hasInProgress) {
        return 1 * 60 * 1000;
      }
      if (hasScheduled) {
        return 5 * 60 * 1000;
      }

      return 5 * 60 * 1000;
    },
    gcTime: 30 * 60 * 1000,
    retry: (failureCount, error) => {
      if ((error as any).category === ErrorCategory.RATE_LIMIT) return false;
      if ((error as any).category === ErrorCategory.AUTHENTICATION) return false;
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useTeamRoster(
  teamId: number,
  enabled: boolean = false
): UseQueryResult<Player[], Error> {
  return useQuery<Player[], Error>({
    queryKey: ['roster', teamId],
    queryFn: async () => {
      const response = await fetchTeamRoster({ teamId });
      return response.data;
    },
    enabled,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    retry: 1,
  });
}
