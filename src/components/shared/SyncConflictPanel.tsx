import type { JSX } from "react";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PendingMutation } from "@/utils/db";

interface SyncConflictPanelProps {
  failedMutations: PendingMutation[];
  onRetry: (id: string) => Promise<void>;
  onRetryAll: () => Promise<void>;
  onDiscard: (id: string) => Promise<void>;
}

function formatLabel(method: string, endpoint: string): string {
  const resource = endpoint.split("/").filter(Boolean)[0] ?? endpoint;
  return `${method} ${resource.replace(/-/g, " ")}`;
}

function formatTime(ts: number): string {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

export function SyncConflictPanel({
  failedMutations,
  onRetry,
  onRetryAll,
  onDiscard,
}: SyncConflictPanelProps): JSX.Element | null {
  if (failedMutations.length === 0) return null;

  const label =
    failedMutations.length === 1 ? "1 sync failure" : `${failedMutations.length} sync failures`;

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80 overflow-hidden rounded-lg border border-destructive/40 bg-card shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-destructive/20 bg-destructive/5 px-3 py-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
          <span className="text-sm font-semibold text-destructive">{label}</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => void onRetryAll()}
        >
          Retry all
        </Button>
      </div>

      {/* Failed mutation list */}
      <ul className="max-h-56 divide-y divide-border overflow-y-auto">
        {failedMutations.map((m) => (
          <li key={m.id} className="flex items-center justify-between gap-2 px-3 py-2">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium capitalize">
                {formatLabel(m.method, m.endpoint)}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Failed after 3 attempts · {formatTime(m.createdAt)}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                title="Retry"
                onClick={() => void onRetry(m.id)}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                title="Discard"
                onClick={() => void onDiscard(m.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="border-t border-border px-3 py-2">
        <p className="text-[11px] text-muted-foreground">
          These changes could not be synced. Retry when online, or discard to remove them.
        </p>
      </div>
    </div>
  );
}
