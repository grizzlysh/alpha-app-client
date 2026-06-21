import type { JSX } from "react";
import { FileWarning } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import type { Translations } from "@/configs/i18n";
import type { UnpaidInvoiceSummary } from "@/types/dashboard";
import { formatCompactCurrency, CHART_TOOLTIP_STYLE } from "./dashboardUtils";

export interface DashboardUnpaidInvoicesCardProps {
  t: Translations;
  unpaidInvoices: UnpaidInvoiceSummary | null;
  isLoading: boolean;
}

export function DashboardUnpaidInvoicesCard({
  t,
  unpaidInvoices,
  isLoading,
}: DashboardUnpaidInvoicesCardProps): JSX.Element {
  const byDistributor = unpaidInvoices?.byDistributor ?? [];
  const totalOutstanding = unpaidInvoices?.totalOutstanding ?? 0;
  const totalCount = unpaidInvoices?.totalCount ?? 0;

  const sorted = [...byDistributor].sort((a, b) => {
    if (!a.oldestDueDate && !b.oldestDueDate) return 0;
    if (!a.oldestDueDate) return 1;
    if (!b.oldestDueDate) return -1;
    return new Date(a.oldestDueDate).getTime() - new Date(b.oldestDueDate).getTime();
  });

  const chartData = sorted.slice(0, 6).map((d) => ({
    name: d.distributorName.toUpperCase(),
    value: d.totalOutstanding,
    invoiceCount: d.invoiceCount,
  }));

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileWarning className="h-4 w-4 text-muted-foreground" />
          {t.dashboardUnpaidInvoicesTitle}
          {totalCount > 0 && (
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              {totalCount}
            </span>
          )}
        </div>
        {totalOutstanding > 0 && (
          <span className="text-xs font-medium text-destructive">
            {t.dashboardUnpaidTotalLabel}: {formatCompactCurrency(totalOutstanding)}
          </span>
        )}
      </div>

      <div className="mt-3 h-48 min-w-0">
        {isLoading ? (
          <div className="h-full w-full animate-pulse rounded-md bg-muted/50" />
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {t.dashboardUnpaidInvoicesEmpty}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 76, left: 4, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                width={150}
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-muted-foreground"
              />
              <Tooltip
                formatter={(value, _, props) =>
                  [`${formatCompactCurrency(value as number)} · ${props.payload.invoiceCount} inv`]
                }
                contentStyle={CHART_TOOLTIP_STYLE}
              />
              <Bar dataKey="value" fill="hsl(var(--chart-3))" radius={[0, 6, 6, 0]}>
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(v) => formatCompactCurrency(v as number)}
                  style={{ fontSize: 11, fill: "currentColor" }}
                  className="text-foreground"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
