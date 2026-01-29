'use client';

import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

interface EmptyStateProps {
  date: Date;
}

export function EmptyState({ date }: EmptyStateProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[400px] text-center px-4"
      role="status"
      aria-live="polite"
    >
      <div className="bg-white/5 rounded-full p-6 mb-6">
        <Calendar className="w-16 h-16 text-white/50" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">
        No games scheduled
      </h3>
      <p className="text-white/70 text-lg mb-1">
        No games found for {format(date, 'PPP')}
      </p>
      <p className="text-white/50 text-sm">
        Try selecting a different date to see NBA games
      </p>
    </div>
  );
}
