'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DatePicker } from '@/components/date-picker';
import { restoreCache, persistCache } from '@/lib/utils/query-cache-persister';

// Dynamically import GamesList with no SSR - this ensures:
// 1. No server-side render (avoids hydration mismatch)
// 2. Client renders with localStorage access from the start
const GamesList = dynamic(() => import('@/components/games-list').then(mod => ({ default: mod.GamesList })), {
  ssr: false,
  loading: () => null, // Show nothing while loading the component itself
});

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((mod) => ({
    default: mod.ReactQueryDevtools,
  }))
);

// Create QueryClient singleton outside component to prevent recreation
let queryClientInstance: QueryClient | null = null;
let cacheRestored = false;

function getQueryClient() {
  if (!queryClientInstance) {
    queryClientInstance = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          gcTime: 10 * 60 * 1000,
          retry: 1,
          refetchOnWindowFocus: false,
          refetchOnMount: false,
        },
      },
    });
  }
  
  // Restore cache only once on client-side
  if (typeof window !== 'undefined' && !cacheRestored) {
    restoreCache(queryClientInstance);
    cacheRestored = true;
  }
  
  return queryClientInstance;
}

// Get initial date synchronously from localStorage
function getInitialDate(): Date {
  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem('nba-scoreboard-selected-date');
      if (stored) {
        return new Date(JSON.parse(stored));
      }
    } catch {
      // Ignore errors, fall through to default
    }
  }
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

export default function ScoreboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate);
  const queryClient = getQueryClient();

  useEffect(() => {
    const persistInterval = setInterval(() => {
      persistCache(queryClient);
    }, 10000);

    return () => {
      clearInterval(persistInterval);
      persistCache(queryClient);
    };
  }, [queryClient]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'nba-scoreboard-selected-date',
        JSON.stringify(selectedDate.toISOString())
      );
    } catch (error) {
      console.warn('Failed to save date to localStorage:', error);
    }
  }, [selectedDate]);

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
