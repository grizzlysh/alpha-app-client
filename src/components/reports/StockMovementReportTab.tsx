import type { JSX } from "react";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { StatCard } from "@/components/shared/StatCard";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Combobox } from "@/components/ui/combobox";
import { useLanguage } from "@/hooks/useLanguage";
import { getStockMovementSummary, getStockMovementList, getStockMovementExport } from "@/service/reportService";
import type { ReportFilterMode } from "@/types/report";
import { ReportDateRangeFilter } from "./ReportDateRangeFilter";
import { ReportExportButton } from "./ReportExportButton";
import { ReportSection } from "./ReportSection";
import { ReportTable } from "./ReportTable";
import { buildDateParams, formatDate } from "./reportUtils";
import { exportToCsv, exportToXlsx } from "./reportExport";

type TypeFilter = "IN" | "OUT" | "all";
type ReasonFilter = "PURCHASE" | "SALE" | "RETURN" | "ADJUSTMENT" | "DISPOSAL" | "DAMAGED" | "TRANSFER" | "DONATION" | "all";

export function StockMovementReportTab(): JSX.Element {
  const { t } = useLanguage();

  const [mode, setMode] = useState<ReportFilterMode>("monthly");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterType, setFilterType] = useState<TypeFilter>("all");
  const [filterReason, setFilterReason] = useState<ReasonFilter>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [isExporting, setIsExporting] = useState(false);

  const dateParams = buildDateParams(mode, dateFrom, dateTo);
  const filterParams = {
    ...dateParams,
    type: filterType !== "all" ? filterType : undefined,
    reason: filterReason !== "all" ? filterReason : undefined,
  };
  const listParams = { ...filterParams, page, limit };

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["report-stock-movements-summary", filterParams],
    queryFn: () => getStockMovementSummary(filterParams),
  });

  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: ["report-stock-movements-list", listParams],
    queryFn: () => getStockMovementList(listParams),
    placeholderData: keepPreviousData,
  });

  const summary = summaryData?.data;
  const listItems = listData?.data ?? [];
  const listMeta = listData?.meta;

  function handleFilterChange(): void {
    setPage(1);
  }

  async function handleCsv(): Promise<void> {
    if (!summary) return;
    setIsExporting(true);
    try {
      const resp = await getStockMovementExport(filterParams);
      const rows = resp.data ?? [];
      exportToCsv("stock-movement-list.csv",
        [t.reportSMDate, t.reportSMMedicine, t.reportSMBatch, t.reportSMType, t.reportSMReason, t.reportSMQty, t.reportSMBefore, t.reportSMAfter, t.reportSMReference],
        rows.map((r) => [r.createdAt, r.medicineName, r.batchNumber, r.type, r.reason, r.quantity, r.quantityBefore, r.quantityAfter, r.referenceNumber ?? ""])
      );
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExcel(): Promise<void> {
    if (!summary) return;
    setIsExporting(true);
    try {
      const resp = await getStockMovementExport(filterParams);
      const rows = resp.data ?? [];
      exportToXlsx("stock-movement-report.xlsx", [
        {
          name: t.reportSMMovementList,
          headers: [t.reportSMDate, t.reportSMMedicine, t.reportSMBatch, t.reportSMType, t.reportSMReason, t.reportSMQty, t.reportSMBefore, t.reportSMAfter, t.reportSMReference],
          rows: rows.map((r) => [r.createdAt, r.medicineName, r.batchNumber, r.type, r.reason, r.quantity, r.quantityBefore, r.quantityAfter, r.referenceNumber ?? ""]),
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
        <div className="flex flex-wrap items-center gap-2">
          <ReportDateRangeFilter
            mode={mode} dateFrom={dateFrom} dateTo={dateTo} t={t}
            onModeChange={(m) => { setMode(m); handleFilterChange(); }}
            onDateFromChange={(d) => { setDateFrom(d); handleFilterChange(); }}
            onDateToChange={(d) => { setDateTo(d); handleFilterChange(); }}
          />
          <Combobox
            value={filterType}
            onValueChange={(v) => { setFilterType(v as TypeFilter); handleFilterChange(); }}
            options={[
              { value: "all", label: `${t.reportSMFilterType}: ${t.filterAll}` },
              { value: "IN", label: t.smTypeIn },
              { value: "OUT", label: t.smTypeOut },
            ]}
            placeholder={t.reportSMFilterType}
            className="h-9 w-[11rem] shrink-0 rounded-xl text-sm"
          />
          <Combobox
            value={filterReason}
            onValueChange={(v) => { setFilterReason(v as ReasonFilter); handleFilterChange(); }}
            options={[
              { value: "all", label: `${t.reportSMFilterReason}: ${t.filterAll}` },
              { value: "PURCHASE", label: t.smReasonPurchase },
              { value: "SALE", label: t.smReasonSale },
              { value: "RETURN", label: t.smReasonReturn },
              { value: "ADJUSTMENT", label: t.smReasonAdjustment },
              { value: "DISPOSAL", label: t.smReasonDisposal },
              { value: "DAMAGED", label: t.smReasonDamaged },
              { value: "TRANSFER", label: t.smReasonTransfer },
              { value: "DONATION", label: t.smReasonDonation },
            ]}
            placeholder={t.reportSMFilterReason}
            className="h-9 w-[13rem] shrink-0 rounded-xl text-sm"
          />
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
            <div className="grid grid-cols-3 gap-4">
              <StatCard label={t.reportSMTotalMovements} value={String(summary.totalMovements)} />
              <StatCard label={t.reportSMTotalIn} value={summary.totalInQty.toLocaleString("id-ID")} />
              <StatCard label={t.reportSMTotalOut} value={summary.totalOutQty.toLocaleString("id-ID")} />
            </div>
          </ReportSection>

          {/* Detail tabs */}
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">{t.reportSMMovementList}</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-4">
              {listLoading && listItems.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <ReportTable
                    rows={listItems}
                    keyExtractor={(r) => r.movementUuid}
                    emptyLabel={t.reportNoData}
                    columns={[
                      { key: "date", header: t.reportSMDate, sortValue: (r) => r.createdAt, render: (r) => formatDate(r.createdAt) },
                      { key: "medicine", header: t.reportSMMedicine, sortValue: (r) => r.medicineName, render: (r) => <span className="uppercase">{r.medicineName}</span> },
                      { key: "batch", header: t.reportSMBatch, sortValue: (r) => r.batchNumber, render: (r) => <span className="uppercase">{r.batchNumber}</span> },
                      {
                        key: "type",
                        header: t.reportSMType,
                        sortValue: (r) => r.type,
                        render: (r) =>
                          r.type === "IN" ? (
                            <span className="text-success font-medium">{t.smTypeIn}</span>
                          ) : (
                            <span className="text-destructive font-medium">{t.smTypeOut}</span>
                          ),
                      },
                      { key: "reason", header: t.reportSMReason, sortValue: (r) => r.reason, render: (r) => r.reason },
                      { key: "qty", header: t.reportSMQty, sortValue: (r) => r.quantity, render: (r) => r.quantity.toLocaleString("id-ID") },
                      { key: "before", header: t.reportSMBefore, sortValue: (r) => r.quantityBefore, render: (r) => r.quantityBefore.toLocaleString("id-ID") },
                      { key: "after", header: t.reportSMAfter, sortValue: (r) => r.quantityAfter, render: (r) => r.quantityAfter.toLocaleString("id-ID") },
                      { key: "ref", header: t.reportSMReference, sortValue: (r) => r.referenceNumber ?? "", render: (r) => r.referenceNumber ?? "—" },
                    ]}
                  />
                  {listMeta && (
                    <TablePaginationFooter
                      page={listMeta.page}
                      limit={listMeta.limit}
                      total={listMeta.total}
                      totalPages={listMeta.totalPages}
                      labels={{ showing: t.showing, of: t.of, rowsPerPage: t.rowsPerPage }}
                      onPageChange={setPage}
                      onLimitChange={(l) => { setLimit(l); setPage(1); }}
                    />
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
