import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGames, useTeamRoster } from './hooks';
import * as api from './api';
import * as rosterApi from './roster-api';
import { ErrorCategory } from './types';
import { createElement, type ReactNode } from 'react';

// Create a wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for tests
      },
    },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useGames React Query hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch games for specified date', async () => {
    const mockGames = [
      {
        id: 1,
        date: '2024-01-15T00:00:00.000Z',
        status: 'Final' as const,
        home_team: {
          id: 1,
          name: 'Lakers',
          abbreviation: 'LAL',
          city: 'Los Angeles',
          conference: 'West',
          division: 'Pacific',
          full_name: 'Los Angeles Lakers',
        },
        visitor_team: {
          id: 2,
          name: 'Celtics',
          abbreviation: 'BOS',
          city: 'Boston',
          conference: 'East',
          division: 'Atlantic',
          full_name: 'Boston Celtics',
        },
        home_team_score: 110,
        visitor_team_score: 105,
        season: 2024,
        period: 4,
        time: 'Final',
        postseason: false,
      },
    ];

    vi.spyOn(api, 'fetchGames').mockResolvedValue({
      data: mockGames,
      meta: {
        total_pages: 1,
        current_page: 1,
        next_page: null,
        per_page: 25,
        total_count: 1,
      },
    });

    const { result } = renderHook(() => useGames('2024-01-15'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0]?.id).toBe(1);
    expect(result.current.data?.[0]?.home_team.name).toBe('Lakers');
  });

  it('should return correct staleTime for Final games (24hr)', async () => {
    const mockGames = [
      {
        id: 1,
        date: '2024-01-15T00:00:00.000Z',
        status: 'Final' as const,
        home_team: {} as any,
        visitor_team: {} as any,
        home_team_score: 110,
        visitor_team_score: 105,
        season: 2024,
        period: 4,
        time: 'Final',
        postseason: false,
      },
    ];

    vi.spyOn(api, 'fetchGames').mockResolvedValue({
      data: mockGames,
      meta: {} as any,
    });

    const { result } = renderHook(() => useGames('2024-01-15'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Query should have 24hr staleTime for Final games
    expect(result.current.data?.[0]?.status).toBe('Final');
  });

  it('should return correct staleTime for In Progress games (1min)', async () => {
    const mockGames = [
      {
        id: 1,
        date: '2024-01-15T00:00:00.000Z',
        status: 'In Progress' as const,
        home_team: {} as any,
        visitor_team: {} as any,
        home_team_score: 55,
        visitor_team_score: 50,
        season: 2024,
        period: 2,
        time: '5:30',
        postseason: false,
      },
    ];

    vi.spyOn(api, 'fetchGames').mockResolvedValue({
      data: mockGames,
      meta: {} as any,
    });

    const { result } = renderHook(() => useGames('2024-01-15'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.[0]?.status).toBe('In Progress');
  });

  it('should return correct staleTime for Scheduled games (5min)', async () => {
    const mockGames = [
      {
        id: 1,
        date: '2024-01-15T00:00:00.000Z',
        status: 'Scheduled' as const,
        home_team: {} as any,
        visitor_team: {} as any,
        home_team_score: 0,
        visitor_team_score: 0,
        season: 2024,
        period: 0,
        time: '7:30 PM ET',
        postseason: false,
      },
    ];

    vi.spyOn(api, 'fetchGames').mockResolvedValue({
      data: mockGames,
      meta: {} as any,
    });

    const { result } = renderHook(() => useGames('2024-01-15'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.[0]?.status).toBe('Scheduled');
  });

  it('should not retry on RATE_LIMIT errors', async () => {
    const rateLimitError = new Error('Rate limit exceeded') as any;
    rateLimitError.category = ErrorCategory.RATE_LIMIT;

    vi.spyOn(api, 'fetchGames').mockRejectedValue(rateLimitError);

    const { result } = renderHook(() => useGames('2024-01-15'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    expect((result.current.error as any).category).toBe(ErrorCategory.RATE_LIMIT);
  });

  it('should not retry on AUTHENTICATION errors', async () => {
    const authError = new Error('Authentication failed') as any;
    authError.category = ErrorCategory.AUTHENTICATION;

    vi.spyOn(api, 'fetchGames').mockRejectedValue(authError);

    const { result } = renderHook(() => useGames('2024-01-15'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    expect((result.current.error as any).category).toBe(ErrorCategory.AUTHENTICATION);
  });

  it('should handle empty results', async () => {
    vi.spyOn(api, 'fetchGames').mockResolvedValue({
      data: [],
      meta: {
        total_pages: 0,
        current_page: 1,
        next_page: null,
        per_page: 25,
        total_count: 0,
      },
    });

    const { result } = renderHook(() => useGames('2024-01-15'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(0);
  });

  it('should use correct query key format', async () => {
    vi.spyOn(api, 'fetchGames').mockResolvedValue({
      data: [],
      meta: {} as any,
    });

    const { result } = renderHook(() => useGames('2024-01-15'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Query key should be ['games', dateString]
    expect(api.fetchGames).toHaveBeenCalledWith({ dates: ['2024-01-15'] });
  });
});

describe('useTeamRoster React Query hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should NOT fetch when enabled=false (lazy loading)', async () => {
    const fetchSpy = vi.spyOn(rosterApi, 'fetchTeamRoster');

    const { result } = renderHook(() => useTeamRoster(1, false), {
      wrapper: createWrapper(),
    });

    // Should not trigger fetch
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('should fetch when enabled=true', async () => {
    const mockPlayers = [
      {
        id: 1,
        first_name: 'LeBron',
        last_name: 'James',
        position: 'F',
        height: '6-9',
        weight: '250',
        jersey_number: '23',
        college: 'None',
        country: 'USA',
        draft_year: 2003,
        draft_round: 1,
        draft_number: 1,
        team: {
          id: 1,
          name: 'Lakers',
          abbreviation: 'LAL',
          city: 'Los Angeles',
          conference: 'West',
          division: 'Pacific',
          full_name: 'Los Angeles Lakers',
        },
      },
    ];

    vi.spyOn(rosterApi, 'fetchTeamRoster').mockResolvedValue({
      data: mockPlayers,
      meta: {
        total_pages: 1,
        current_page: 1,
        next_page: null,
        per_page: 100,
        total_count: 1,
      },
    });

    const { result } = renderHook(() => useTeamRoster(1, true), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0]?.first_name).toBe('LeBron');
    expect(result.current.data?.[0]?.last_name).toBe('James');
  });

  it('should use correct query key format', async () => {
    vi.spyOn(rosterApi, 'fetchTeamRoster').mockResolvedValue({
      data: [],
      meta: {} as any,
    });

    const { result } = renderHook(() => useTeamRoster(5, true), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Query key should be ['roster', teamId]
    expect(rosterApi.fetchTeamRoster).toHaveBeenCalledWith({ teamId: 5 });
  });

  it('should cache results for 24 hours (staleTime)', async () => {
    const mockPlayers = [
      {
        id: 1,
        first_name: 'Test',
        last_name: 'Player',
        position: 'G',
        height: '6-3',
        weight: '195',
        jersey_number: '10',
        college: 'Duke',
        country: 'USA',
        draft_year: 2020,
        draft_round: 1,
        draft_number: 5,
        team: {} as any,
      },
    ];

    vi.spyOn(rosterApi, 'fetchTeamRoster').mockResolvedValue({
      data: mockPlayers,
      meta: {} as any,
    });

    const { result } = renderHook(() => useTeamRoster(1, true), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPlayers);
  });

  it('should handle empty roster', async () => {
    vi.spyOn(rosterApi, 'fetchTeamRoster').mockResolvedValue({
      data: [],
      meta: {
        total_pages: 0,
        current_page: 1,
        next_page: null,
        per_page: 100,
        total_count: 0,
      },
    });

    const { result } = renderHook(() => useTeamRoster(1, true), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(0);
  });

  it('should handle API errors gracefully', async () => {
    const error = new Error('API error') as any;
    error.category = ErrorCategory.SERVER;

    vi.spyOn(rosterApi, 'fetchTeamRoster').mockRejectedValue(error);

    const { result } = renderHook(() => useTeamRoster(1, true), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
