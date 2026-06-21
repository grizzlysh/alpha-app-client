import type { JSX } from "react";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { StatCard } from "@/components/shared/StatCard";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { getDisposalSummary, getDisposalList, getDisposalExport } from "@/service/reportService";
import type { ReportFilterMode } from "@/types/report";
import { ReportDateRangeFilter } from "./ReportDateRangeFilter";
import { ReportExportButton } from "./ReportExportButton";
import { ReportSection } from "./ReportSection";
import { ReportTable } from "./ReportTable";
import { buildDateParams, formatDate } from "./reportUtils";
import { exportToCsv, exportToXlsx } from "./reportExport";

type DetailTab = "list" | "by-reason";

export function DisposalReportTab(): JSX.Element {
  const { t } = useLanguage();

  const [mode, setMode] = useState<ReportFilterMode>("monthly");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeTab, setActiveTab] = useState<DetailTab>("list");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [isExporting, setIsExporting] = useState(false);

  const dateParams = buildDateParams(mode, dateFrom, dateTo);
  const listParams = { ...dateParams, page, limit };

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["report-disposals-summary", dateParams],
    queryFn: () => getDisposalSummary(dateParams),
  });

  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: ["report-disposals-list", listParams],
    queryFn: () => getDisposalList(listParams),
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
      if (activeTab === "list") {
        const resp = await getDisposalExport(dateParams);
        const rows = resp.data ?? [];
        exportToCsv("disposal-list.csv",
          [t.reportDisposalNumber, t.reportDisposalDate, t.reportDisposalMedicine, t.reportDisposalBatch, t.reportDisposalQty, t.reportDisposalReason, t.reportDisposalStatus],
          rows.map((r) => [r.disposalNumber, r.disposedAt ?? "", r.medicineName, r.batchNumber, r.quantityPieces, r.reason, r.status])
        );
      } else {
        exportToCsv("disposal-by-reason.csv",
          [t.reportDisposalReason, t.reportDisposalCount, t.reportDisposalTotalQty],
          summary.byReason.map((r) => [r.reason, r.count, r.totalQuantityPieces])
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
      const resp = await getDisposalExport(dateParams);
      const rows = resp.data ?? [];
      exportToXlsx("disposal-report.xlsx", [
        {
          name: t.reportDisposalList,
          headers: [t.reportDisposalNumber, t.reportDisposalDate, t.reportDisposalMedicine, t.reportDisposalBatch, t.reportDisposalQty, t.reportDisposalReason, t.reportDisposalStatus],
          rows: rows.map((r) => [r.disposalNumber, r.disposedAt ?? "", r.medicineName, r.batchNumber, r.quantityPieces, r.reason, r.status]),
        },
        {
          name: t.reportDisposalByReason,
          headers: [t.reportDisposalReason, t.reportDisposalCount, t.reportDisposalTotalQty],
          rows: summary.byReason.map((r) => [r.reason, r.count, r.totalQuantityPieces]),
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
        <ReportDateRangeFilter
          mode={mode} dateFrom={dateFrom} dateTo={dateTo} t={t}
          onModeChange={(m) => { setMode(m); handleFilterChange(); }}
          onDateFromChange={(d) => { setDateFrom(d); handleFilterChange(); }}
          onDateToChange={(d) => { setDateTo(d); handleFilterChange(); }}
        />
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
              <StatCard label={t.reportDisposalTotalDisposals} value={String(summary.summary.totalDisposals)} />
              <StatCard label={t.reportDisposalTotalItems} value={String(summary.summary.totalItems)} />
              <StatCard label={t.reportDisposalTotalQty} value={summary.summary.totalQuantityPieces.toLocaleString("id-ID")} />
            </div>
          </ReportSection>

          {/* Detail tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DetailTab)}>
            <TabsList>
              <TabsTrigger value="list">{t.reportDisposalList}</TabsTrigger>
              <TabsTrigger value="by-reason">{t.reportDisposalByReason}</TabsTrigger>
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
                    keyExtractor={(r) => r.disposalUuid}
                    emptyLabel={t.reportNoData}
                    columns={[
                      { key: "number", header: t.reportDisposalNumber, sortValue: (r) => r.disposalNumber, render: (r) => r.disposalNumber },
                      { key: "date", header: t.reportDisposalDate, sortValue: (r) => r.disposedAt ?? "", render: (r) => formatDate(r.disposedAt) },
                      { key: "medicine", header: t.reportDisposalMedicine, sortValue: (r) => r.medicineName, render: (r) => <span className="uppercase">{r.medicineName}</span> },
                      { key: "batch", header: t.reportDisposalBatch, sortValue: (r) => r.batchNumber, render: (r) => <span className="uppercase">{r.batchNumber}</span> },
                      { key: "qty", header: t.reportDisposalQty, sortValue: (r) => r.quantityPieces, render: (r) => r.quantityPieces.toLocaleString("id-ID") },
                      { key: "reason", header: t.reportDisposalReason, sortValue: (r) => r.reason, render: (r) => r.reason },
                      { key: "status", header: t.reportDisposalStatus, sortValue: (r) => r.status, render: (r) => r.status },
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

            <TabsContent value="by-reason" className="mt-4">
              <ReportTable
                rows={summary.byReason}
                keyExtractor={(r) => r.reason}
                emptyLabel={t.reportNoData}
                columns={[
                  { key: "reason", header: t.reportDisposalReason, sortValue: (r) => r.reason, render: (r) => r.reason },
                  { key: "count", header: t.reportDisposalCount, sortValue: (r) => r.count, render: (r) => r.count },
                  { key: "qty", header: t.reportDisposalTotalQty, sortValue: (r) => r.totalQuantityPieces, render: (r) => r.totalQuantityPieces.toLocaleString("id-ID") },
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
