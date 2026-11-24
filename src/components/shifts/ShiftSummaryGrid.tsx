import type { JSX } from "react";

import type { Translations } from "@/configs/i18n";
import type { ShiftSummary } from "@/types/shift";
import { cn } from "@/utils/cn";
import { formatCurrency } from "./shiftUtils";

interface ShiftSummaryGridProps {
  t: Translations;
  openingCash: number;
  summary: ShiftSummary;
  className?: string;
}

/** Opening cash and everything that moved the drawer, ending in the expected cash. */
export function ShiftSummaryGrid({ t, openingCash, summary, className }: ShiftSummaryGridProps): JSX.Element {
  const rows: { label: string; value: number; sign?: "+" | "−"; muted?: boolean }[] = [
    { label: t.shiftOpeningCash, value: openingCash },
    { label: t.shiftCashSales, value: summary.cashSales, sign: "+" },
    { label: t.shiftCashIn, value: summary.cashIn, sign: "+" },
    { label: t.shiftCashRefunds, value: summary.cashRefunds, sign: "−" },
    { label: t.shiftCashOut, value: summary.cashOut, sign: "−" },
  ];
  return (
    <div className={cn("rounded-xl border border-border bg-muted/30 text-sm", className)}>
      <dl className="divide-y divide-border">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-4 py-2">
            <dt className="text-muted-foreground">{r.label}</dt>
            <dd className="tabular-nums text-foreground">
              {r.sign && <span className="mr-1 text-muted-foreground">{r.sign}</span>}
              {formatCurrency(r.value)}
            </dd>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-2.5">
          <dt className="font-semibold text-foreground">{t.shiftExpectedCash}</dt>
          <dd className="font-semibold tabular-nums text-foreground">{formatCurrency(summary.expectedCash)}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap justify-between gap-2 border-t border-border px-4 py-2 text-xs text-muted-foreground">
        <span>{t.shiftSaleCount}: <span className="font-medium text-foreground">{summary.saleCount}</span></span>
        <span>{t.shiftNonCashSales}: <span className="font-medium tabular-nums text-foreground">{formatCurrency(summary.nonCashSales)}</span></span>
      </div>
    </div>
  );
}
