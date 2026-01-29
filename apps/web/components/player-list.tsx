'use client';

import { useState, memo } from 'react';
import { ChevronDown, Users } from 'lucide-react';
import { Button } from '@repo/ui/button';
import { useTeamRoster } from '@/services/nba/hooks';
import { PlayerListItem } from './player-list-item';
import { PlayerListSkeleton } from './player-list-skeleton';

interface PlayerListProps {
  teamId: number;
  teamName: string;
}

function PlayerListComponent({ teamId, teamName }: PlayerListProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: players, isLoading, error } = useTeamRoster(teamId, isOpen);

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between text-white/80 hover:text-white hover:bg-white/5 px-3 py-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`roster-${teamId}`}
        aria-label={`${isOpen ? 'Hide' : 'View'} ${teamName} roster`}
      >
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4" aria-hidden="true" />
          <span className="text-sm font-medium">View Roster</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </Button>

      {isOpen && (
        <div
          id={`roster-${teamId}`}
          className="mt-2 overflow-hidden"
          role="region"
          aria-label={`${teamName} roster`}
        >
          {isLoading && <PlayerListSkeleton />}

          {error && (
            <p
              className="text-sm text-red-400 text-center py-2"
              role="alert"
            >
              Unable to load roster
            </p>
          )}

          {players && players.length > 0 && (
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {players.map((player) => (
                <PlayerListItem key={player.id} player={player} />
              ))}
            </div>
          )}

          {players && players.length === 0 && (
            <p className="text-sm text-white/60 text-center py-2">
              No roster information available
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export const PlayerList = memo(
  PlayerListComponent,
  (prevProps, nextProps) => prevProps.teamId === nextProps.teamId
);

PlayerList.displayName = 'PlayerList';
