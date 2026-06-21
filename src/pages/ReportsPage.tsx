import type { JSX } from "react";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { SalesReportTab } from "@/components/reports/SalesReportTab";
import { PurchaseReportTab } from "@/components/reports/PurchaseReportTab";
import { InventoryReportTab } from "@/components/reports/InventoryReportTab";
import { StockMovementReportTab } from "@/components/reports/StockMovementReportTab";
import { DisposalReportTab } from "@/components/reports/DisposalReportTab";
import { ReturnReportTab } from "@/components/reports/ReturnReportTab";

export default function ReportsPage(): JSX.Element {
  const { t } = useLanguage();
  const pageTitleRef = useScrollAwareTitle();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2
          ref={pageTitleRef}
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          {t.navReports}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.reportsSubtitle}</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sales">
        <TabsList className="h-auto flex-wrap gap-1 p-1">
          <TabsTrigger value="sales">{t.reportsSalesTab}</TabsTrigger>
          <TabsTrigger value="purchase">{t.reportsPurchaseTab}</TabsTrigger>
          <TabsTrigger value="inventory">{t.reportsInventoryTab}</TabsTrigger>
          <TabsTrigger value="stock-movement">{t.reportsStockMovementTab}</TabsTrigger>
          <TabsTrigger value="disposal">{t.reportsDisposalTab}</TabsTrigger>
          <TabsTrigger value="returns">{t.reportsReturnsTab}</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card className="p-6">
            <SalesReportTab />
          </Card>
        </TabsContent>

        <TabsContent value="purchase">
          <Card className="p-6">
            <PurchaseReportTab />
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card className="p-6">
            <InventoryReportTab />
          </Card>
        </TabsContent>

        <TabsContent value="stock-movement">
          <Card className="p-6">
            <StockMovementReportTab />
          </Card>
        </TabsContent>

        <TabsContent value="disposal">
          <Card className="p-6">
            <DisposalReportTab />
          </Card>
        </TabsContent>

        <TabsContent value="returns">
          <Card className="p-6">
            <ReturnReportTab />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
