'use client';

import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useGames } from '@/services/nba/hooks';
import { GameCard } from './game-card';
import { GameCardSkeleton } from './game-card-skeleton';
import { EmptyState } from './empty-state';
import { ErrorAlert } from './error-alert';

interface GamesListProps {
  selectedDate: Date;
}

export function GamesList({ selectedDate }: GamesListProps) {
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const { data, isLoading, error, refetch } = useGames(dateString);

  // Error state
  if (error) {
    return <ErrorAlert error={error as any} onRetry={() => refetch()} />;
  }

  // Loading state - show 6 skeleton cards
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return <EmptyState date={selectedDate} />;
  }

  // Games display with stagger animation
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {data.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: [0.22, 1, 0.36, 1], // Energetic easing
            }}
          >
            <GameCard game={game} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
