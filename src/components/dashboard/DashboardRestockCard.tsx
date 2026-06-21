import type { JSX } from "react";
import { PackageX } from "lucide-react";

import { cn } from "@/utils/cn";
import { Card } from "@/components/ui/card";
import type { Translations } from "@/configs/i18n";
import type { RestockItem } from "@/types/dashboard";

export interface DashboardRestockCardProps {
  t: Translations;
  items: RestockItem[];
  isLoading: boolean;
}

const MAX_ROWS = 6;

export function DashboardRestockCard({
  t,
  items,
  isLoading,
}: DashboardRestockCardProps): JSX.Element {
  const rows = items.slice(0, MAX_ROWS);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <PackageX className="h-4 w-4 text-muted-foreground" />
        {t.dashboardNeedRestockTitle}
        {items.length > 0 && (
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
            {items.length}
          </span>
        )}
      </div>

      <div className="mt-3 space-y-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-muted/50" />
          ))
        ) : rows.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{t.dashboardNeedRestockEmpty}</p>
        ) : (
          rows.map((item) => (
            <div
              key={item.uuid}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium uppercase text-foreground">{item.medicineName}</p>
                <p className="text-xs text-muted-foreground">
                  {t.dashboardStockLabel}: {item.totalPieces} · {t.dashboardReorderLabel}: {item.reorderLevel}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-md px-2 py-1 text-xs font-medium",
                  item.isOutOfStock
                    ? "bg-destructive/10 text-destructive"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                )}
              >
                {item.isOutOfStock ? t.dashboardStockCritical : t.dashboardStockLow}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
