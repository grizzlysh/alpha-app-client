import type { JSX } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import type { RootState } from "@/store";
import { getDashboard, getAdvancedDashboard } from "@/service/dashboardService";
import { DashboardKpiCards } from "@/components/dashboard/DashboardKpiCards";
import { DashboardSalesTrendChart } from "@/components/dashboard/DashboardSalesTrendChart";
import { DashboardSaleTypeCard } from "@/components/dashboard/DashboardSaleTypeCard";
import { DashboardRestockCard } from "@/components/dashboard/DashboardRestockCard";
import { DashboardExpiringCard } from "@/components/dashboard/DashboardExpiringCard";
import { DashboardRecentTransactions } from "@/components/dashboard/DashboardRecentTransactions";
import { DashboardTopByQuantityCard } from "@/components/dashboard/DashboardTopByQuantityCard";
import { DashboardTopByRevenueCard } from "@/components/dashboard/DashboardTopByRevenueCard";
import { DashboardPurchaseOrders } from "@/components/dashboard/DashboardPurchaseOrders";
import { DashboardCompliance } from "@/components/dashboard/DashboardCompliance";
import { DashboardUnpaidInvoicesCard } from "@/components/dashboard/DashboardUnpaidInvoicesCard";
import { DashboardQuickActions } from "@/components/dashboard/DashboardQuickActions";
import { DashboardSlowMoversCard } from "@/components/dashboard/DashboardSlowMoversCard";
import { DashboardStockRunwayCard } from "@/components/dashboard/DashboardStockRunwayCard";
import { DashboardRevenueAndProfitCard } from "@/components/dashboard/DashboardRevenueAndProfitCard";
import { DashboardPurchaseSpendCard } from "@/components/dashboard/DashboardPurchaseSpendCard";
import { DashboardPaymentScheduleCard } from "@/components/dashboard/DashboardPaymentScheduleCard";
import { DashboardCreditSalesCard } from "@/components/dashboard/DashboardCreditSalesCard";

const MANAGEMENT_ROLES = new Set(["OWNER", "ADMIN", "HEAD_PHARMACIST"]);

