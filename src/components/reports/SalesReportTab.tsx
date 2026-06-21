import type { JSX } from "react";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { StatCard } from "@/components/shared/StatCard";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { getSalesSummary, getSalesList, getSalesExport } from "@/service/reportService";
import type { ReportFilterMode } from "@/types/report";
import { ReportDateRangeFilter } from "./ReportDateRangeFilter";
import { ReportExportButton } from "./ReportExportButton";
import { ReportSection } from "./ReportSection";
import { ReportTable } from "./ReportTable";
import { buildDateParams, formatCurrency, formatDate } from "./reportUtils";
import { exportToCsv, exportToXlsx } from "./reportExport";

type DetailTab = "transactions" | "daily" | "top-medicines" | "payment";

export function SalesReportTab(): JSX.Element {
  const { t } = useLanguage();

  const [mode, setMode] = useState<ReportFilterMode>("monthly");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeTab, setActiveTab] = useState<DetailTab>("transactions");
  const [txPage, setTxPage] = useState(1);
  const [txLimit, setTxLimit] = useState(25);
  const [isExporting, setIsExporting] = useState(false);

  const dateParams = buildDateParams(mode, dateFrom, dateTo);
  const listParams = { ...dateParams, page: txPage, limit: txLimit };

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["report-sales-summary", dateParams],
    queryFn: () => getSalesSummary(dateParams),
  });

  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: ["report-sales-list", listParams],
    queryFn: () => getSalesList(listParams),
    placeholderData: keepPreviousData,
  });

  const summary = summaryData?.data;
  const listItems = listData?.data ?? [];
  const listMeta = listData?.meta;

  function handleModeChange(m: ReportFilterMode): void {
    setMode(m);
    setTxPage(1);
  }

  function handleDateFromChange(d: string): void {
    setDateFrom(d);
    setTxPage(1);
  }

  function handleDateToChange(d: string): void {
    setDateTo(d);
    setTxPage(1);
  }

  async function handleCsv(): Promise<void> {
    if (!summary) return;
    setIsExporting(true);
    try {
      if (activeTab === "transactions") {
        const resp = await getSalesExport(dateParams);
        const rows = resp.data ?? [];
        exportToCsv("sales-transactions.csv",
          [t.reportSalesSaleNumber, t.reportSalesDate, t.reportSalesCustomer, t.reportSalesSaleType, t.reportSalesStatus, t.reportSalesTotalAmount, t.reportSalesDiscountPct, t.reportSalesDiscountAmt, t.reportSalesPPN, t.reportSalesGrandTotal, t.reportSalesPaidAmount, t.reportSalesPaymentStatus],
          rows.map((r) => [r.saleNumber, r.soldAt, r.customerName, r.saleType, r.status, r.totalAmount, r.discountPercentage, r.discountAmount, r.ppnAmount, r.grandTotal, r.paidAmount, r.paymentStatus])
        );
      } else if (activeTab === "daily") {
        exportToCsv("sales-daily.csv",
          [t.reportSalesDate, t.reportSalesTransactions, t.reportSalesRevenue],
          summary.dailyRevenue.map((r) => [r.date, r.count, r.revenue])
        );
      } else if (activeTab === "top-medicines") {
        exportToCsv("sales-top-medicines.csv",
          [t.reportSalesMedicine, t.reportSalesQtyPieces, t.reportSalesRevenue],
          summary.topMedicines.map((r) => [r.medicineName, r.totalQuantityPieces, r.totalRevenue])
        );
      } else {
        exportToCsv("sales-payment.csv",
          [t.reportSalesMethod, t.reportSalesTransactions, t.reportSalesRevenue],
          summary.summary.paymentBreakdown.map((r) => [r.method, r.count, r.amount])
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
      const resp = await getSalesExport(dateParams);
      const txRows = resp.data ?? [];
      exportToXlsx("sales-report.xlsx", [
        {
          name: t.reportSalesTransactions,
          headers: [t.reportSalesSaleNumber, t.reportSalesDate, t.reportSalesCustomer, t.reportSalesSaleType, t.reportSalesStatus, t.reportSalesTotalAmount, t.reportSalesDiscountPct, t.reportSalesDiscountAmt, t.reportSalesPPN, t.reportSalesGrandTotal, t.reportSalesPaidAmount, t.reportSalesPaymentStatus],
          rows: txRows.map((r) => [r.saleNumber, r.soldAt, r.customerName, r.saleType, r.status, r.totalAmount, r.discountPercentage, r.discountAmount, r.ppnAmount, r.grandTotal, r.paidAmount, r.paymentStatus]),
        },
        {
          name: t.reportSalesDailyRevenue,
          headers: [t.reportSalesDate, t.reportSalesTransactions, t.reportSalesRevenue],
          rows: summary.dailyRevenue.map((r) => [r.date, r.count, r.revenue]),
        },
        {
          name: t.reportSalesTopMedicines,
          headers: [t.reportSalesMedicine, t.reportSalesQtyPieces, t.reportSalesRevenue],
          rows: summary.topMedicines.map((r) => [r.medicineName, r.totalQuantityPieces, r.totalRevenue]),
        },
        {
          name: t.reportSalesPaymentBreakdown,
          headers: [t.reportSalesMethod, t.reportSalesTransactions, t.reportSalesRevenue],
          rows: summary.summary.paymentBreakdown.map((r) => [r.method, r.count, r.amount]),
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
          onModeChange={handleModeChange}
          onDateFromChange={handleDateFromChange}
          onDateToChange={handleDateToChange}
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <StatCard label={t.reportSalesTotalRevenue} value={formatCurrency(summary.summary.totalRevenue)} />
              <StatCard label={t.reportSalesTotalSales} value={String(summary.summary.totalSales)} />
              <StatCard label={t.reportSalesAvgOrder} value={formatCurrency(summary.summary.averageOrderValue)} />
            </div>
          </ReportSection>

          {/* Detail tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DetailTab)}>
            <TabsList>
              <TabsTrigger value="transactions">{t.reportSalesTransactions}</TabsTrigger>
              <TabsTrigger value="daily">{t.reportSalesDailyRevenue}</TabsTrigger>
              <TabsTrigger value="top-medicines">{t.reportSalesTopMedicines}</TabsTrigger>
              <TabsTrigger value="payment">{t.reportSalesPaymentBreakdown}</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="mt-4">
              {listLoading && listItems.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <ReportTable
                    rows={listItems}
                    keyExtractor={(r) => r.saleNumber}
                    emptyLabel={t.reportNoData}
                    columns={[
                      { key: "saleNo", header: t.reportSalesSaleNumber, sortValue: (r) => r.saleNumber, render: (r) => r.saleNumber },
                      { key: "date", header: t.reportSalesDate, sortValue: (r) => r.soldAt, render: (r) => r.soldAt },
                      { key: "customer", header: t.reportSalesCustomer, sortValue: (r) => r.customerName, render: (r) => <span className="uppercase">{r.customerName}</span> },
                      { key: "type", header: t.reportSalesSaleType, sortValue: (r) => r.saleType, render: (r) => r.saleType },
                      { key: "status", header: t.reportSalesStatus, sortValue: (r) => r.status, render: (r) => r.status },
                      { key: "total", header: t.reportSalesTotalAmount, sortValue: (r) => r.totalAmount, render: (r) => formatCurrency(r.totalAmount) },
                      { key: "discPct", header: t.reportSalesDiscountPct, sortValue: (r) => r.discountPercentage, render: (r) => `${r.discountPercentage}%` },
                      { key: "discAmt", header: t.reportSalesDiscountAmt, sortValue: (r) => r.discountAmount, render: (r) => formatCurrency(r.discountAmount) },
                      { key: "ppn", header: t.reportSalesPPN, sortValue: (r) => r.ppnAmount, render: (r) => formatCurrency(r.ppnAmount) },
                      { key: "grand", header: t.reportSalesGrandTotal, sortValue: (r) => r.grandTotal, render: (r) => formatCurrency(r.grandTotal) },
                      { key: "paid", header: t.reportSalesPaidAmount, sortValue: (r) => r.paidAmount, render: (r) => formatCurrency(r.paidAmount) },
                      { key: "payStatus", header: t.reportSalesPaymentStatus, sortValue: (r) => r.paymentStatus, render: (r) => r.paymentStatus },
                    ]}
                  />
                  {listMeta && (
                    <TablePaginationFooter
                      page={listMeta.page}
                      limit={listMeta.limit}
                      total={listMeta.total}
                      totalPages={listMeta.totalPages}
                      labels={{ showing: t.showing, of: t.of, rowsPerPage: t.rowsPerPage }}
                      onPageChange={setTxPage}
                      onLimitChange={(l) => { setTxLimit(l); setTxPage(1); }}
                    />
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="daily" className="mt-4">
              <ReportTable
                rows={summary.dailyRevenue}
                keyExtractor={(r) => r.date}
                emptyLabel={t.reportNoData}
                columns={[
                  { key: "date", header: t.reportSalesDate, sortValue: (r) => r.date, render: (r) => formatDate(r.date) },
                  { key: "count", header: t.reportSalesTransactions, sortValue: (r) => r.count, render: (r) => r.count },
                  { key: "revenue", header: t.reportSalesRevenue, sortValue: (r) => r.revenue, render: (r) => formatCurrency(r.revenue) },
                ]}
              />
            </TabsContent>

            <TabsContent value="top-medicines" className="mt-4">
              <ReportTable
                rows={summary.topMedicines}
                keyExtractor={(r) => r.medicineUuid}
                emptyLabel={t.reportNoData}
                columns={[
                  { key: "no", header: "#", className: "w-10", render: (_, i) => i + 1 },
                  { key: "name", header: t.reportSalesMedicine, sortValue: (r) => r.medicineName, render: (r) => <span className="uppercase">{r.medicineName}</span> },
                  { key: "qty", header: t.reportSalesQtyPieces, sortValue: (r) => r.totalQuantityPieces, render: (r) => r.totalQuantityPieces.toLocaleString("id-ID") },
                  { key: "revenue", header: t.reportSalesRevenue, sortValue: (r) => r.totalRevenue, render: (r) => formatCurrency(r.totalRevenue) },
                ]}
              />
            </TabsContent>

            <TabsContent value="payment" className="mt-4">
              <ReportTable
                rows={summary.summary.paymentBreakdown}
                keyExtractor={(r) => r.method}
                emptyLabel={t.reportNoData}
                columns={[
                  { key: "method", header: t.reportSalesMethod, sortValue: (r) => r.method, render: (r) => r.method },
                  { key: "count", header: t.reportSalesTransactions, sortValue: (r) => r.count, render: (r) => r.count },
                  { key: "amount", header: t.reportSalesRevenue, sortValue: (r) => r.amount, render: (r) => formatCurrency(r.amount) },
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
