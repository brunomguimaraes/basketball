'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DatePicker } from '@/components/date-picker';
import { GamesList } from '@/components/games-list';

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((mod) => ({
    default: mod.ReactQueryDevtools,
  }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function ScoreboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  });

  useEffect(() => {
    setIsMounted(true);
    
    try {
      const stored = window.localStorage.getItem('nba-scoreboard-selected-date');
      if (stored) {
        setSelectedDate(new Date(JSON.parse(stored)));
      } else {
        setSelectedDate(new Date());
      }
    } catch (error) {
      console.warn('Failed to restore date from localStorage:', error);
      setSelectedDate(new Date());
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        window.localStorage.setItem(
          'nba-scoreboard-selected-date',
          JSON.stringify(selectedDate.toISOString())
        );
      } catch (error) {
        console.warn('Failed to save date to localStorage:', error);
      }
    }
  }, [selectedDate, isMounted]);

  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <h1 
              className="font-heading text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight"
              id="page-title"
            >
              NBA Scoreboard
            </h1>
            <div suppressHydrationWarning>
              <DatePicker
                selected={selectedDate}
                onSelect={setSelectedDate}
              />
            </div>
          </header>
          <GamesList selectedDate={selectedDate} />
        </div>
      </main>
      {process.env.NODE_ENV === 'development' && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
