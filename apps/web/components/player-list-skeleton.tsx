export function PlayerListSkeleton() {
  return (
    <div className="space-y-1 animate-pulse" aria-label="Loading roster">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-2 rounded-md bg-white/5"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />

          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/10 rounded w-3/4" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
