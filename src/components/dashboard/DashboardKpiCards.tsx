import type { JSX } from "react";
import { Wallet, Receipt, Clock3, Package, ArrowUp, ArrowDown } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import type { KpiDelta } from "@/types/dashboard";
import { formatCompactCurrency } from "./dashboardUtils";

export interface DashboardKpiCardsProps {
  t: Translations;
  revenue: KpiDelta | null;
  transactionCount: KpiDelta | null;
  avgTransactionValue: KpiDelta | null;
  inventoryAsset: number | null;
  inventoryAssetDeltaPercent: number | null;
  inventoryAssetPrevDate: string | null;
  isLoading: boolean;
}

interface KpiCardProps {
  icon: typeof Wallet;
  label: string;
  value: string;
  deltaPercent: number | null;
  deltaAbsolute: number | null;
  deltaType: "percent" | "absolute";
  vsLabel: string;
  isLoading: boolean;
}

function KpiCard({
  icon: Icon,
  label,
  value,
  deltaPercent,
  deltaAbsolute,
  deltaType,
  vsLabel,
  isLoading,
}: KpiCardProps): JSX.Element {
  const raw = deltaType === "absolute" ? deltaAbsolute : deltaPercent;
  const isPositive = raw !== null && raw >= 0;

  const deltaText =
    raw !== null
      ? deltaType === "absolute"
        ? `${isPositive ? "+" : ""}${Math.round(raw)}`
        : `${isPositive ? "+" : "-"}${Math.abs(raw).toFixed(0)}%`
      : null;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      {isLoading ? (
        <div className="mt-2 h-8 w-24 animate-pulse rounded-md bg-muted/50" />
      ) : (
        <>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          {deltaText !== null && (
            <p
              className={cn(
                "mt-1 flex items-center gap-1 text-xs font-medium",
                isPositive ? "text-success" : "text-destructive"
              )}
            >
              {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {deltaText} {vsLabel}
            </p>
          )}
        </>
      )}
    </Card>
  );
}


export function DashboardKpiCards({
  t,
  revenue,
  transactionCount,
  avgTransactionValue,
  inventoryAsset,
  inventoryAssetDeltaPercent,
  inventoryAssetPrevDate,
  isLoading,
}: DashboardKpiCardsProps): JSX.Element {
  const assetVsLabel = inventoryAssetPrevDate
    ? `vs ${new Date(inventoryAssetPrevDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : t.dashboardInventoryAssetVsQuarter;
  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
      <KpiCard
        icon={Wallet}
        label={t.dashboardTodayRevenue}
        value={formatCompactCurrency(revenue?.today ?? 0)}
        deltaPercent={revenue?.deltaPercent ?? null}
        deltaAbsolute={revenue?.delta ?? null}
        deltaType="percent"
        vsLabel={t.dashboardVsYesterday}
        isLoading={isLoading}
      />
      <KpiCard
        icon={Receipt}
        label={t.dashboardTransactionCount}
        value={String(transactionCount?.today ?? 0)}
        deltaPercent={transactionCount?.deltaPercent ?? null}
        deltaAbsolute={transactionCount?.delta ?? null}
        deltaType="absolute"
        vsLabel={t.dashboardVsYesterday}
        isLoading={isLoading}
      />
      <KpiCard
        icon={Clock3}
        label={t.dashboardAvgTransaction}
        value={formatCompactCurrency(avgTransactionValue?.today ?? 0)}
        deltaPercent={avgTransactionValue?.deltaPercent ?? null}
        deltaAbsolute={avgTransactionValue?.delta ?? null}
        deltaType="percent"
        vsLabel={t.dashboardVsYesterday}
        isLoading={isLoading}
      />
      <KpiCard
        icon={Package}
        label={t.dashboardInventoryAsset}
        value={formatCompactCurrency(inventoryAsset ?? 0)}
        deltaPercent={inventoryAssetDeltaPercent}
        deltaAbsolute={null}
        deltaType="percent"
        vsLabel={assetVsLabel}
        isLoading={isLoading}
      />
    </div>
  );
}
