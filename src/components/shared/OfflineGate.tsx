import type { JSX, ReactNode } from "react";
import { WifiOff } from "lucide-react";

import { useNetworkStatus } from "@/hooks/useNetworkStatus";

interface OfflineGateProps {
  children: ReactNode;
  message?: string;
}

export function OfflineGate({
  children,
  message = "This page requires an internet connection.",
}: OfflineGateProps): JSX.Element {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return <>{children}</>;

  return (
    <div className="relative min-h-[400px]">
      {/* Blurred background — decorative only, not interactive */}
      <div aria-hidden="true" className="pointer-events-none select-none opacity-20">
        {children}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <WifiOff className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">No internet connection</p>
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
