import type { JSX } from "react";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { useLanguage } from "@/hooks/useLanguage";
import { useNameFormat } from "@/hooks/useNameFormat";
import { getControlledReport } from "@/service/reportService";
import type { ControlledReport, ControlledReportKind, ControlledReportRow } from "@/types/report";
import { orderLetterKindLabel } from "@/utils/orderLetter";
import { cn } from "@/utils/cn";
import { ReportExportButton } from "./ReportExportButton";
import { ReportSection } from "./ReportSection";
import { ReportTable } from "./ReportTable";
import { exportToCsv, exportToXlsx } from "./reportExport";

const KINDS: ControlledReportKind[] = ["NARCOTIC", "PSYCHOTROPIC", "PRECURSOR", "CERTAIN_DRUG"];

/** yyyy-MM of a date in local time. */
const monthKey = (d: Date): string => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const shiftMonth = (key: string, by: number): string => {
  const [y, m] = key.split("-").map(Number);
  return monthKey(new Date(y, m - 1 + by, 1));
};

const num = (n: number): string => n.toLocaleString("id-ID");

/** Monthly narcotics / psychotropics / precursors / OOT balance in the SIPNAP layout. */
export function ControlledReportTab(): JSX.Element {
  const { t, language } = useLanguage();
  const fmt = useNameFormat();
  const locale = language === "id" ? "id-ID" : "en-GB";
  const thisMonth = monthKey(new Date());
  const [month, setMonth] = useState(thisMonth);
  const [kind, setKind] = useState<ControlledReportKind>("NARCOTIC");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["report-controlled", month, kind],
    queryFn: () => getControlledReport({ month, kind }),
    placeholderData: keepPreviousData,
  });
  const report = data?.data;
  const rows = report?.rows ?? [];

  const [y, m] = month.split("-").map(Number);
  const monthLabel = new Date(y, m - 1, 1).toLocaleDateString(locale, { month: "long", year: "numeric" });
  const totalIn = rows.reduce((s, r) => s + r.inFromDistributor + r.inOther, 0);
  const totalOut = rows.reduce((s, r) => s + r.outSales + r.outOther + r.outDisposal, 0);

  const headers = [
    "No",
    t.reportCtlMedicine,
    t.reportCtlUnit,
    t.reportCtlOpening,
    t.reportCtlInDistributor,
    t.reportCtlInOther,
    t.reportCtlOutSales,
    t.reportCtlOutOther,
    t.reportCtlOutDisposal,
    t.reportCtlClosing,
  ];
  const toCells = (r: ControlledReportRow, i: number): (string | number)[] => [
    i + 1,
    fmt(r.medicineName),
    r.unit,
    r.openingBalance,
    r.inFromDistributor,
    r.inOther,
    r.outSales,
    r.outOther,
    r.outDisposal,
    r.closingBalance,
  ];
  const fileBase = (r: ControlledReport): string => `sipnap-${r.kind.toLowerCase()}-${r.month}`;

  function handleCsv(): void {
    if (!report) return;
    exportToCsv(`${fileBase(report)}.csv`, headers, rows.map(toCells));
  }

  async function handleExcel(): Promise<void> {
    if (!report) return;
    // The sheet opens with the pharmacy block the SIPNAP form asks for.
    const info: (string | number)[][] = [
      [`${t.reportsControlledTab} · ${orderLetterKindLabel(report.kind, t)}`],
      ["Apotek", fmt(report.pharmacy.name)],
      ["Alamat", report.pharmacy.address ?? ""],
      ["Nomor SIA", report.pharmacy.businessLicenseNumber ?? ""],
      ["Apoteker Penanggung Jawab", report.headPharmacist?.name ?? ""],
      ["Nomor SIPA", report.headPharmacist?.practiceLicenseNumber ?? ""],
      ["Periode", monthLabel],
      [],
    ];
    await exportToXlsx(`${fileBase(report)}.xlsx`, [
      { name: orderLetterKindLabel(report.kind, t), headers: info[0].map(String), rows: [...info.slice(1), headers, ...rows.map(toCells)] },
    ]);
  }

  const numCol = "whitespace-nowrap px-3 text-right tabular-nums";

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-9 items-center rounded-xl border border-border bg-background">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-l-xl rounded-r-none"
              aria-label={t.reportCtlPrevMonth}
              onClick={() => setMonth((k) => shiftMonth(k, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[9.5rem] px-2 text-center text-sm font-medium capitalize">{monthLabel}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-l-none rounded-r-xl"
              aria-label={t.reportCtlNextMonth}
              disabled={month >= thisMonth}
              onClick={() => setMonth((k) => shiftMonth(k, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Combobox
            value={kind}
            onValueChange={(v) => setKind(v as ControlledReportKind)}
            options={KINDS.map((k) => ({ value: k, label: orderLetterKindLabel(k, t) }))}
            placeholder={orderLetterKindLabel(kind, t)}
            className="h-9 w-[12rem] shrink-0 rounded-xl text-sm"
          />
          {isFetching && !isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        <ReportExportButton t={t} onCsv={handleCsv} onExcel={handleExcel} disabled={!report || rows.length === 0} />
      </div>

      <p className="max-w-3xl text-sm text-muted-foreground">{t.reportCtlIntro}</p>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !report ? null : (
        <div className={cn("space-y-6 transition-opacity", isFetching && "opacity-70")}>
          <ReportSection title={t.reportSummaryTitle}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <StatCard label={t.reportCtlMedicines} value={num(rows.length)} />
              <StatCard label={t.reportCtlTotalIn} value={num(totalIn)} />
              <StatCard label={t.reportCtlTotalOut} value={num(totalOut)} className="col-span-2 sm:col-span-1" />
            </div>
          </ReportSection>

          <div className="space-y-2">
            <ReportTable
              rows={rows}
              keyExtractor={(r) => r.medicineUuid}
              emptyLabel={t.reportCtlEmpty}
              columns={[
                { key: "no", header: "No", className: "w-10 text-muted-foreground", render: (_r, i) => i + 1 },
                {
                  key: "medicine",
                  header: t.reportCtlMedicine,
                  className: "min-w-[11rem]",
                  sortValue: (r) => r.medicineName,
                  render: (r) => (
                    <div>
                      <span className="name-case font-medium text-foreground">{r.medicineName}</span>
                      <span className="block text-xs text-muted-foreground">
                        {r.shape} · {r.unit}
                      </span>
                    </div>
                  ),
                },
                { key: "open", header: t.reportCtlOpening, className: numCol, sortValue: (r) => r.openingBalance, render: (r) => num(r.openingBalance) },
                { key: "inD", header: t.reportCtlInDistributor, className: numCol, sortValue: (r) => r.inFromDistributor, render: (r) => num(r.inFromDistributor) },
                { key: "inO", header: t.reportCtlInOther, className: numCol, sortValue: (r) => r.inOther, render: (r) => num(r.inOther) },
                { key: "outS", header: t.reportCtlOutSales, className: numCol, sortValue: (r) => r.outSales, render: (r) => num(r.outSales) },
                { key: "outO", header: t.reportCtlOutOther, className: numCol, sortValue: (r) => r.outOther, render: (r) => num(r.outOther) },
                { key: "outD", header: t.reportCtlOutDisposal, className: numCol, sortValue: (r) => r.outDisposal, render: (r) => num(r.outDisposal) },
                {
                  key: "close",
                  header: t.reportCtlClosing,
                  className: numCol,
                  sortValue: (r) => r.closingBalance,
                  render: (r) => <span className="font-semibold text-foreground">{num(r.closingBalance)}</span>,
                },
              ]}
            />
            <p className="text-xs text-muted-foreground">{t.reportCtlFooterNote}</p>
          </div>
        </div>
      )}
    </div>
  );
}
