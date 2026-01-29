'use client';

interface TeamLogoFallbackProps {
  abbreviation: string;
}

export function TeamLogoFallback({ abbreviation }: TeamLogoFallbackProps) {
  return (
    <div
      className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"
      role="img"
      aria-label={`${abbreviation} logo placeholder`}
    >
      <span className="font-team-name text-white text-sm font-bold">
        {abbreviation}
      </span>
    </div>
  );
}
