'use client';

import type { PeriodScore } from '@/services/nba/types';

interface QuarterScoresProps {
  scores: PeriodScore[];
}

export function QuarterScores({ scores }: QuarterScoresProps) {
  const quarters = scores.filter((s) => s.period <= 4);
  const overtimes = scores.filter((s) => s.period > 4);

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <div className="text-xs text-white/50 mb-2">Quarter Breakdown</div>
      <div className="grid grid-cols-4 gap-2 text-xs">
        {quarters.map((score) => (
          <div
            key={score.period}
            className="bg-white/5 rounded p-2 text-center"
          >
            <div className="text-white/50 mb-1">Q{score.period}</div>
            <div className="text-white font-semibold">
              {score.visitor_score}
            </div>
            <div className="text-white/70">-</div>
            <div className="text-white font-semibold">
              {score.home_score}
            </div>
          </div>
        ))}
      </div>
      {overtimes.length > 0 && (
        <div className="grid grid-cols-4 gap-2 text-xs mt-2">
          {overtimes.map((score) => (
            <div
              key={score.period}
              className="bg-orange-500/10 rounded p-2 text-center"
            >
              <div className="text-orange-500 mb-1">OT{score.period - 4}</div>
              <div className="text-white font-semibold">
                {score.visitor_score}
              </div>
              <div className="text-white/70">-</div>
              <div className="text-white font-semibold">
                {score.home_score}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
