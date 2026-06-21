import type { JSX } from "react";
import { ShoppingCart, ArrowUp, ArrowDown } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import type { PurchaseSpendResponse } from "@/types/dashboard";
import { formatCompactCurrency, CHART_TOOLTIP_STYLE } from "./dashboardUtils";

export interface DashboardPurchaseSpendCardProps {
  t: Translations;
  data: PurchaseSpendResponse | null;
  isLoading: boolean;
}

export function DashboardPurchaseSpendCard({
  t,
  data,
  isLoading,
}: DashboardPurchaseSpendCardProps): JSX.Element {
  const chartData = data?.last6Months ?? [];
  const mtd = data?.mtd ?? null;

  const deltaPercent = mtd?.deltaPercent ?? null;
  // For spend, higher is worse — invert the color logic
  const isPositive = deltaPercent !== null && deltaPercent >= 0;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        {t.dashboardPurchaseSpendTitle}
      </div>

      {/* MTD — primary metric, above the chart */}
      {isLoading ? (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="h-3 w-16 animate-pulse rounded bg-muted/50" />
            <div className="h-7 w-28 animate-pulse rounded bg-muted/50" />
            <div className="h-3 w-20 animate-pulse rounded bg-muted/50" />
          </div>
          <div className="space-y-1.5 text-right">
            <div className="ml-auto h-3 w-20 animate-pulse rounded bg-muted/50" />
            <div className="ml-auto h-6 w-24 animate-pulse rounded bg-muted/50" />
            <div className="ml-auto h-4 w-16 animate-pulse rounded bg-muted/50" />
          </div>
        </div>
      ) : mtd ? (
        <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg bg-muted/30 px-3 py-3">
          <div>
            <p className="text-xs text-muted-foreground">{t.dashboardPurchaseSpendMtdLabel}</p>
            <p className="mt-0.5 text-2xl font-bold text-foreground">
              {formatCompactCurrency(mtd.value)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {mtd.invoiceCount} inv
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{t.dashboardMtdVsPrevLabel}</p>
            <p className="mt-0.5 text-lg font-semibold text-foreground">
              {formatCompactCurrency(mtd.prevValue)}
            </p>
            {deltaPercent !== null && (
              <p
                className={cn(
                  "mt-0.5 flex items-center justify-end gap-0.5 text-xs font-semibold",
                  isPositive ? "text-destructive" : "text-success"
                )}
              >
                {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {isPositive ? "+" : "-"}{Math.abs(deltaPercent).toFixed(1)}%
                <span className={cn("ml-1 font-normal", isPositive ? "text-destructive/70" : "text-success/70")}>
                  ({isPositive ? "+" : "-"}{formatCompactCurrency(Math.abs(mtd.delta))})
                </span>
              </p>
            )}
          </div>
        </div>
      ) : null}

      {/* 6-month bar chart — trend context */}
      <div className="mt-3 h-40 min-w-0">
        {isLoading ? (
          <div className="h-full w-full animate-pulse rounded-md bg-muted/50" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "currentColor" }}
                className="text-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={58}
                tick={{ fontSize: 10, fill: "currentColor" }}
                tickFormatter={formatCompactCurrency}
                className="text-muted-foreground"
              />
              <Tooltip
                formatter={(value: number) => [formatCompactCurrency(value), t.dashboardPurchaseSpendTitle]}
                contentStyle={CHART_TOOLTIP_STYLE}
              />
              <Bar dataKey="spend" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
