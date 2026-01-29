'use client';

import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useGames } from '@/services/nba/hooks';
import { GameCard } from './game-card';
import { BouncingBasketball } from './bouncing-basketball';
import { EmptyState } from './empty-state';
import { ErrorAlert } from './error-alert';

interface GamesListProps {
  selectedDate: Date;
}

export function GamesList({ selectedDate }: GamesListProps) {
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const { data, isFetching, error, refetch } = useGames(dateString);

  if (error) {
    return <ErrorAlert error={error as any} onRetry={() => refetch()} />;
  }

  // Only show loading when fetching AND no cached data exists
  if (isFetching && !data) {
    return (
      <div 
        className="flex items-center justify-center min-h-[400px]"
        role="status"
        aria-live="polite"
        aria-label="Loading games"
      >
        <BouncingBasketball size={80} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState date={selectedDate} />;
  }

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
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <GameCard game={game} priority={index < 3} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
