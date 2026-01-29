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
    
    // #region agent log
    // Debug: Check computed styles on html/body/main for background issues
    const html = document.documentElement;
    const body = document.body;
    const main = document.querySelector('main');
    const htmlStyles = window.getComputedStyle(html);
    const bodyStyles = window.getComputedStyle(body);
    const mainStyles = main ? window.getComputedStyle(main) : null;
    
    // H9: Check if our CSS fix was applied - background-color and overscroll-behavior
    fetch('http://127.0.0.1:7246/ingest/3a122c6d-4057-4c84-9cd0-36657cf4fcbc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:useEffect',message:'Post-fix CSS check',data:{htmlBgColor:htmlStyles.backgroundColor,htmlBgImage:htmlStyles.backgroundImage,htmlOverscroll:htmlStyles.overscrollBehavior,bodyBgColor:bodyStyles.backgroundColor,bodyOverscroll:bodyStyles.overscrollBehavior,htmlClasses:html.className,bodyClasses:body.className},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H9'})}).catch(()=>{});
    
    // H10: Check if Tailwind classes are overriding our CSS
    const htmlHasGradientClass = html.className.includes('bg-gradient');
    const bodyHasGradientClass = body.className.includes('bg-gradient');
    fetch('http://127.0.0.1:7246/ingest/3a122c6d-4057-4c84-9cd0-36657cf4fcbc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:useEffect',message:'Tailwind class check',data:{htmlHasGradientClass,bodyHasGradientClass,htmlFullClass:html.className,bodyFullClass:body.className},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H10'})}).catch(()=>{});
    // #endregion
    
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
