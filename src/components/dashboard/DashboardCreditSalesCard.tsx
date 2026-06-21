import type { JSX } from "react";
import { CreditCard } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import type { CreditSaleItem, CreditSalesOutstandingResponse } from "@/types/dashboard";
import { formatCompactCurrency } from "./dashboardUtils";

export interface DashboardCreditSalesCardProps {
  t: Translations;
  data: CreditSalesOutstandingResponse | null;
  isLoading: boolean;
}

function ageBadgeClass(days: number): string {
  if (days > 60) return "bg-destructive/10 text-destructive";
  if (days > 30) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  return "bg-muted text-muted-foreground";
}

function formatDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString([], { day: "numeric", month: "short" });
}

export function DashboardCreditSalesCard({
  t,
  data,
  isLoading,
}: DashboardCreditSalesCardProps): JSX.Element {
  const sorted = [...(data?.items ?? [])].sort(
    (a: CreditSaleItem, b: CreditSaleItem) =>
      b.daysSinceSale - a.daysSinceSale
  );

  const hasOld60 = sorted.some((i) => i.daysSinceSale > 60);
  const hasOld30 = sorted.some((i) => i.daysSinceSale > 30);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          {t.dashboardCreditSalesTitle}
          {data && data.totalCount > 0 && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                hasOld60
                  ? "bg-destructive/10 text-destructive"
                  : hasOld30
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {data.totalCount}
            </span>
          )}
        </div>
        {data && data.totalOutstanding > 0 && (
          <span className="text-xs font-medium text-destructive">
            {t.dashboardCreditSalesTotalLabel}: {formatCompactCurrency(data.totalOutstanding)}
          </span>
        )}
      </div>

      <div className="mt-3">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-md bg-muted/50" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-xs text-muted-foreground">
            {t.dashboardCreditSalesEmpty}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-1.5 text-left font-medium">Sale #</th>
                  <th className="pb-1.5 text-left font-medium">Customer</th>
                  <th className="pb-1.5 text-right font-medium">Date</th>
                  <th className="pb-1.5 text-right font-medium">Total</th>
                  <th className="pb-1.5 text-right font-medium">Paid</th>
                  <th className="pb-1.5 text-right font-medium">Outstanding</th>
                  <th className="pb-1.5 text-right font-medium">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sorted.map((item) => (
                  <tr key={item.saleUuid}>
                    <td className="py-2 pr-2 font-mono text-muted-foreground">{item.saleNumber}</td>
                    <td className="py-2 pr-2 font-medium text-foreground">
                      <p className="max-w-[100px] truncate uppercase">{item.customerName}</p>
                    </td>
                    <td className="py-2 text-right text-muted-foreground">{formatDate(item.soldAt)}</td>
                    <td className="py-2 text-right text-muted-foreground">{formatCompactCurrency(item.grandTotal)}</td>
                    <td className="py-2 text-right text-muted-foreground">{formatCompactCurrency(item.paidAmount)}</td>
                    <td className="py-2 text-right font-semibold text-destructive">
                      {formatCompactCurrency(item.outstanding)}
                    </td>
                    <td className="py-2 text-right">
                      <span className={cn("rounded-full px-1.5 py-0.5 font-medium", ageBadgeClass(item.daysSinceSale))}>
                        {item.daysSinceSale}d
                      </span>
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
