import type { JSX } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/components/ui/card";
import type { Translations } from "@/configs/i18n";
import type { TopProductItem } from "@/types/dashboard";
import { formatCompactCurrency, CHART_TOOLTIP_STYLE } from "./dashboardUtils";

export interface DashboardTopByRevenueCardProps {
  t: Translations;
  data: TopProductItem[];
  isLoading: boolean;
}

export function DashboardTopByRevenueCard({
  t,
  data,
  isLoading,
}: DashboardTopByRevenueCardProps): JSX.Element {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
        {t.dashboardTopByRevenueTitle}
      </div>

      <div className="mt-3 h-44 min-w-0">
        {isLoading ? (
          <div className="h-full w-full animate-pulse rounded-md bg-muted/50" />
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {t.dashboardTopProductsEmpty}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 64, left: 4, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="medicineName"
                tickLine={false}
                axisLine={false}
                width={110}
                tick={{ fontSize: 10, fill: "currentColor" }}
                tickFormatter={(v: string) => v.toUpperCase()}
                className="text-muted-foreground"
              />
              <Tooltip
                formatter={(value: number) => [formatCompactCurrency(value)]}
                contentStyle={CHART_TOOLTIP_STYLE}
              />
              <Bar dataKey="totalRevenue" fill="hsl(var(--chart-2))" radius={[0, 6, 6, 0]}>
                <LabelList
                  dataKey="totalRevenue"
                  position="right"
                  formatter={(v: number) => formatCompactCurrency(v)}
                  style={{ fontSize: 10, fill: "currentColor" }}
                  className="text-muted-foreground"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
