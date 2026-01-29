'use client';

import { Card, CardHeader, CardContent } from '@repo/ui/card';

export function GameCardSkeleton() {
  return (
    <Card 
      className="bg-white/5 border-white/10 backdrop-blur-sm"
      role="status"
      aria-label="Loading game information"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          {/* Time skeleton */}
          <div className="h-7 w-24 bg-white/10 rounded animate-pulse-glow" />
          {/* Badge skeleton */}
          <div className="h-6 w-20 bg-white/10 rounded animate-pulse-glow" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visitor Team Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            {/* Team name */}
            <div className="h-6 w-40 bg-white/10 rounded animate-pulse-glow" />
            {/* Abbreviation */}
            <div className="h-4 w-12 bg-white/10 rounded animate-pulse-glow" />
          </div>
          {/* Score */}
          <div className="h-8 w-12 bg-white/10 rounded animate-pulse-glow" />
        </div>

        {/* Home Team Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            {/* Team name */}
            <div className="h-6 w-40 bg-white/10 rounded animate-pulse-glow" />
            {/* Abbreviation */}
            <div className="h-4 w-12 bg-white/10 rounded animate-pulse-glow" />
          </div>
          {/* Score */}
          <div className="h-8 w-12 bg-white/10 rounded animate-pulse-glow" />
        </div>
      </CardContent>
      <span className="sr-only">Loading game data...</span>
    </Card>
  );
}
