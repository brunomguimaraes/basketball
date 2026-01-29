import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GamesList } from './games-list';
import * as api from '@/services/nba/api';
import { ErrorCategory } from '@/services/nba/types';
import type { Game, GamesResponse } from '@/services/nba/types';

// Helper to create a fresh QueryClient for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retry for tests
        gcTime: 0, // Disable cache
      },
    },
  });

// Wrapper component with QueryClientProvider
const createWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Mock game data
const mockGame: Game = {
  id: 1,
  date: '2024-01-15T19:00:00.000Z',
  season: 2023,
  status: 'Final',
  period: 4,
  time: 'Final',
  postseason: false,
  home_team: {
    id: 1,
    abbreviation: 'LAL',
    city: 'Los Angeles',
    conference: 'West',
    division: 'Pacific',
    full_name: 'Los Angeles Lakers',
    name: 'Lakers',
  },
  home_team_score: 120,
  visitor_team: {
    id: 2,
    abbreviation: 'BOS',
    city: 'Boston',
    conference: 'East',
    division: 'Atlantic',
    full_name: 'Boston Celtics',
    name: 'Celtics',
  },
  visitor_team_score: 115,
  period_scores: [
    { period: 1, home_score: 30, visitor_score: 28 },
    { period: 2, home_score: 28, visitor_score: 30 },
    { period: 3, home_score: 32, visitor_score: 29 },
    { period: 4, home_score: 30, visitor_score: 28 },
  ],
};

const mockGame2: Game = {
  ...mockGame,
  id: 2,
  home_team: {
    ...mockGame.home_team,
    id: 3,
    full_name: 'Golden State Warriors',
    name: 'Warriors',
    abbreviation: 'GSW',
  },
  visitor_team: {
    ...mockGame.visitor_team,
    id: 4,
    full_name: 'Miami Heat',
    name: 'Heat',
    abbreviation: 'MIA',
  },
};

describe('GamesList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays games after loading', async () => {
    const mockResponse: GamesResponse = {
      data: [mockGame, mockGame2],
      meta: {
        total_pages: 1,
        current_page: 1,
        next_page: null,
        per_page: 25,
        total_count: 2,
      },
    };

    vi.spyOn(api, 'fetchGames').mockResolvedValue(mockResponse);

    render(<GamesList selectedDate={new Date('2024-01-15')} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText('Los Angeles Lakers')).toBeInTheDocument();
      expect(screen.getByText('Boston Celtics')).toBeInTheDocument();
      expect(screen.getByText('Golden State Warriors')).toBeInTheDocument();
      expect(screen.getByText('Miami Heat')).toBeInTheDocument();
    });
  });

  it('shows empty state when API returns empty array', async () => {
    const mockResponse: GamesResponse = {
      data: [],
      meta: {
        total_pages: 0,
        current_page: 1,
        next_page: null,
        per_page: 25,
        total_count: 0,
      },
    };

    vi.spyOn(api, 'fetchGames').mockResolvedValue(mockResponse);

    render(<GamesList selectedDate={new Date('2024-06-15')} />, {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => {
        expect(screen.getByText('No games scheduled')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('displays correct number of game cards', async () => {
    const mockResponse: GamesResponse = {
      data: [mockGame, mockGame2],
      meta: {
        total_pages: 1,
        current_page: 1,
        next_page: null,
        per_page: 25,
        total_count: 2,
      },
    };

    vi.spyOn(api, 'fetchGames').mockResolvedValue(mockResponse);

    render(<GamesList selectedDate={new Date('2024-01-15')} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      // Each game should have team names
      expect(screen.getByText('Los Angeles Lakers')).toBeInTheDocument();
      expect(screen.getByText('Golden State Warriors')).toBeInTheDocument();
    });

    // Verify we have 2 game cards (each should have a status badge)
    const finalBadges = screen.getAllByText('Final');
    expect(finalBadges).toHaveLength(2);
  });

  it('applies responsive grid classes', async () => {
    const mockResponse: GamesResponse = {
      data: [mockGame],
      meta: {
        total_pages: 1,
        current_page: 1,
        next_page: null,
        per_page: 25,
        total_count: 1,
      },
    };

    vi.spyOn(api, 'fetchGames').mockResolvedValue(mockResponse);

    const { container } = render(
      <GamesList selectedDate={new Date('2024-01-15')} />,
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      const gridElement = container.querySelector('.grid');
      expect(gridElement).toBeInTheDocument();
      expect(gridElement?.className).toContain('gap-4');
      expect(gridElement?.className).toContain('md:grid-cols-2');
      expect(gridElement?.className).toContain('lg:grid-cols-3');
    });
  });
});
