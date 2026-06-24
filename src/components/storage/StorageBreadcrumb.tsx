import type { JSX } from "react";
import { ChevronRight, Warehouse } from "lucide-react";

import { cn } from "@/utils/cn";
import type { StorageCrumb } from "@/types/storage";

export interface StorageBreadcrumbProps {
  cabinet: StorageCrumb | null;
  shelf: StorageCrumb | null;
  onGoToCabinets: () => void;
  onGoToShelves: () => void;
}

export function StorageBreadcrumb({
  cabinet,
  shelf,
  onGoToCabinets,
  onGoToShelves,
}: StorageBreadcrumbProps): JSX.Element {
  return (
    <nav className="flex items-center gap-1 text-sm">
      <button
        type="button"
        onClick={onGoToCabinets}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-2 py-1 font-medium transition-colors",
          cabinet === null
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Warehouse className="h-3.5 w-3.5 shrink-0" />
        <span>Storage</span>
      </button>

      {cabinet && (
        <>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
          <button
            type="button"
            onClick={onGoToShelves}
            className={cn(
              "rounded-lg px-2 py-1 font-medium transition-colors",
              shelf === null
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="uppercase">{cabinet.name}</span>
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              {cabinet.code}
            </span>
          </button>
        </>
      )}

      {shelf && (
        <>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
          <span className="rounded-lg px-2 py-1 font-medium text-foreground">
            <span className="uppercase">{shelf.name}</span>
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              {shelf.code}
            </span>
          </span>
        </>
      )}
    </nav>
  );
}
