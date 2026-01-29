import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlayerListItem } from './player-list-item';
import type { Player } from '@/services/nba/types';

describe('PlayerListItem', () => {
  const mockPlayer: Player = {
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
  };

  it('should render player name', () => {
    render(<PlayerListItem player={mockPlayer} />);

    expect(screen.getByText('LeBron James')).toBeInTheDocument();
  });

  it('should render jersey number', () => {
    render(<PlayerListItem player={mockPlayer} />);

    expect(screen.getByText('23')).toBeInTheDocument();
  });

  it('should render position, height, and weight', () => {
    render(<PlayerListItem player={mockPlayer} />);

    expect(screen.getByText(/F • 6-9 • 250 lbs/)).toBeInTheDocument();
  });

  it('should handle missing jersey number with dash', () => {
    const playerWithoutNumber = { ...mockPlayer, jersey_number: '' };
    render(<PlayerListItem player={playerWithoutNumber} />);

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('should handle missing position', () => {
    const playerWithoutPosition = { ...mockPlayer, position: '' };
    render(<PlayerListItem player={playerWithoutPosition} />);

    expect(screen.getByText(/N\/A/)).toBeInTheDocument();
  });

  it('should have proper aria-label for jersey number', () => {
    render(<PlayerListItem player={mockPlayer} />);

    const jerseyElement = screen.getByLabelText('Jersey number 23');
    expect(jerseyElement).toBeInTheDocument();
  });

  it('should truncate long names with ellipsis', () => {
    const longNamePlayer = {
      ...mockPlayer,
      first_name: 'VeryLongFirstName',
      last_name: 'VeryLongLastNameThatShouldBeTruncated',
    };
    render(<PlayerListItem player={longNamePlayer} />);

    const nameElement = screen.getByText(/VeryLongFirstName VeryLongLastNameThatShouldBeTruncated/);
    expect(nameElement).toHaveClass('truncate');
  });
});
