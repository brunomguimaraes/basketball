import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScoreboardPage from './page';
import * as api from '@/services/nba/api';
import type { GamesResponse, Game } from '@/services/nba/types';

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

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

describe('ScoreboardPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it('renders with title and date picker', async () => {
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

    render(<ScoreboardPage />);

    expect(screen.getByText('NBA Scoreboard')).toBeInTheDocument();
    
    await waitFor(() => {
      const datePattern = /\w+ \d{1,2}(st|nd|rd|th)?, \d{4}/;
      expect(screen.getByText(datePattern)).toBeInTheDocument();
    });
  });

  it('renders correctly', () => {
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

    render(<ScoreboardPage />);

    expect(screen.getByText('NBA Scoreboard')).toBeInTheDocument();
  });

  it('displays games after loading', async () => {
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

    render(<ScoreboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Los Angeles Lakers')).toBeInTheDocument();
      expect(screen.getByText('Boston Celtics')).toBeInTheDocument();
    });
  });

  it('has NBA theme gradient background', () => {
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

    const { container } = render(<ScoreboardPage />);

    const mainElement = container.querySelector('main');
    expect(mainElement?.className).toContain('bg-gradient-to-br');
    expect(mainElement?.className).toContain('from-slate-950');
    expect(mainElement?.className).toContain('via-blue-950');
    expect(mainElement?.className).toContain('to-slate-900');
  });

  it('has proper container max-width and padding', () => {
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

    const { container } = render(<ScoreboardPage />);

    const containerDiv = container.querySelector('.container');
    expect(containerDiv?.className).toContain('max-w-7xl');
    expect(containerDiv?.className).toContain('mx-auto');
    expect(containerDiv?.className).toContain('px-4');
    expect(containerDiv?.className).toContain('py-8');
  });
});
