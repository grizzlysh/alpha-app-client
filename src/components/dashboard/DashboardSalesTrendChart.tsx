import type { JSX } from "react";
import { BarChart3 } from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import type { SalesTrendDay } from "@/types/dashboard";
import { formatCompactCurrency, CHART_TOOLTIP_STYLE } from "./dashboardUtils";

export interface DashboardSalesTrendChartProps {
  t: Translations;
  data: SalesTrendDay[];
  rangeDays: 7 | 14 | 30;
  language: string;
  onRangeChange: (days: 7 | 14 | 30) => void;
  isLoading: boolean;
}

function formatLabel(dateStr: string, rangeDays: number, locale: string): string {
  const bcp47 = locale === "id" ? "id-ID" : "en-US";
  const date = new Date(dateStr);
  return rangeDays <= 7
    ? date.toLocaleDateString(bcp47, { weekday: "short" })
    : date.toLocaleDateString(bcp47, { day: "numeric", month: "short" });
}

function rangePeriodLabel(rangeDays: 7 | 14 | 30, t: Translations): string {
  if (rangeDays === 7) return t.dashboardRevenue7Days;
  if (rangeDays === 14) return t.dashboardRevenue14Days;
  return t.dashboardRevenue30Days;
}

export function DashboardSalesTrendChart({
  t,
  data,
  rangeDays,
  language,
  onRangeChange,
  isLoading,
}: DashboardSalesTrendChartProps): JSX.Element {
  const sliced = data.slice(-rangeDays);

  const chartData = sliced.map((d) => ({
    ...d,
    label: formatLabel(d.date, rangeDays, language),
  }));

  const maxTx = Math.max(...chartData.map((d) => d.transactionCount), 1);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold text-foreground">{t.dashboardSalesTrendTitle}</p>
            <p className="text-xs text-muted-foreground">{rangePeriodLabel(rangeDays, t)}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {([7, 14, 30] as const).map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => onRangeChange(days)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                rangeDays === days
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-4 rounded" style={{ background: "hsl(var(--primary))", opacity: 0.6 }} />
          {t.dashboardRevenueLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded" style={{ background: "hsl(var(--chart-2))" }} />
          {t.dashboardTransactionCount}
        </span>
      </div>

      <div className="mt-2 h-56 min-w-0">
        {isLoading ? (
          <div className="h-full w-full animate-pulse rounded-md bg-muted/50" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 4, right: 48, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                interval={rangeDays === 30 ? 4 : 0}
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-muted-foreground"
              />
              <YAxis
                yAxisId="revenue"
                orientation="left"
                tickLine={false}
                axisLine={false}
                width={62}
                tick={{ fontSize: 10, fill: "currentColor" }}
                tickFormatter={formatCompactCurrency}
                className="text-muted-foreground"
              />
              <YAxis
                yAxisId="tx"
                orientation="right"
                tickLine={false}
                axisLine={false}
                width={32}
                domain={[0, Math.ceil(maxTx * 1.3)]}
                tick={{ fontSize: 10, fill: "currentColor" }}
                tickFormatter={(v: number) => String(v)}
                className="text-muted-foreground"
              />
              <Tooltip
                formatter={(value, name) => {
                  const v = value as number;
                  if (name === "revenue") return [formatCompactCurrency(v), t.dashboardRevenueLabel];
                  return [v, t.dashboardTransactionCount];
                }}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ""}
                contentStyle={CHART_TOOLTIP_STYLE}
              />
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Line
                yAxisId="tx"
                type="monotone"
                dataKey="transactionCount"
                stroke="hsl(var(--chart-2))"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, strokeWidth: 0 }}
                strokeDasharray="4 2"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
