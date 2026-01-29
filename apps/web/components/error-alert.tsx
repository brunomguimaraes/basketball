'use client';

import { useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@repo/ui/button';
import type { AppError } from '@/services/nba/types';
import { cn } from '@repo/ui/utils';

interface ErrorAlertProps {
  error: AppError;
  onRetry?: () => void;
}

export function ErrorAlert({ error, onRetry }: ErrorAlertProps) {
  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    }
  }, [onRetry]);

  const categoryColors = {
    NETWORK: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500',
    RATE_LIMIT: 'bg-orange-500/10 border-orange-500/20 text-orange-500',
    SERVER: 'bg-red-500/10 border-red-500/20 text-red-500',
    AUTHENTICATION: 'bg-red-500/10 border-red-500/20 text-red-500',
    VALIDATION: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500',
    UNKNOWN: 'bg-gray-500/10 border-gray-500/20 text-gray-500',
  } as const;

  const alertColor =
    categoryColors[error.category] ||
    'bg-gray-500/10 border-gray-500/20 text-gray-500';

  return (
    <div
      className={cn(
        'rounded-lg border-2 p-6 backdrop-blur-sm',
        alertColor
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-4">
        <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            Error Loading Games
          </h3>
          <p className="text-white/90 mb-4">{error.userMessage}</p>
          {error.retryable && onRetry && (
            <Button
              onClick={handleRetry}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
