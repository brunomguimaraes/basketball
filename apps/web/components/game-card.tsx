'use client';

import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@repo/ui/card';
import { Badge } from '@repo/ui/badge';
import type { Game } from '@/services/nba/types';
import { TeamScore } from './team-score';
import { QuarterScores } from './quarter-scores';
import { PlayerList } from './player-list';
import { formatGameTime } from '@/lib/utils/date-formatters';
import { getTeamBranding } from '@/lib/constants/team-branding';

interface GameCardProps {
  game: Game;
  priority?: boolean;
}

function GameCardComponent({ game, priority = false }: GameCardProps) {
  const statusConfig = {
    Final: 'bg-green-500/10 text-green-500 border-green-500/20',
    'In Progress': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    Scheduled: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  } as const;

  const getStatusColor = () => {
    if (typeof game.status === 'string' && (
      game.status.includes('Qtr') || 
      game.status.toLowerCase().includes('halftime') || 
      game.status.toLowerCase().includes('ot')
    )) {
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    }
    
    if (typeof game.status === 'string' && game.status.match(/^\d{4}-\d{2}-\d{2}T/)) {
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
    
    return statusConfig[game.status as keyof typeof statusConfig] || 'bg-gray-500/10 text-gray-500';
  };

  const statusColor = getStatusColor();

  const isScheduledGame = typeof game.status === 'string' && 
    (game.status === 'Scheduled' || game.status.match(/^\d{4}-\d{2}-\d{2}T/));

  const getBadgeContent = () => {
    if (typeof game.status === 'string' && game.status.includes('Qtr')) {
      const quarterMatch = game.status.match(/(\d+)(st|nd|rd|th)\s+Qtr/);
      if (quarterMatch) {
        return `Q${quarterMatch[1]}`;
      }
    }
    
    if (typeof game.status === 'string' && game.status.toLowerCase().includes('halftime')) {
      return 'HALF';
    }
    
    if (typeof game.status === 'string' && game.status.toLowerCase().includes('ot')) {
      return game.status.toUpperCase();
    }
    
    if (typeof game.status === 'string' && game.status.match(/^\d{4}-\d{2}-\d{2}T/)) {
      return formatGameTime(game.status);
    }
    
    if (game.status === 'In Progress') {
      return `Q${game.period}`;
    } else if (game.status === 'Scheduled') {
      return formatGameTime(game.date);
    } else if (game.status === 'Final') {
      return 'Final';
    }
    
    return game.status;
  };

  const visitorIsWinner =
    game.status === 'Final' && game.visitor_team_score > game.home_team_score;
  const homeIsWinner =
    game.status === 'Final' && game.home_team_score > game.visitor_team_score;

  const homeBranding = getTeamBranding(game.home_team.abbreviation);
  const visitorBranding = getTeamBranding(game.visitor_team.abbreviation);

  const cardStyle = homeBranding && visitorBranding ? {
    background: `linear-gradient(135deg, 
      ${homeBranding.primaryColor}15 0%, 
      ${visitorBranding.primaryColor}15 100%)`,
    borderColor: `${homeBranding.primaryColor}30`,
  } : {};

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card 
        style={cardStyle}
        className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
        role="article"
        aria-label={`Game: ${game.visitor_team.full_name} at ${game.home_team.full_name}`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            {!isScheduledGame ? (
              <CardTitle className="text-white text-base font-normal">
                {format(parseISO(game.date), 'EEE, MMM d')}
              </CardTitle>
            ) : (
              <CardTitle className="text-white/60 text-base font-normal">
                Upcoming Game
              </CardTitle>
            )}
            <Badge 
              className={`${statusColor} ${
                (typeof game.status === 'string' && game.status.includes('Qtr')) || 
                game.status === 'In Progress' 
                  ? 'font-mono font-bold tracking-wider' 
                  : ''
              }`}
            >
              {getBadgeContent()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <TeamScore
            team={game.visitor_team}
            score={game.visitor_team_score}
            isWinner={visitorIsWinner}
            priority={priority}
          />

          <TeamScore
            team={game.home_team}
            score={game.home_team_score}
            isWinner={homeIsWinner}
            priority={priority}
          />

          {game.status === 'Final' && game.period_scores && (
            <QuarterScores scores={game.period_scores} />
          )}

          {game.status === 'Final' && (
            <div className="pt-4 border-t border-white/10 space-y-2">
              <PlayerList
                teamId={game.home_team.id}
                teamName={game.home_team.name}
              />
              <PlayerList
                teamId={game.visitor_team.id}
                teamName={game.visitor_team.name}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export const GameCard = GameCardComponent;
