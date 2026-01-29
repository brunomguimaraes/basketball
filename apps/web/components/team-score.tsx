'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Team } from '@/services/nba/types';
import { cn } from '@repo/ui/utils';
import { getTeamBranding } from '@/lib/constants/team-branding';
import { TeamLogoFallback } from './team-logo-fallback';

interface TeamScoreProps {
  team: Team;
  score: number;
  isWinner: boolean;
  priority?: boolean;
}

export function TeamScore({ team, score, isWinner, priority = false }: TeamScoreProps) {
  const branding = getTeamBranding(team.abbreviation);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {branding && !imageError ? (
          <Image
            src={branding.logoUrl}
            alt={`${team.full_name} logo`}
            width={48}
            height={48}
            className="object-contain w-12 h-12 flex-shrink-0"
            onError={() => setImageError(true)}
            loading={priority ? 'eager' : 'lazy'}
            priority={priority}
          />
        ) : (
          <TeamLogoFallback abbreviation={team.abbreviation} />
        )}
        
        <div className="flex flex-col">
          <span
            className="font-team-name text-xl"
            style={branding ? { 
              color: branding.primaryColor,
              WebkitTextStroke: '1px white',
              paintOrder: 'stroke fill'
            } : {}}
          >
            {team.full_name}
          </span>
          <span 
            className="text-sm font-medium tracking-wide"
            style={branding ? { 
              color: branding.secondaryColor,
              WebkitTextStroke: '0.8px white',
              paintOrder: 'stroke fill'
            } : {}}
          >
            {team.abbreviation}
          </span>
        </div>
      </div>
      
      <div
        className={cn(
          'font-score text-3xl',
          isWinner ? 'text-white' : 'text-white/70'
        )}
      >
        {score}
      </div>
    </div>
  );
}
