import type { JSX } from "react";
import { Wallet } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import { TableEmptyState } from "@/components/shared/TableEmptyState";
import { TableLoadingSkeleton } from "@/components/shared/TableLoadingSkeleton";
import { TablePaginationFooter } from "@/components/shared/TablePaginationFooter";
import type { Shift } from "@/types/shift";
import { cn } from "@/utils/cn";
import { differenceTone, formatCurrency, shiftStatusLabel } from "./shiftUtils";

interface ShiftTableProps {
  t: Translations;
  shifts: Shift[];
  isLoading: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onOpen: (shift: Shift) => void;
}

const dateTime = (iso: string | null): string =>
  iso ? new Date(iso).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

const TH = "whitespace-nowrap bg-muted px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground";

export function ShiftTable({ t, shifts, isLoading, onOpen, ...pagination }: ShiftTableProps): JSX.Element {
  if (isLoading) return <TableLoadingSkeleton />;
  if (shifts.length === 0) {
    return (
      <TableEmptyState
        isSearch={false}
        icon={<Wallet className="h-8 w-8 text-muted-foreground/40" />}
        title={t.shiftNone}
        description={t.shiftNoneDesc}
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className={TH}>{t.shiftNumber}</th>
              <th className={TH}>{t.shiftCashier}</th>
              <th className={cn(TH, "hidden md:table-cell")}>{t.shiftOpenedAt}</th>
              <th className={cn(TH, "hidden lg:table-cell")}>{t.shiftClosedAt}</th>
              <th className={cn(TH, "hidden sm:table-cell text-right")}>{t.shiftExpectedCash}</th>
              <th className={cn(TH, "text-right")}>{t.shiftDifference}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {shifts.map((s) => (
              <tr
                key={s.uuid}
                tabIndex={0}
                onClick={() => onOpen(s)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(s)}
                className="cursor-pointer transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none"
                aria-label={`${t.shiftView} ${s.shiftNumber}`}
              >
                <td className="px-5 py-3">
                  <p className="font-mono text-xs text-foreground">{s.shiftNumber}</p>
                  <span
                    className={cn(
                      "mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                      s.status === "OPEN" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {shiftStatusLabel(s.status, t)}
                  </span>
                </td>
                <td className="px-5 py-3 text-foreground">{s.cashier.name}</td>
                <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">{dateTime(s.openedAt)}</td>
                <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">{dateTime(s.closedAt)}</td>
                <td className="hidden px-5 py-3 text-right tabular-nums text-foreground sm:table-cell">
                  {s.summary ? formatCurrency(s.summary.expectedCash) : "—"}
                </td>
                <td className={cn("px-5 py-3 text-right font-medium tabular-nums", s.difference !== null ? differenceTone(s.difference) : "text-muted-foreground")}>
                  {s.difference === null ? "—" : `${s.difference > 0 ? "+" : s.difference < 0 ? "−" : ""}${formatCurrency(Math.abs(s.difference))}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePaginationFooter {...pagination} labels={t} />
    </>
  );
}
