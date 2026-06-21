import type { JSX } from "react";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { StatCard } from "@/components/shared/StatCard";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/useLanguage";
import { getInventorySummary, getInventoryList, getInventoryExport } from "@/service/reportService";
import { ReportExportButton } from "./ReportExportButton";
import { ReportSection } from "./ReportSection";
import { ReportTable } from "./ReportTable";
import { formatCurrency, formatDate } from "./reportUtils";
import { exportToCsv, exportToXlsx } from "./reportExport";

type DetailTab = "all-stock" | "low-stock" | "expiring-soon" | "expired";

export function InventoryReportTab(): JSX.Element {
  const { t } = useLanguage();

  const [expiryDays, setExpiryDays] = useState(30);
  const [activeTab, setActiveTab] = useState<DetailTab>("all-stock");
  const [allPage, setAllPage] = useState(1);
  const [allLimit, setAllLimit] = useState(25);
  const [lowPage, setLowPage] = useState(1);
  const [lowLimit, setLowLimit] = useState(25);
  const [isExporting, setIsExporting] = useState(false);

  const summaryParams = { expiryDays };
  const allStockParams = { page: allPage, limit: allLimit };
  const lowStockParams = { isLowStock: true as const, page: lowPage, limit: lowLimit };

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["report-inventory-summary", summaryParams],
    queryFn: () => getInventorySummary(summaryParams),
  });

  const { data: allStockData, isLoading: allStockLoading } = useQuery({
    queryKey: ["report-inventory-list", allStockParams],
    queryFn: () => getInventoryList(allStockParams),
    placeholderData: keepPreviousData,
  });

  const { data: lowStockData, isLoading: lowStockLoading } = useQuery({
    queryKey: ["report-inventory-list", lowStockParams],
    queryFn: () => getInventoryList(lowStockParams),
    placeholderData: keepPreviousData,
    enabled: activeTab === "low-stock",
  });

  const summary = summaryData?.data;
  const allStockList = allStockData?.data ?? [];
  const allStockMeta = allStockData?.meta;
  const lowStockList = lowStockData?.data ?? [];
  const lowStockMeta = lowStockData?.meta;

  const lowCount = summary?.summary.lowStockCount ?? 0;
  const expiringCount = summary?.expiringSoon.length ?? 0;
  const expiredCount = summary?.expired.length ?? 0;

  function handleExpiryDaysChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) setExpiryDays(val);
  }

  async function handleCsv(): Promise<void> {
    if (!summary) return;
    setIsExporting(true);
    try {
      if (activeTab === "all-stock") {
        const resp = await getInventoryExport({});
        const rows = resp.data ?? [];
        exportToCsv("inventory-stock-levels.csv",
          [t.reportInventoryMedicine, t.reportInventoryUnit, t.reportInventoryPieces, t.reportInventoryReorderLevel, t.reportInventoryStatus, t.reportInventoryBasePrice, t.reportInventorySellingPrice],
          rows.map((r) => [r.medicineName, r.unit, r.totalPieces, r.reorderLevel, r.isLowStock ? t.reportInventoryStatusLow : t.reportInventoryStatusNormal, r.basePrice, r.sellingPrice])
        );
      } else if (activeTab === "low-stock") {
        const resp = await getInventoryExport({ isLowStock: true });
        const rows = resp.data ?? [];
        exportToCsv("inventory-low-stock.csv",
          [t.reportInventoryMedicine, t.reportInventoryUnit, t.reportInventoryPieces, t.reportInventoryReorderLevel],
          rows.map((r) => [r.medicineName, r.unit, r.totalPieces, r.reorderLevel])
        );
      } else if (activeTab === "expiring-soon") {
        exportToCsv("inventory-expiring-soon.csv",
          [t.reportInventoryMedicine, t.reportInventoryBatch, t.reportInventoryExpiryDate, t.reportInventoryDaysLeft, t.reportInventoryPieces, t.reportInventoryDistributor],
          summary.expiringSoon.map((r) => [r.medicineName, r.batchNumber, r.expiryDate, r.daysUntilExpiry, r.quantityPieces, r.distributorName])
        );
      } else {
        exportToCsv("inventory-expired.csv",
          [t.reportInventoryMedicine, t.reportInventoryBatch, t.reportInventoryExpiryDate, t.reportInventoryPieces, t.reportInventoryDistributor],
          summary.expired.map((r) => [r.medicineName, r.batchNumber, r.expiryDate, r.quantityPieces, r.distributorName])
        );
      }
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExcel(): Promise<void> {
    if (!summary) return;
    setIsExporting(true);
    try {
      const resp = await getInventoryExport({});
      const allRows = resp.data ?? [];
      exportToXlsx("inventory-report.xlsx", [
        {
          name: t.reportInventoryStockLevels,
          headers: [t.reportInventoryMedicine, t.reportInventoryUnit, t.reportInventoryPieces, t.reportInventoryReorderLevel, t.reportInventoryStatus, t.reportInventoryBasePrice, t.reportInventorySellingPrice],
          rows: allRows.map((r) => [r.medicineName, r.unit, r.totalPieces, r.reorderLevel, r.isLowStock ? t.reportInventoryStatusLow : t.reportInventoryStatusNormal, r.basePrice, r.sellingPrice]),
        },
        {
          name: t.reportInventoryExpiringSoonSection,
          headers: [t.reportInventoryMedicine, t.reportInventoryBatch, t.reportInventoryExpiryDate, t.reportInventoryDaysLeft, t.reportInventoryPieces, t.reportInventoryDistributor],
          rows: summary.expiringSoon.map((r) => [r.medicineName, r.batchNumber, r.expiryDate, r.daysUntilExpiry, r.quantityPieces, r.distributorName]),
        },
        {
          name: t.reportInventoryExpiredSection,
          headers: [t.reportInventoryMedicine, t.reportInventoryBatch, t.reportInventoryExpiryDate, t.reportInventoryPieces, t.reportInventoryDistributor],
          rows: summary.expired.map((r) => [r.medicineName, r.batchNumber, r.expiryDate, r.quantityPieces, r.distributorName]),
        },
      ]);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {t.reportInventoryExpiryDays}
          </span>
          <Input
            type="number"
            min={1}
            value={expiryDays}
            onChange={handleExpiryDaysChange}
            className="h-9 w-[6rem]"
          />
          <span className="text-sm text-muted-foreground">{t.reportDays}</span>
        </div>
        <ReportExportButton t={t} onCsv={handleCsv} onExcel={handleExcel} disabled={!summary || isExporting} />
      </div>

      {summaryLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !summary ? null : (
        <div className="space-y-6">
          {/* Summary — always visible */}
          <ReportSection title={t.reportSummaryTitle}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <StatCard label={t.reportInventoryTotalMedicines} value={String(summary.summary.totalMedicines)} />
              <StatCard label={t.reportInventoryStockValue} value={formatCurrency(summary.summary.totalStockValue)} />
              <StatCard label={t.reportInventoryLowStockCount} value={String(summary.summary.lowStockCount)} />
              <StatCard label={t.reportInventoryExpiringSoonCount} value={String(summary.summary.expiringSoonCount)} />
              <StatCard label={t.reportInventoryExpiredCount} value={String(summary.summary.expiredCount)} />
            </div>
          </ReportSection>

          {/* Detail tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DetailTab)}>
            <TabsList>
              <TabsTrigger value="all-stock">{t.reportInventoryStockLevels}</TabsTrigger>
              <TabsTrigger value="low-stock">
                {t.reportInventoryLowStockSection}
                {lowCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-destructive/20 px-1.5 py-0.5 text-xs font-medium text-destructive">
                    {lowCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="expiring-soon">
                {t.reportInventoryExpiringSoonSection}
                {expiringCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-warning/20 px-1.5 py-0.5 text-xs font-medium text-warning">
                    {expiringCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="expired">
                {t.reportInventoryExpiredSection}
                {expiredCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-destructive/20 px-1.5 py-0.5 text-xs font-medium text-destructive">
                    {expiredCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all-stock" className="mt-4">
              {allStockLoading && allStockList.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <ReportTable
                    rows={allStockList}
                    keyExtractor={(r) => r.medicineUuid}
                    emptyLabel={t.reportNoData}
                    columns={[
                      { key: "name", header: t.reportInventoryMedicine, sortValue: (r) => r.medicineName, render: (r) => <span className="uppercase">{r.medicineName}</span> },
                      { key: "unit", header: t.reportInventoryUnit, sortValue: (r) => r.unit, render: (r) => r.unit },
                      { key: "pieces", header: t.reportInventoryPieces, sortValue: (r) => r.totalPieces, render: (r) => r.totalPieces.toLocaleString("id-ID") },
                      { key: "reorder", header: t.reportInventoryReorderLevel, sortValue: (r) => r.reorderLevel, render: (r) => r.reorderLevel },
                      {
                        key: "status",
                        header: t.reportInventoryStatus,
                        sortValue: (r) => (r.isLowStock ? 0 : 1),
                        render: (r) => r.isLowStock
                          ? <span className="text-destructive font-medium">{t.reportInventoryStatusLow}</span>
                          : <span className="text-success">{t.reportInventoryStatusNormal}</span>,
                      },
                      { key: "basePrice", header: t.reportInventoryBasePrice, sortValue: (r) => r.basePrice, render: (r) => formatCurrency(r.basePrice) },
                      { key: "sellingPrice", header: t.reportInventorySellingPrice, sortValue: (r) => r.sellingPrice, render: (r) => formatCurrency(r.sellingPrice) },
                    ]}
                  />
                  {allStockMeta && (
                    <TablePaginationFooter
                      page={allStockMeta.page}
                      limit={allStockMeta.limit}
                      total={allStockMeta.total}
                      totalPages={allStockMeta.totalPages}
                      labels={{ showing: t.showing, of: t.of, rowsPerPage: t.rowsPerPage }}
                      onPageChange={setAllPage}
                      onLimitChange={(l) => { setAllLimit(l); setAllPage(1); }}
                    />
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="low-stock" className="mt-4">
              {lowStockLoading && lowStockList.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <ReportTable
                    rows={lowStockList}
                    keyExtractor={(r) => r.medicineUuid + "-low"}
                    emptyLabel={t.reportNoData}
                    columns={[
                      { key: "name", header: t.reportInventoryMedicine, sortValue: (r) => r.medicineName, render: (r) => <span className="uppercase">{r.medicineName}</span> },
                      { key: "unit", header: t.reportInventoryUnit, sortValue: (r) => r.unit, render: (r) => r.unit },
                      {
                        key: "pieces",
                        header: t.reportInventoryPieces,
                        sortValue: (r) => r.totalPieces,
                        render: (r) => <span className="text-destructive font-medium">{r.totalPieces.toLocaleString("id-ID")}</span>,
                      },
                      { key: "reorder", header: t.reportInventoryReorderLevel, sortValue: (r) => r.reorderLevel, render: (r) => r.reorderLevel },
                    ]}
                  />
                  {lowStockMeta && (
                    <TablePaginationFooter
                      page={lowStockMeta.page}
                      limit={lowStockMeta.limit}
                      total={lowStockMeta.total}
                      totalPages={lowStockMeta.totalPages}
                      labels={{ showing: t.showing, of: t.of, rowsPerPage: t.rowsPerPage }}
                      onPageChange={setLowPage}
                      onLimitChange={(l) => { setLowLimit(l); setLowPage(1); }}
                    />
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="expiring-soon" className="mt-4">
              <ReportTable
                rows={summary.expiringSoon}
                keyExtractor={(r) => r.medicineUuid + r.batchNumber + "-soon"}
                emptyLabel={t.reportNoData}
                columns={[
                  { key: "name", header: t.reportInventoryMedicine, sortValue: (r) => r.medicineName, render: (r) => <span className="uppercase">{r.medicineName}</span> },
                  { key: "batch", header: t.reportInventoryBatch, sortValue: (r) => r.batchNumber, render: (r) => <span className="uppercase">{r.batchNumber}</span> },
                  { key: "expiry", header: t.reportInventoryExpiryDate, sortValue: (r) => r.expiryDate, render: (r) => formatDate(r.expiryDate) },
                  {
                    key: "days",
                    header: t.reportInventoryDaysLeft,
                    sortValue: (r) => r.daysUntilExpiry,
                    render: (r) => (
                      <span className="text-warning font-medium">
                        {r.daysUntilExpiry} {t.reportDays}
                      </span>
                    ),
                  },
                  { key: "qty", header: t.reportInventoryPieces, sortValue: (r) => r.quantityPieces, render: (r) => r.quantityPieces.toLocaleString("id-ID") },
                  { key: "distributor", header: t.reportInventoryDistributor, sortValue: (r) => r.distributorName, render: (r) => <span className="uppercase">{r.distributorName}</span> },
                ]}
              />
            </TabsContent>

            <TabsContent value="expired" className="mt-4">
              <ReportTable
                rows={summary.expired}
                keyExtractor={(r) => r.medicineUuid + r.batchNumber + "-exp"}
                emptyLabel={t.reportNoData}
                columns={[
                  { key: "name", header: t.reportInventoryMedicine, sortValue: (r) => r.medicineName, render: (r) => <span className="uppercase">{r.medicineName}</span> },
                  { key: "batch", header: t.reportInventoryBatch, sortValue: (r) => r.batchNumber, render: (r) => <span className="uppercase">{r.batchNumber}</span> },
                  {
                    key: "expiry",
                    header: t.reportInventoryExpiryDate,
                    sortValue: (r) => r.expiryDate,
                    render: (r) => <span className="text-destructive">{formatDate(r.expiryDate)}</span>,
                  },
                  { key: "qty", header: t.reportInventoryPieces, sortValue: (r) => r.quantityPieces, render: (r) => r.quantityPieces.toLocaleString("id-ID") },
                  { key: "distributor", header: t.reportInventoryDistributor, sortValue: (r) => r.distributorName, render: (r) => <span className="uppercase">{r.distributorName}</span> },
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
