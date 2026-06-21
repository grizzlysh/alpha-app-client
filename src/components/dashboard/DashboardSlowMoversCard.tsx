import type { JSX } from "react";
import { Snail } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Translations } from "@/configs/i18n";
import type { SlowMoverItem } from "@/types/dashboard";
import { formatCompactCurrency } from "./dashboardUtils";

export interface DashboardSlowMoversCardProps {
  t: Translations;
  items: SlowMoverItem[];
  isLoading: boolean;
}

export function DashboardSlowMoversCard({
  t,
  items,
  isLoading,
}: DashboardSlowMoversCardProps): JSX.Element {
  const sorted = [...items].sort((a, b) => {
    if (a.daysSinceLastMovement === null && b.daysSinceLastMovement !== null) return -1;
    if (a.daysSinceLastMovement !== null && b.daysSinceLastMovement === null) return 1;
    return (b.daysSinceLastMovement ?? 0) - (a.daysSinceLastMovement ?? 0);
  });

  const totalIdleValue = items.reduce((sum, i) => sum + i.estimatedValue, 0);

  return (
    <Card className="flex flex-col p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Snail className="h-4 w-4 text-muted-foreground" />
          {t.dashboardSlowMoversTitle}
          {items.length > 0 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {items.length}
            </span>
          )}
        </div>
        {totalIdleValue > 0 && (
          <span className="text-xs text-muted-foreground">
            {t.dashboardSlowMoversTotalIdleValue}:{" "}
            <span className="font-semibold text-foreground">{formatCompactCurrency(totalIdleValue)}</span>
          </span>
        )}
      </div>

      <div className="mt-3 flex-1">
        {isLoading ? (
          <div className="space-y-1.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 animate-pulse rounded-md bg-muted/50" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-xs text-muted-foreground">
            {t.dashboardSlowMoversEmpty}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-1.5 text-left font-medium">Medicine</th>
                  <th className="pb-1.5 text-right font-medium">Qty</th>
                  <th className="pb-1.5 text-right font-medium">Idle</th>
                  <th className="pb-1.5 text-right font-medium">{t.dashboardSlowMoversEstValue}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sorted.map((item) => (
                  <tr key={item.medicineUuid} className="group">
                    <td className="py-2 pr-3 font-medium text-foreground">
                      <p className="max-w-[160px] truncate uppercase">{item.medicineName}</p>
                    </td>
                    <td className="py-2 text-right text-muted-foreground">{item.totalPieces}</td>
                    <td className="py-2 text-right">
                      {item.daysSinceLastMovement === null ? (
                        <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive">
                          {t.dashboardSlowMoversNeverSold}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          {item.daysSinceLastMovement}d
                        </span>
                      )}
                    </td>
                    <td className="py-2 text-right font-medium text-foreground">
                      {formatCompactCurrency(item.estimatedValue)}
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
