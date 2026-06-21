import type { JSX } from "react";
import { BarChart3, ArrowUp, ArrowDown } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import type { RevenueProfitResponse } from "@/types/dashboard";
import { formatCompactCurrency, CHART_TOOLTIP_STYLE } from "./dashboardUtils";

export interface DashboardRevenueAndProfitCardProps {
  t: Translations;
  data: RevenueProfitResponse | null;
  isLoading: boolean;
}

function marginBadgeClass(pct: number): string {
  if (pct >= 30) return "bg-success/10 text-success";
  if (pct >= 15) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  return "bg-destructive/10 text-destructive";
}

function marginBarColor(pct: number): string {
  if (pct >= 30) return "bg-success";
  if (pct >= 15) return "bg-amber-500";
  return "bg-destructive";
}

export function DashboardRevenueAndProfitCard({
  t,
  data,
  isLoading,
}: DashboardRevenueAndProfitCardProps): JSX.Element {
  const chartData = data?.last6Months ?? [];
  const mtdRevenue = data?.mtd.revenue ?? null;
  const mtdProfit = data?.mtd.grossProfit ?? null;

  const revDeltaPercent = mtdRevenue?.deltaPercent ?? null;
  const revIsPositive = revDeltaPercent !== null && revDeltaPercent >= 0;

  const profitDeltaPercent = mtdProfit?.deltaPercent ?? null;
  const profitIsPositive = profitDeltaPercent !== null && profitDeltaPercent >= 0;
  const marginPct = mtdProfit?.marginPercent ?? null;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
        {t.dashboardMonthlyRevenueTitle} & {t.dashboardGrossProfitTitle}
      </div>

      {/* MTD stats row */}
      {isLoading ? (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-16 animate-pulse rounded bg-muted/50" />
              <div className="h-7 w-28 animate-pulse rounded bg-muted/50" />
              <div className="h-3 w-20 animate-pulse rounded bg-muted/50" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {/* Revenue MTD */}
          {mtdRevenue && (
            <div className="rounded-lg bg-muted/30 px-3 py-3">
              <p className="text-xs text-muted-foreground">{t.dashboardRevenueLabel} · {t.dashboardMtdLabel}</p>
              <p className="mt-0.5 text-2xl font-bold text-foreground">
                {formatCompactCurrency(mtdRevenue.value)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {mtdRevenue.transactionCount.toLocaleString()} tx
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t.dashboardMtdVsPrevLabel}:{" "}
                <span className="font-medium text-foreground">
                  {formatCompactCurrency(mtdRevenue.prevValue)}
                </span>
              </p>
              {revDeltaPercent !== null && (
                <p
                  className={cn(
                    "mt-1 flex items-center gap-0.5 text-xs font-semibold",
                    revIsPositive ? "text-success" : "text-destructive"
                  )}
                >
                  {revIsPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {revIsPositive ? "+" : "-"}{Math.abs(revDeltaPercent).toFixed(1)}%
                  <span className={cn("ml-1 font-normal", revIsPositive ? "text-success/70" : "text-destructive/70")}>
                    ({revIsPositive ? "+" : "-"}{formatCompactCurrency(Math.abs(mtdRevenue.delta))})
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Gross Profit MTD */}
          {mtdProfit && (
            <div className="rounded-lg bg-muted/30 px-3 py-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-muted-foreground">{t.dashboardGrossProfitTitle} · {t.dashboardMtdLabel}</p>
                {marginPct !== null && (
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-xs font-bold",
                      marginBadgeClass(marginPct)
                    )}
                  >
                    {marginPct.toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-2xl font-bold text-foreground">
                {formatCompactCurrency(mtdProfit.value)}
              </p>
              {profitDeltaPercent !== null && (
                <p
                  className={cn(
                    "mt-1 flex items-center gap-0.5 text-xs font-semibold",
                    profitIsPositive ? "text-success" : "text-destructive"
                  )}
                >
                  {profitIsPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {profitIsPositive ? "+" : "-"}{Math.abs(profitDeltaPercent).toFixed(1)}%
                  <span className={cn("ml-1 font-normal", profitIsPositive ? "text-success/70" : "text-destructive/70")}>
                    ({profitIsPositive ? "+" : "-"}{formatCompactCurrency(Math.abs(mtdProfit.delta))})
                  </span>
                  <span className="ml-1 font-normal text-muted-foreground">
                    {t.dashboardGrossProfitVsLastMonth}
                  </span>
                </p>
              )}
              {marginPct !== null && (
                <div className="mt-2.5">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-1.5 rounded-full transition-all", marginBarColor(marginPct))}
                      style={{ width: `${Math.min(marginPct, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Grouped bar chart — 6 months */}
      <div className="mt-4 h-52 min-w-0">
        {isLoading ? (
          <div className="h-full w-full animate-pulse rounded-md bg-muted/50" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="20%">
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
                formatter={(value, name, props) => {
                  const isProfit = name === "grossProfit";
                  const v = value as number;
                  const margin = isProfit ? props.payload?.marginPercent : undefined;
                  const label = isProfit && margin !== null && margin !== undefined
                    ? `${formatCompactCurrency(v)} · ${margin.toFixed(1)}% margin`
                    : formatCompactCurrency(v);
                  return [label, isProfit ? t.dashboardGrossProfitTitle : t.dashboardRevenueLabel];
                }}
                contentStyle={CHART_TOOLTIP_STYLE}
              />
              <Legend
                formatter={(value) =>
                  value === "grossProfit" ? t.dashboardGrossProfitTitle : t.dashboardRevenueLabel
                }
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11 }}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="grossProfit" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
