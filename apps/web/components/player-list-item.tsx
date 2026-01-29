import type { Player } from '@/services/nba/types';

interface PlayerListItemProps {
  player: Player;
}

export function PlayerListItem({ player }: PlayerListItemProps) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
      <div
        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"
        aria-label={`Jersey number ${player.jersey_number || 'unknown'}`}
      >
        <span className="text-xs font-bold text-white">
          {player.jersey_number || '—'}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {player.first_name} {player.last_name}
        </p>
        <p className="text-xs text-white/60">
          {player.position || 'N/A'}
          {player.height && ` • ${player.height}`}
          {player.weight && ` • ${player.weight} lbs`}
        </p>
      </div>
    </div>
  );
}
