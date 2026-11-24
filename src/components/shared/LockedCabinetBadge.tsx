import type { JSX } from "react";
import { Lock } from "lucide-react";

import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/utils/cn";

export interface LockedCabinetBadgeProps {
  className?: string;
}

/** Marks a narcotic or psychotropic: it is stored in the locked cabinet. */
export function LockedCabinetBadge({ className }: LockedCabinetBadgeProps): JSX.Element {
  const { t } = useLanguage();
  return (
    <span
      title={t.lockedCabinetHint}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive",
        className
      )}
    >
      <Lock className="h-3 w-3" aria-hidden />
      {t.lockedCabinet}
    </span>
  );
}
