import type { JSX } from "react";
import { PieChart as PieIcon } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card } from "@/components/ui/card";
import type { Translations } from "@/configs/i18n";
import { formatCompactCurrency, CHART_TOOLTIP_STYLE } from "./dashboardUtils";

export interface DashboardSaleTypeCardProps {
  t: Translations;
  otcCount: number;
  rxCount: number;
  otcRevenue: number;
  rxRevenue: number;
  isLoading: boolean;
}

export function DashboardSaleTypeCard({
  t,
  otcCount,
  rxCount,
  otcRevenue,
  rxRevenue,
  isLoading,
}: DashboardSaleTypeCardProps): JSX.Element {
  const total = otcCount + rxCount;
  const hasData = total > 0;

  const data = [
    { name: "OTC", value: otcCount, revenue: otcRevenue },
    { name: "Rx", value: rxCount, revenue: rxRevenue },
  ];

  return (
    <Card className="flex flex-col p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <PieIcon className="h-4 w-4 text-muted-foreground" />
        {t.dashboardSaleTypeSplit}
      </div>

      {isLoading ? (
        <div className="mt-3 h-40 w-full animate-pulse rounded-md bg-muted/50" />
      ) : !hasData ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center">
          <p className="text-xs text-muted-foreground/70">{t.dashboardStockAlertsEmpty}</p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-center">
          <div className="h-36 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  dataKey="value"
                  paddingAngle={3}
                >
                  <Cell fill="hsl(var(--primary))" />
                  <Cell fill="hsl(var(--muted-foreground))" opacity={0.4} />
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props) =>
                    [`${value} tx · ${formatCompactCurrency(props.payload.revenue)}`, name]
                  }
                  contentStyle={CHART_TOOLTIP_STYLE}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 space-y-1.5">
            {data.map((entry, i) => (
              <div key={entry.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{
                      background: i === 0 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                      opacity: i === 0 ? 1 : 0.5,
                    }}
                  />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
                <span className="font-medium text-foreground">
                  {entry.value} tx · {Math.round((entry.value / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
