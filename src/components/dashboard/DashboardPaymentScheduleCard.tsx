import type { JSX } from "react";
import { CalendarClock } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Translations } from "@/configs/i18n";
import type { PaymentScheduleItem, PaymentScheduleResponse } from "@/types/dashboard";
import { formatCompactCurrency } from "./dashboardUtils";

export interface DashboardPaymentScheduleCardProps {
  t: Translations;
  data: PaymentScheduleResponse | null;
  isLoading: boolean;
}

interface ScheduleRowProps {
  item: PaymentScheduleItem;
  isOverdue: boolean;
  daysSuffix: string;
}

function ScheduleRow({ item, isOverdue, daysSuffix }: ScheduleRowProps): JSX.Element {
  return (
    <li className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 ${isOverdue ? "bg-destructive/5" : "bg-muted/30"}`}>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase text-foreground">{item.distributorName}</p>
        <p className="text-xs text-muted-foreground">
          <span className="uppercase">{item.invoiceNumber}</span>
          {item.daysUntilDue !== null && (
            <span className={isOverdue ? " text-destructive" : ""}>
              {" "}· {Math.abs(item.daysUntilDue)} {daysSuffix} {isOverdue ? "overdue" : ""}
            </span>
          )}
        </p>
      </div>
      <span className={`shrink-0 text-xs font-semibold ${isOverdue ? "text-destructive" : "text-foreground"}`}>
        {formatCompactCurrency(item.outstanding)}
      </span>
    </li>
  );
}

export function DashboardPaymentScheduleCard({
  t,
  data,
  isLoading,
}: DashboardPaymentScheduleCardProps): JSX.Element {
  const overdue = data?.overdue ?? [];
  const upcoming = data?.upcoming ?? [];
  const hasAny = overdue.length > 0 || upcoming.length > 0;

  return (
    <Card className="flex flex-col p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <CalendarClock className="h-4 w-4 text-muted-foreground" />
        {t.dashboardPaymentScheduleTitle}
      </div>

      {/* KPI summary banners */}
      {!isLoading && (data?.totalOverdue ?? 0) + (data?.totalUpcoming ?? 0) > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-destructive/10 px-3 py-2">
            <p className="text-xs text-destructive/70">{t.dashboardPaymentOverdueLabel}</p>
            <p className="text-sm font-bold text-destructive">
              {formatCompactCurrency(data?.totalOverdue ?? 0)}
            </p>
            <p className="text-xs text-destructive/70">{overdue.length} inv</p>
          </div>
          <div className="rounded-lg bg-muted/50 px-3 py-2">
            <p className="text-xs text-muted-foreground">{t.dashboardPaymentUpcomingLabel}</p>
            <p className="text-sm font-bold text-foreground">
              {formatCompactCurrency(data?.totalUpcoming ?? 0)}
            </p>
            <p className="text-xs text-muted-foreground">{upcoming.length} inv</p>
          </div>
        </div>
      )}

      <div className="mt-3 flex-1">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 animate-pulse rounded-md bg-muted/50" />
            ))}
          </div>
        ) : !hasAny ? (
          <div className="flex h-16 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-xs text-muted-foreground">
            {t.dashboardPaymentScheduleEmpty}
          </div>
        ) : (
          <div className="space-y-3">
            {overdue.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium text-destructive">
                  {t.dashboardPaymentOverdueLabel} ({overdue.length})
                </p>
                <ul className="space-y-1.5">
                  {overdue.slice(0, 5).map((item) => (
                    <ScheduleRow key={item.invoiceUuid} item={item} isOverdue daysSuffix={t.dashboardDaysSuffix} />
                  ))}
                </ul>
              </div>
            )}
            {upcoming.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                  {t.dashboardPaymentUpcomingLabel} ({upcoming.length})
                </p>
                <ul className="space-y-1.5">
                  {upcoming.slice(0, 5).map((item) => (
                    <ScheduleRow key={item.invoiceUuid} item={item} isOverdue={false} daysSuffix={t.dashboardDaysSuffix} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
