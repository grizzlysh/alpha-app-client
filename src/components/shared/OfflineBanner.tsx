import type { JSX } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export function OfflineBanner(): JSX.Element | null {
  const { isOnline, wasOffline } = useNetworkStatus();

  if (isOnline && !wasOffline) return null;

  if (wasOffline) {
    return (
      <div className="flex items-center justify-center gap-2 bg-emerald-500 px-4 py-2 text-sm font-medium text-white dark:bg-emerald-600">
        <Wifi className="h-4 w-4 shrink-0" />
        <span>You&apos;re back online.</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-sm font-medium text-white dark:bg-amber-600">
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>You are offline — showing cached data. Changes will sync when connection returns.</span>
    </div>
  );
}
