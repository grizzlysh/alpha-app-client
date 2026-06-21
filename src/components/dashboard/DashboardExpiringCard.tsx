import type { JSX } from "react";
import { CalendarX2 } from "lucide-react";

import { cn } from "@/utils/cn";
import { Card } from "@/components/ui/card";
import type { Translations } from "@/configs/i18n";
import type { ExpiringBatch } from "@/types/dashboard";

export interface DashboardExpiringCardProps {
  t: Translations;
  items: ExpiringBatch[];
  isLoading: boolean;
}

const TIER_CLASSES: Record<string, string> = {
  red: "bg-destructive/10 text-destructive",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
};

const MAX_ROWS = 6;

export function DashboardExpiringCard({
  t,
  items,
  isLoading,
}: DashboardExpiringCardProps): JSX.Element {
  const rows = items.slice(0, MAX_ROWS);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <CalendarX2 className="h-4 w-4 text-muted-foreground" />
        {t.dashboardExpiringSoonTitle}
        {items.length > 0 && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
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
          <p className="py-6 text-center text-sm text-muted-foreground">{t.dashboardExpiringSoonEmpty}</p>
        ) : (
          rows.map((item) => (
            <div
              key={item.uuid}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium uppercase text-foreground">{item.medicineName}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="uppercase">{item.batchNumber}</span> · {item.daysUntilExpiry} {t.dashboardDaysSuffix}
                </p>
              </div>
              <span className={cn("shrink-0 rounded-md px-2 py-1 text-xs font-medium", TIER_CLASSES[item.tier])}>
                {item.daysUntilExpiry} {t.dashboardDaysSuffix}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
