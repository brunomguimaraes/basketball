'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DatePicker } from '@/components/date-picker';
import { GamesList } from '@/components/games-list';

// Lazy load React Query devtools only in development
const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((mod) => ({
    default: mod.ReactQueryDevtools,
  }))
);

// Create QueryClient with proper configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes default
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function ScoreboardPage() {
  // Track if component has mounted to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  
  // Initialize with a stable date for SSR
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    // Use a stable date during SSR to prevent hydration mismatch
    // Will be updated after mount to use localStorage or current date
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize to midnight for consistency
    return now;
  });

  // After mount, update with actual date from localStorage or today
  useEffect(() => {
    setIsMounted(true);
    
    try {
      const stored = window.localStorage.getItem('nba-scoreboard-selected-date');
      if (stored) {
        setSelectedDate(new Date(JSON.parse(stored)));
      } else {
        // Set to actual current date
        setSelectedDate(new Date());
      }
    } catch (error) {
      console.warn('Failed to restore date from localStorage:', error);
      setSelectedDate(new Date());
    }
  }, []);

  // Save to localStorage when date changes
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
            {/* Suppress hydration warning for date picker since we intentionally update after mount */}
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
