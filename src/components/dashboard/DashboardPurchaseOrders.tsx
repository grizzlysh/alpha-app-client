import type { JSX } from "react";
import { Truck } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Translations } from "@/configs/i18n";
import type { OpenPurchaseOrderItem } from "@/types/dashboard";
import { formatDate } from "@/utils/dateHelpers";

export interface DashboardPurchaseOrdersProps {
  t: Translations;
  orders: OpenPurchaseOrderItem[];
  isLoading: boolean;
}

export function DashboardPurchaseOrders({
  t,
  orders,
  isLoading,
}: DashboardPurchaseOrdersProps): JSX.Element {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Truck className="h-4 w-4 text-muted-foreground" />
        {t.dashboardOpenPOsTitle}
        {orders.length > 0 && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {orders.length}
          </span>
        )}
      </div>

      <div className="mt-3 space-y-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-muted/50" />
          ))
        ) : orders.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{t.dashboardOpenPOsEmpty}</p>
        ) : (
          orders.map((po) => (
            <div
              key={po.uuid}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{po.orderNumber}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="uppercase">{po.distributorName}</span> · {formatDate(po.orderedAt)}
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                {po.itemCount} item{po.itemCount !== 1 ? "s" : ""}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
