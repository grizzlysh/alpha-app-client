import type { JSX } from "react";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { StatCard } from "@/components/shared/StatCard";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Combobox } from "@/components/ui/combobox";
import { useLanguage } from "@/hooks/useLanguage";
import { getPurchaseSummary, getPurchaseList, getPurchaseExport } from "@/service/reportService";
import { getDistributorsDropdown } from "@/service/distributorService";
import type { ReportFilterMode } from "@/types/report";
import { ReportDateRangeFilter } from "./ReportDateRangeFilter";
import { ReportExportButton } from "./ReportExportButton";
import { ReportSection } from "./ReportSection";
import { ReportTable } from "./ReportTable";
import { buildDateParams, formatCurrency, formatDate } from "./reportUtils";
import { exportToCsv, exportToXlsx } from "./reportExport";

type DetailTab = "invoices" | "by-distributor";

export function PurchaseReportTab(): JSX.Element {
  const { t } = useLanguage();

  const [mode, setMode] = useState<ReportFilterMode>("monthly");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [distributorUuid, setDistributorUuid] = useState("all");
  const [activeTab, setActiveTab] = useState<DetailTab>("invoices");
  const [invoicePage, setInvoicePage] = useState(1);
  const [invoiceLimit, setInvoiceLimit] = useState(25);
  const [isExporting, setIsExporting] = useState(false);

  const dateParams = buildDateParams(mode, dateFrom, dateTo);
  const filterParams = {
    ...dateParams,
    distributorUuid: distributorUuid !== "all" ? distributorUuid : undefined,
  };
  const listParams = { ...filterParams, page: invoicePage, limit: invoiceLimit };

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["report-purchases-summary", filterParams],
    queryFn: () => getPurchaseSummary(filterParams),
  });

  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: ["report-purchases-list", listParams],
    queryFn: () => getPurchaseList(listParams),
    placeholderData: keepPreviousData,
  });

  const { data: distributorsData } = useQuery({
    queryKey: ["distributors-dropdown"],
    queryFn: getDistributorsDropdown,
  });

  const summary = summaryData?.data;
  const invoiceList = listData?.data ?? [];
  const invoiceMeta = listData?.meta;

  const distributorOptions = [
    { value: "all", label: `${t.reportPurchaseFilterDistributor}: ${t.filterAll}` },
    ...(distributorsData?.data ?? []).map((d) => ({ value: d.uuid, label: d.name })),
  ];

  function handleFilterChange(): void {
    setInvoicePage(1);
  }

  function handleDistributorChange(uuid: string): void {
    setDistributorUuid(uuid);
    setInvoicePage(1);
  }

  async function handleCsv(): Promise<void> {
    if (!summary) return;
    setIsExporting(true);
    try {
      if (activeTab === "invoices") {
        const resp = await getPurchaseExport(filterParams);
        const rows = resp.data ?? [];
        exportToCsv("purchase-invoices.csv",
          [t.reportPurchaseInvoiceNumber, t.reportPurchaseDate, t.reportPurchaseDistributor, t.reportPurchasePONumber, t.reportPurchaseTotalAmount, t.reportPurchasePaidAmount, t.reportPurchaseStatus],
          rows.map((r) => [r.invoiceNumber, r.invoiceDate, r.distributorName, r.purchaseOrderNumber ?? "", r.totalAmount, r.paidAmount, r.paymentStatus])
        );
      } else {
        exportToCsv("purchase-by-distributor.csv",
          [t.reportPurchaseDistributor, t.reportPurchaseInvoiceCount, t.reportPurchaseTotalAmount, t.reportPurchasePaidAmount, t.reportPurchaseUnpaidAmount],
          summary.byDistributor.map((r) => [r.distributorName, r.invoiceCount, r.totalAmount, r.paidAmount, r.unpaidAmount])
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
      const resp = await getPurchaseExport(filterParams);
      const rows = resp.data ?? [];
      exportToXlsx("purchase-report.xlsx", [
        {
          name: t.reportPurchaseInvoiceList,
          headers: [t.reportPurchaseInvoiceNumber, t.reportPurchaseDate, t.reportPurchaseDistributor, t.reportPurchasePONumber, t.reportPurchaseTotalAmount, t.reportPurchasePaidAmount, t.reportPurchaseStatus],
          rows: rows.map((r) => [r.invoiceNumber, r.invoiceDate, r.distributorName, r.purchaseOrderNumber ?? "", r.totalAmount, r.paidAmount, r.paymentStatus]),
        },
        {
          name: t.reportPurchaseByDistributor,
          headers: [t.reportPurchaseDistributor, t.reportPurchaseInvoiceCount, t.reportPurchaseTotalAmount, t.reportPurchasePaidAmount, t.reportPurchaseUnpaidAmount],
          rows: summary.byDistributor.map((r) => [r.distributorName, r.invoiceCount, r.totalAmount, r.paidAmount, r.unpaidAmount]),
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
            placeholder={t.reportPurchaseFilterDistributor}
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label={t.reportPurchaseTotalInvoices} value={String(summary.summary.totalInvoices)} />
              <StatCard label={t.reportPurchaseTotalAmount} value={formatCurrency(summary.summary.totalAmount)} />
              <StatCard label={t.reportPurchasePaidAmount} value={formatCurrency(summary.summary.paidAmount)} />
              <StatCard label={t.reportPurchaseUnpaidAmount} value={formatCurrency(summary.summary.unpaidAmount)} />
            </div>
          </ReportSection>

          {/* Detail tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DetailTab)}>
            <TabsList>
              <TabsTrigger value="invoices">{t.reportPurchaseInvoiceList}</TabsTrigger>
              <TabsTrigger value="by-distributor">{t.reportPurchaseByDistributor}</TabsTrigger>
            </TabsList>

            <TabsContent value="invoices" className="mt-4">
              {listLoading && invoiceList.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <ReportTable
                    rows={invoiceList}
                    keyExtractor={(r) => r.invoiceUuid}
                    emptyLabel={t.reportNoData}
                    columns={[
                      { key: "number", header: t.reportPurchaseInvoiceNumber, sortValue: (r) => r.invoiceNumber, render: (r) => <span className="uppercase">{r.invoiceNumber}</span> },
                      { key: "date", header: t.reportPurchaseDate, sortValue: (r) => r.invoiceDate, render: (r) => formatDate(r.invoiceDate) },
                      { key: "distributor", header: t.reportPurchaseDistributor, sortValue: (r) => r.distributorName, render: (r) => <span className="uppercase">{r.distributorName}</span> },
                      { key: "po", header: t.reportPurchasePONumber, sortValue: (r) => r.purchaseOrderNumber ?? "", render: (r) => r.purchaseOrderNumber ?? "—" },
                      { key: "total", header: t.reportPurchaseTotalAmount, sortValue: (r) => r.totalAmount, render: (r) => formatCurrency(r.totalAmount) },
                      { key: "paid", header: t.reportPurchasePaidAmount, sortValue: (r) => r.paidAmount, render: (r) => formatCurrency(r.paidAmount) },
                      { key: "status", header: t.reportPurchaseStatus, sortValue: (r) => r.paymentStatus, render: (r) => r.paymentStatus },
                    ]}
                  />
                  {invoiceMeta && (
                    <TablePaginationFooter
                      page={invoiceMeta.page}
                      limit={invoiceMeta.limit}
                      total={invoiceMeta.total}
                      totalPages={invoiceMeta.totalPages}
                      labels={{ showing: t.showing, of: t.of, rowsPerPage: t.rowsPerPage }}
                      onPageChange={setInvoicePage}
                      onLimitChange={(l) => { setInvoiceLimit(l); setInvoicePage(1); }}
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
                  { key: "name", header: t.reportPurchaseDistributor, sortValue: (r) => r.distributorName, render: (r) => <span className="uppercase">{r.distributorName}</span> },
                  { key: "count", header: t.reportPurchaseInvoiceCount, sortValue: (r) => r.invoiceCount, render: (r) => r.invoiceCount },
                  { key: "total", header: t.reportPurchaseTotalAmount, sortValue: (r) => r.totalAmount, render: (r) => formatCurrency(r.totalAmount) },
                  { key: "paid", header: t.reportPurchasePaidAmount, sortValue: (r) => r.paidAmount, render: (r) => formatCurrency(r.paidAmount) },
                  { key: "unpaid", header: t.reportPurchaseUnpaidAmount, sortValue: (r) => r.unpaidAmount, render: (r) => formatCurrency(r.unpaidAmount) },
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
