import type { JSX } from "react";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { StatCard } from "@/components/shared/StatCard";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Combobox } from "@/components/ui/combobox";
import { useLanguage } from "@/hooks/useLanguage";
import { getReturnSummary, getReturnList, getReturnExport } from "@/service/reportService";
import { getDistributorsDropdown } from "@/service/distributorService";
import type { ReportFilterMode } from "@/types/report";
import { ReportDateRangeFilter } from "./ReportDateRangeFilter";
import { ReportExportButton } from "./ReportExportButton";
import { ReportSection } from "./ReportSection";
import { ReportTable } from "./ReportTable";
import { buildDateParams, formatDate } from "./reportUtils";
import { exportToCsv, exportToXlsx } from "./reportExport";

type DetailTab = "list" | "by-distributor";

export function ReturnReportTab(): JSX.Element {
  const { t } = useLanguage();

  const [mode, setMode] = useState<ReportFilterMode>("monthly");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [distributorUuid, setDistributorUuid] = useState("all");
  const [activeTab, setActiveTab] = useState<DetailTab>("list");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [isExporting, setIsExporting] = useState(false);

  const dateParams = buildDateParams(mode, dateFrom, dateTo);
  const filterParams = {
    ...dateParams,
    distributorUuid: distributorUuid !== "all" ? distributorUuid : undefined,
  };
  const listParams = { ...filterParams, page, limit };

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["report-returns-summary", filterParams],
    queryFn: () => getReturnSummary(filterParams),
  });

  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: ["report-returns-list", listParams],
    queryFn: () => getReturnList(listParams),
    placeholderData: keepPreviousData,
  });

  const { data: distributorsData } = useQuery({
    queryKey: ["distributors-dropdown"],
    queryFn: getDistributorsDropdown,
  });

  const summary = summaryData?.data;
  const listItems = listData?.data ?? [];
  const listMeta = listData?.meta;

  const distributorOptions = [
    { value: "all", label: `${t.reportReturnFilterDistributor}: ${t.filterAll}` },
    ...(distributorsData?.data ?? []).map((d) => ({ value: d.uuid, label: d.name })),
  ];

  function handleFilterChange(): void {
    setPage(1);
  }

  function handleDistributorChange(uuid: string): void {
    setDistributorUuid(uuid);
    setPage(1);
  }

  async function handleCsv(): Promise<void> {
    if (!summary) return;
    setIsExporting(true);
    try {
      if (activeTab === "list") {
        const resp = await getReturnExport(filterParams);
        const rows = resp.data ?? [];
        exportToCsv("return-list.csv",
          [t.reportReturnNumber, t.reportReturnDate, t.reportReturnDistributor, t.reportReturnMedicine, t.reportReturnBatch, t.reportReturnQty, t.reportReturnReason, t.reportReturnStatus],
          rows.map((r) => [r.returnNumber, r.returnedAt ?? "", r.distributorName, r.medicineName, r.batchNumber, r.quantityPieces, r.reason ?? "", r.status])
        );
      } else {
        exportToCsv("return-by-distributor.csv",
          [t.reportReturnDistributor, t.reportReturnCount, t.reportReturnTotalQty],
          summary.byDistributor.map((r) => [r.distributorName, r.returnCount, r.totalQuantityPieces])
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
      const resp = await getReturnExport(filterParams);
      const rows = resp.data ?? [];
      exportToXlsx("return-report.xlsx", [
        {
          name: t.reportReturnList,
          headers: [t.reportReturnNumber, t.reportReturnDate, t.reportReturnDistributor, t.reportReturnMedicine, t.reportReturnBatch, t.reportReturnQty, t.reportReturnReason, t.reportReturnStatus],
          rows: rows.map((r) => [r.returnNumber, r.returnedAt ?? "", r.distributorName, r.medicineName, r.batchNumber, r.quantityPieces, r.reason ?? "", r.status]),
        },
        {
          name: t.reportReturnByDistributor,
          headers: [t.reportReturnDistributor, t.reportReturnCount, t.reportReturnTotalQty],
          rows: summary.byDistributor.map((r) => [r.distributorName, r.returnCount, r.totalQuantityPieces]),
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
            value={distributorUuid}
            onValueChange={handleDistributorChange}
            options={distributorOptions}
            placeholder={t.reportReturnFilterDistributor}
            className="h-9 w-[14rem] shrink-0 rounded-xl text-sm"
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
              <StatCard label={t.reportReturnTotalReturns} value={String(summary.summary.totalReturns)} />
              <StatCard label={t.reportReturnTotalItems} value={String(summary.summary.totalItems)} />
              <StatCard label={t.reportReturnTotalQty} value={summary.summary.totalQuantityPieces.toLocaleString("id-ID")} />
            </div>
          </ReportSection>

          {/* Detail tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DetailTab)}>
            <TabsList>
              <TabsTrigger value="list">{t.reportReturnList}</TabsTrigger>
              <TabsTrigger value="by-distributor">{t.reportReturnByDistributor}</TabsTrigger>
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
                    keyExtractor={(r) => r.returnUuid}
                    emptyLabel={t.reportNoData}
                    columns={[
                      { key: "number", header: t.reportReturnNumber, sortValue: (r) => r.returnNumber, render: (r) => r.returnNumber },
                      { key: "date", header: t.reportReturnDate, sortValue: (r) => r.returnedAt ?? "", render: (r) => formatDate(r.returnedAt) },
                      { key: "distributor", header: t.reportReturnDistributor, sortValue: (r) => r.distributorName, render: (r) => <span className="uppercase">{r.distributorName}</span> },
                      { key: "medicine", header: t.reportReturnMedicine, sortValue: (r) => r.medicineName, render: (r) => <span className="uppercase">{r.medicineName}</span> },
                      { key: "batch", header: t.reportReturnBatch, sortValue: (r) => r.batchNumber, render: (r) => <span className="uppercase">{r.batchNumber}</span> },
                      { key: "qty", header: t.reportReturnQty, sortValue: (r) => r.quantityPieces, render: (r) => r.quantityPieces.toLocaleString("id-ID") },
                      { key: "reason", header: t.reportReturnReason, sortValue: (r) => r.reason ?? "", render: (r) => r.reason ?? "—" },
                      { key: "status", header: t.reportReturnStatus, sortValue: (r) => r.status, render: (r) => r.status },
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

            <TabsContent value="by-distributor" className="mt-4">
              <ReportTable
                rows={summary.byDistributor}
                keyExtractor={(r) => r.distributorUuid}
                emptyLabel={t.reportNoData}
                columns={[
                  { key: "name", header: t.reportReturnDistributor, sortValue: (r) => r.distributorName, render: (r) => <span className="uppercase">{r.distributorName}</span> },
                  { key: "count", header: t.reportReturnCount, sortValue: (r) => r.returnCount, render: (r) => r.returnCount },
                  { key: "qty", header: t.reportReturnTotalQty, sortValue: (r) => r.totalQuantityPieces, render: (r) => r.totalQuantityPieces.toLocaleString("id-ID") },
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