export default function DashboardPage(): JSX.Element {
  const { t, language } = useLanguage();
  const pageTitleRef = useScrollAwareTitle();

  const currentPharmacy = useSelector((state: RootState) => state.auth.currentPharmacy);
  const isManagement = MANAGEMENT_ROLES.has(currentPharmacy?.role?.type ?? "");

  const [rangeDays, setRangeDays] = useState<7 | 14 | 30>(7);

  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    staleTime: 5 * 60 * 1000,
  });

  const advancedQuery = useQuery({
    queryKey: ["dashboard-advanced"],
    queryFn: () => getAdvancedDashboard(30),
    staleTime: 5 * 60 * 1000,
    enabled: isManagement,
  });

  const dailyOps = dashboardQuery.data?.data?.dailyOps ?? null;
  const inventoryAlerts = dashboardQuery.data?.data?.inventoryAlerts;
  const topProducts = dashboardQuery.data?.data?.topProducts;
  const inventoryAsset = dashboardQuery.data?.data?.inventoryAsset ?? null;
  const slowMovers = dashboardQuery.data?.data?.slowMovers ?? null;
  const stockRunway = dashboardQuery.data?.data?.stockRunway ?? null;
  const advanced = advancedQuery.data?.data ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h2 ref={pageTitleRef} className="text-2xl font-bold tracking-tight text-foreground">
          {t.navDashboard}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.dashboardSubtitle}</p>
      </div>

      {/* Row 1: KPI Cards (4) — all roles */}
      <DashboardKpiCards
        t={t}
        revenue={dailyOps?.revenue ?? null}
        transactionCount={dailyOps?.transactionCount ?? null}
        avgTransactionValue={dailyOps?.avgTransactionValue ?? null}
        inventoryAsset={inventoryAsset?.totalAsset ?? null}
        inventoryAssetDeltaPercent={inventoryAsset?.deltaPercent ?? null}
        inventoryAssetPrevDate={inventoryAsset?.prevQuarterEndDate ?? null}
        isLoading={dashboardQuery.isLoading}
      />

      {/* Row 2 (management): Sales Trend + OTC vs Rx */}
      {isManagement && (
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <DashboardSalesTrendChart
              t={t}
              data={advanced?.salesTrend.data ?? []}
              rangeDays={rangeDays}
              language={language}
              onRangeChange={setRangeDays}
              isLoading={advancedQuery.isLoading}
            />
          </div>
          <DashboardSaleTypeCard
            t={t}
            otcCount={dailyOps?.otcVsRx.otcCount ?? 0}
            rxCount={dailyOps?.otcVsRx.rxCount ?? 0}
            otcRevenue={dailyOps?.otcVsRx.otcRevenue ?? 0}
            rxRevenue={dailyOps?.otcVsRx.rxRevenue ?? 0}
            isLoading={dashboardQuery.isLoading}
          />
        </div>
      )}

      {/* Row 3 (management): Revenue & Gross Profit (combined) */}
      {isManagement && (
        <DashboardRevenueAndProfitCard
          t={t}
          data={advanced?.revenueProfit ?? null}
          isLoading={advancedQuery.isLoading}
        />
      )}

      {/* Row 4 (management): Purchase Spend + Payment Schedule */}
      {isManagement && (
        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardPurchaseSpendCard
            t={t}
            data={advanced?.purchaseSpend ?? null}
            isLoading={advancedQuery.isLoading}
          />
          <DashboardPaymentScheduleCard
            t={t}
            data={advanced?.paymentSchedule ?? null}
            isLoading={advancedQuery.isLoading}
          />
        </div>
      )}

      {/* Row 5: Inventory alerts — 3 cols */}
      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardRestockCard
          t={t}
          items={inventoryAlerts?.restockNeeded ?? []}
          isLoading={dashboardQuery.isLoading}
        />
        <DashboardExpiringCard
          t={t}
          items={inventoryAlerts?.expiringSoon ?? []}
          isLoading={dashboardQuery.isLoading}
        />
        {isManagement ? (
          <DashboardCompliance
            t={t}
            compliance={advanced?.compliance ?? null}
            isLoading={advancedQuery.isLoading}
          />
        ) : (
          <DashboardRecentTransactions
            t={t}
            transactions={dailyOps?.recentTransactions ?? []}
            isLoading={dashboardQuery.isLoading}
          />
        )}
      </div>

      {/* Row 6: Slow Movers + Stock Runway — all roles */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardSlowMoversCard
          t={t}
          items={slowMovers?.items ?? []}
          isLoading={dashboardQuery.isLoading}
        />
        <DashboardStockRunwayCard
          t={t}
          items={stockRunway?.items ?? []}
          isLoading={dashboardQuery.isLoading}
        />
      </div>

      {/* Row 7: Top products */}
      {isManagement ? (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <DashboardTopByQuantityCard
              t={t}
              data={topProducts?.byQuantity ?? []}
              isLoading={dashboardQuery.isLoading}
            />
            <DashboardTopByRevenueCard
              t={t}
              data={topProducts?.byRevenue ?? []}
              isLoading={dashboardQuery.isLoading}
            />
            <DashboardPurchaseOrders
              t={t}
              orders={advanced?.openPurchaseOrders ?? []}
              isLoading={advancedQuery.isLoading}
            />
          </div>

          {/* Row 8: Unpaid invoices */}
          <DashboardUnpaidInvoicesCard
            t={t}
            unpaidInvoices={advanced?.unpaidInvoices ?? null}
            isLoading={advancedQuery.isLoading}
          />

          {/* Row 9: Credit sales outstanding + Recent transactions */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Row 9: Credit sales outstanding */}
            <DashboardCreditSalesCard
              t={t}
              data={advanced?.creditSalesOutstanding ?? null}
              isLoading={advancedQuery.isLoading}
            />

            {/* Row 10: Recent transactions */}
            <DashboardRecentTransactions
              t={t}
              transactions={dailyOps?.recentTransactions ?? []}
              isLoading={dashboardQuery.isLoading}
            />
          </div>
        </>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardTopByQuantityCard
            t={t}
            data={topProducts?.byQuantity ?? []}
            isLoading={dashboardQuery.isLoading}
          />
          <DashboardTopByRevenueCard
            t={t}
            data={topProducts?.byRevenue ?? []}
            isLoading={dashboardQuery.isLoading}
          />
        </div>
      )}

      {/* Quick Actions — all roles */}
      <DashboardQuickActions t={t} />
    </div>
  );
}
