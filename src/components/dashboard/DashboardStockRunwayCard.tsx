import type { JSX } from "react";
import { Gauge } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import type { RunwayStatus, StockRunwayItem } from "@/types/dashboard";

export interface DashboardStockRunwayCardProps {
  t: Translations;
  items: StockRunwayItem[];
  isLoading: boolean;
}

function statusStyle(status: RunwayStatus): string {
  switch (status) {
    case "critical": return "bg-destructive/15 text-destructive dark:bg-destructive/20";
    case "low":      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    case "adequate": return "bg-success/10 text-success dark:bg-success/20";
    case "overstocked": return "bg-muted text-muted-foreground";
  }
}

function statusLabel(status: RunwayStatus, t: Translations): string {
  switch (status) {
    case "critical":    return t.dashboardRunwayCritical;
    case "low":         return t.dashboardRunwayLow;
    case "adequate":    return t.dashboardRunwayAdequate;
    case "overstocked": return t.dashboardRunwayOverstocked;
  }
}

export function DashboardStockRunwayCard({
  t,
  items,
  isLoading,
}: DashboardStockRunwayCardProps): JSX.Element {
  const counts: Record<RunwayStatus, number> = {
    critical: 0, low: 0, adequate: 0, overstocked: 0,
  };
  for (const item of items) counts[item.status]++;

  const chips: Array<{ status: RunwayStatus; count: number }> = (
    ["critical", "low", "adequate", "overstocked"] as RunwayStatus[]
  )
    .filter((s) => counts[s] > 0)
    .map((s) => ({ status: s, count: counts[s] }));

  const STATUS_ORDER: Record<RunwayStatus, number> = { critical: 0, low: 1, adequate: 2, overstocked: 3 };
  const display = [...items].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  return (
    <Card className="flex flex-col p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Gauge className="h-4 w-4 text-muted-foreground" />
        {t.dashboardStockRunwayTitle}
      </div>

      {!isLoading && chips.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {chips.map(({ status, count }) => (
            <span
              key={status}
              className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusStyle(status))}
            >
              {count} {statusLabel(status, t)}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex-1">
        {isLoading ? (
          <div className="space-y-1.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 animate-pulse rounded-md bg-muted/50" />
            ))}
          </div>
        ) : display.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-xs text-muted-foreground">
            {t.dashboardStockRunwayEmpty}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-1.5 text-left font-medium">Medicine</th>
                  <th className="pb-1.5 text-right font-medium">Qty</th>
                  <th className="pb-1.5 text-right font-medium">{t.dashboardAvgDailySalesLabel}</th>
                  <th className="pb-1.5 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {display.map((item) => (
                  <tr key={item.medicineUuid}>
                    <td className="py-2 pr-3 font-medium text-foreground">
                      <p className="max-w-[140px] truncate uppercase">{item.medicineName}</p>
                    </td>
                    <td className="py-2 text-right text-muted-foreground">{item.currentPieces}</td>
                    <td className="py-2 text-right text-muted-foreground">
                      {item.avgDailySales.toFixed(1)}
                    </td>
                    <td className="py-2 text-right">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusStyle(item.status))}>
                          {statusLabel(item.status, t)}
                        </span>
                        <span className="text-muted-foreground">
                          {item.daysRemaining !== null
                            ? `${item.daysRemaining} ${t.dashboardRunwayDaysLeft}`
                            : t.dashboardRunwayNoSales}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}
