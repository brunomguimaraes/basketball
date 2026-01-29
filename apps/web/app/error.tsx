'use client';

import { useEffect } from 'react';
import { Button } from '@repo/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Something went wrong!
          </h2>
          <p className="text-white/70">
            An unexpected error occurred. Please try refreshing the page.
          </p>
        </div>
        <Button
          onClick={reset}
          className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
