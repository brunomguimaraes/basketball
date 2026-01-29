import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlayerList } from './player-list';
import * as hooks from '@/services/nba/hooks';
import type { Player } from '@/services/nba/types';
import { createElement, type ReactNode } from 'react';

// Create a wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('PlayerList', () => {
  const mockPlayers: Player[] = [
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
    {
      id: 2,
      first_name: 'Anthony',
      last_name: 'Davis',
      position: 'F-C',
      height: '6-10',
      weight: '253',
      jersey_number: '3',
      college: 'Kentucky',
      country: 'USA',
      draft_year: 2012,
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render collapsed by default', () => {
    vi.spyOn(hooks, 'useTeamRoster').mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PlayerList teamId={1} teamName="Lakers" />
      </QueryClientProvider>
    );

    expect(screen.getByText('View Roster')).toBeInTheDocument();
    expect(screen.queryByText('LeBron James')).not.toBeInTheDocument();
  });

  it('should NOT fetch roster when collapsed (lazy loading)', () => {
    const useTeamRosterSpy = vi.spyOn(hooks, 'useTeamRoster').mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PlayerList teamId={1} teamName="Lakers" />
      </QueryClientProvider>
    );

    // Hook should be called with enabled=false initially
    expect(useTeamRosterSpy).toHaveBeenCalledWith(1, false);
  });

  it('should expand when trigger clicked', async () => {
    vi.spyOn(hooks, 'useTeamRoster').mockReturnValue({
      data: mockPlayers,
      isLoading: false,
      error: null,
    } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PlayerList teamId={1} teamName="Lakers" />
      </QueryClientProvider>
    );

    const button = screen.getByRole('button', { name: /View Lakers roster/i });
    fireEvent.click(button);

    // After expansion, should show players
    await waitFor(() => {
      expect(screen.getByText('LeBron James')).toBeInTheDocument();
      expect(screen.getByText('Anthony Davis')).toBeInTheDocument();
    });
  });

  it('should show loading skeleton while fetching', async () => {
    // First return: collapsed (no fetch)
    // Second return: loading state
    vi.spyOn(hooks, 'useTeamRoster')
      .mockReturnValueOnce({
        data: undefined,
        isLoading: false,
        error: null,
      } as any)
      .mockReturnValueOnce({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PlayerList teamId={1} teamName="Lakers" />
      </QueryClientProvider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByLabelText('Loading roster')).toBeInTheDocument();
    });
  });

  it('should show error message on fetch failure', async () => {
    vi.spyOn(hooks, 'useTeamRoster')
      .mockReturnValueOnce({
        data: undefined,
        isLoading: false,
        error: null,
      } as any)
      .mockReturnValueOnce({
        data: undefined,
        isLoading: false,
        error: new Error('API error'),
      } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PlayerList teamId={1} teamName="Lakers" />
      </QueryClientProvider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Unable to load roster')).toBeInTheDocument();
    });
  });

  it('should show empty state when no players', async () => {
    vi.spyOn(hooks, 'useTeamRoster')
      .mockReturnValueOnce({
        data: undefined,
        isLoading: false,
        error: null,
      } as any)
      .mockReturnValueOnce({
        data: [],
        isLoading: false,
        error: null,
      } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PlayerList teamId={1} teamName="Lakers" />
      </QueryClientProvider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('No roster information available')).toBeInTheDocument();
    });
  });

  it('should have proper ARIA attributes', () => {
    vi.spyOn(hooks, 'useTeamRoster').mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PlayerList teamId={1} teamName="Lakers" />
      </QueryClientProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'roster-1');
  });

  it('should update aria-expanded when opened', async () => {
    vi.spyOn(hooks, 'useTeamRoster').mockReturnValue({
      data: mockPlayers,
      isLoading: false,
      error: null,
    } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PlayerList teamId={1} teamName="Lakers" />
      </QueryClientProvider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  it('should be keyboard accessible (Enter key)', async () => {
    vi.spyOn(hooks, 'useTeamRoster').mockReturnValue({
      data: mockPlayers,
      isLoading: false,
      error: null,
    } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PlayerList teamId={1} teamName="Lakers" />
      </QueryClientProvider>
    );

    const button = screen.getByRole('button');
    button.focus();
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('LeBron James')).toBeInTheDocument();
    });
  });

  it('should be keyboard accessible (Space key)', async () => {
    vi.spyOn(hooks, 'useTeamRoster').mockReturnValue({
      data: mockPlayers,
      isLoading: false,
      error: null,
    } as any);

    render(
      <QueryClientProvider client={new QueryClient()}>
        <PlayerList teamId={1} teamName="Lakers" />
      </QueryClientProvider>
    );

    const button = screen.getByRole('button');
    button.focus();
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });

    await waitFor(() => {
      expect(screen.getByText('LeBron James')).toBeInTheDocument();
    });
  });

  it('should display chevron rotation when expanded', async () => {
    vi.spyOn(hooks, 'useTeamRoster').mockReturnValue({
      data: mockPlayers,
      isLoading: false,
      error: null,
    } as any);

    const { container } = render(
      <QueryClientProvider client={new QueryClient()}>
        <PlayerList teamId={1} teamName="Lakers" />
      </QueryClientProvider>
    );

    const button = screen.getByRole('button');
    const chevron = container.querySelector('svg[class*="rotate"]');

    expect(chevron).not.toHaveClass('rotate-180');

    fireEvent.click(button);

    await waitFor(() => {
      expect(chevron).toHaveClass('rotate-180');
    });
  });
});
