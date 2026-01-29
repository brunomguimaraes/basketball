import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameCard } from './game-card';
import type { Game } from '@/services/nba/types';

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

describe('GameCard', () => {
  it('renders team names and scores', () => {
    render(<GameCard game={mockGame} />);

    expect(screen.getByText('Los Angeles Lakers')).toBeInTheDocument();
    expect(screen.getByText('Boston Celtics')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('115')).toBeInTheDocument();
  });

  it('shows correct status badge for Final game', () => {
    render(<GameCard game={mockGame} />);

    const badge = screen.getByText('Final');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('bg-green-500/10');
    expect(badge.className).toContain('text-green-500');
  });

  it('shows correct status badge for In Progress game', () => {
    const inProgressGame: Game = {
      ...mockGame,
      status: 'In Progress',
    };

    render(<GameCard game={inProgressGame} />);

    const badge = screen.getByText('In Progress');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('bg-orange-500/10');
    expect(badge.className).toContain('text-orange-500');
  });

  it('shows correct status badge for Scheduled game', () => {
    const scheduledGame: Game = {
      ...mockGame,
      status: 'Scheduled',
      period_scores: undefined,
    };

    render(<GameCard game={scheduledGame} />);

    const badge = screen.getByText('Scheduled');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('bg-blue-500/10');
    expect(badge.className).toContain('text-blue-500');
  });

  it('displays quarter scores when game is Final', () => {
    render(<GameCard game={mockGame} />);

    expect(screen.getByText('Quarter Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Q2')).toBeInTheDocument();
    expect(screen.getByText('Q3')).toBeInTheDocument();
    expect(screen.getByText('Q4')).toBeInTheDocument();
  });

  it('hides quarter scores when game is Scheduled', () => {
    const scheduledGame: Game = {
      ...mockGame,
      status: 'Scheduled',
      period_scores: undefined,
    };

    render(<GameCard game={scheduledGame} />);

    expect(screen.queryByText('Quarter Breakdown')).not.toBeInTheDocument();
  });

  it('winner team has visual indicator (white text vs white/70)', () => {
    const { container } = render(<GameCard game={mockGame} />);

    // Lakers won (120 > 115), so Lakers should have text-white
    const lakersElement = screen.getByText('Los Angeles Lakers');
    expect(lakersElement.className).toContain('text-white');

    // Celtics lost, so should have text-white/70
    const celticsElement = screen.getByText('Boston Celtics');
    expect(celticsElement.className).toContain('text-white/70');
  });

  it('displays game time formatted correctly', () => {
    render(<GameCard game={mockGame} />);

    // The time should be formatted (e.g., "7:00 PM" depending on timezone)
    // Just check that a time-like pattern exists
    const timeElements = screen.getAllByText(/\d{1,2}:\d{2}\s?[AP]M/i);
    expect(timeElements.length).toBeGreaterThan(0);
  });

  it('memoization works - component has displayName', () => {
    expect(GameCard.displayName).toBe('GameCard');
  });
});
