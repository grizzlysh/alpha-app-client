import type { JSX } from "react";
import { ClipboardList } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Translations } from "@/configs/i18n";
import type { RecentTransaction } from "@/types/dashboard";
import { formatCompactCurrency } from "./dashboardUtils";

export interface DashboardRecentTransactionsProps {
  t: Translations;
  transactions: RecentTransaction[];
  isLoading: boolean;
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function DashboardRecentTransactions({
  t,
  transactions,
  isLoading,
}: DashboardRecentTransactionsProps): JSX.Element {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <ClipboardList className="h-4 w-4 text-muted-foreground" />
        {t.dashboardRecentTransactionsTitle}
      </div>

      <div className="mt-3 space-y-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-muted/50" />
          ))
        ) : transactions.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t.dashboardRecentTransactionsEmpty}
          </p>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.uuid}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium uppercase text-foreground">{tx.customerName}</p>
                <p className="text-xs text-muted-foreground">
                  {tx.saleNumber} · {formatTime(tx.soldAt)}
                  {tx.isRx && (
                    <span className="ml-1.5 rounded bg-primary/10 px-1 py-0.5 text-[10px] font-medium text-primary">
                      Rx
                    </span>
                  )}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-foreground">
                {formatCompactCurrency(tx.totalAmount)}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
