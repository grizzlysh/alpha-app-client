import type { JSX } from "react";

interface TableLoadingSkeletonProps {
  rows?: number;
}

export function TableLoadingSkeleton({ rows = 6 }: TableLoadingSkeletonProps): JSX.Element {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded-xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="ml-auto h-7 w-7 flex-shrink-0 animate-pulse rounded-lg bg-muted" />
        </div>
      ))}
    </div>
  );
}
