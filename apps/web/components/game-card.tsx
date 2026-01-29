'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
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

interface GameCardProps {
  game: Game;
}

function GameCardComponent({ game }: GameCardProps) {
  const statusConfig = {
    Final: 'bg-green-500/10 text-green-500 border-green-500/20',
    'In Progress': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    Scheduled: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  } as const;

  const statusColor =
    statusConfig[game.status] || 'bg-gray-500/10 text-gray-500';

  const visitorIsWinner =
    game.status === 'Final' && game.visitor_team_score > game.home_team_score;
  const homeIsWinner =
    game.status === 'Final' && game.home_team_score > game.visitor_team_score;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">
              {format(new Date(game.date), 'h:mm a')}
            </CardTitle>
            <Badge className={statusColor}>{game.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Visitor Team */}
          <TeamScore
            team={game.visitor_team}
            score={game.visitor_team_score}
            isWinner={visitorIsWinner}
          />

          {/* Home Team */}
          <TeamScore
            team={game.home_team}
            score={game.home_team_score}
            isWinner={homeIsWinner}
          />

          {/* Quarter Breakdown - Only show for Final games */}
          {game.status === 'Final' && game.period_scores && (
            <QuarterScores scores={game.period_scores} />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Memoize by game.id for performance
export const GameCard = memo(
  GameCardComponent,
  (prevProps, nextProps) => prevProps.game.id === nextProps.game.id
);

GameCard.displayName = 'GameCard';
