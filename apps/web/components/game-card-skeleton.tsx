'use client';

import { Card, CardHeader, CardContent } from '@repo/ui/card';
import { BouncingBasketball } from './bouncing-basketball';

export function GameCardSkeleton() {
  return (
    <Card 
      className="bg-white/5 border-white/10 backdrop-blur-sm relative overflow-hidden"
      role="status"
      aria-label="Loading game information"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="h-7 w-24 bg-white/10 rounded animate-pulse-glow" />
          <div className="h-6 w-20 bg-white/10 rounded animate-pulse-glow" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        {/* Shimmer elements with reduced opacity */}
        <div className="flex items-center justify-between opacity-40">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-40 bg-white/10 rounded animate-pulse-glow" />
            <div className="h-4 w-12 bg-white/10 rounded animate-pulse-glow" />
          </div>
          <div className="h-8 w-12 bg-white/10 rounded animate-pulse-glow" />
        </div>

        <div className="flex items-center justify-between opacity-40">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-40 bg-white/10 rounded animate-pulse-glow" />
            <div className="h-4 w-12 bg-white/10 rounded animate-pulse-glow" />
          </div>
          <div className="h-8 w-12 bg-white/10 rounded animate-pulse-glow" />
        </div>

        {/* Centered bouncing basketball */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <BouncingBasketball size={56} />
        </div>
      </CardContent>
      <span className="sr-only">Loading game data...</span>
    </Card>
  );
}
