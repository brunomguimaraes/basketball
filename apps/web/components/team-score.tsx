'use client';

import type { Team } from '@/services/nba/types';
import { cn } from '@repo/ui/utils';

interface TeamScoreProps {
  team: Team;
  score: number;
  isWinner: boolean;
}

export function TeamScore({ team, score, isWinner }: TeamScoreProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span
            className={cn(
              'text-base font-semibold',
              isWinner ? 'text-white' : 'text-white/70'
            )}
          >
            {team.full_name}
          </span>
          <span className="text-xs text-white/50">
            {team.abbreviation}
          </span>
        </div>
      </div>
      <div
        className={cn(
          'text-2xl font-bold',
          isWinner ? 'text-white' : 'text-white/70'
        )}
      >
        {score}
      </div>
    </div>
  );
}
