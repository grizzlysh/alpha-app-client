import type { JSX } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { EyeOff, Loader2, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLanguage } from "@/hooks/useLanguage";
import { getShift } from "@/service/shiftService";
import { cn } from "@/utils/cn";
import { CloseShiftModal } from "./CloseShiftModal";
import { ShiftSummaryGrid } from "./ShiftSummaryGrid";
import { differenceLabel, differenceTone, formatCurrency, shiftStatusLabel } from "./shiftUtils";

interface ShiftDetailSheetProps {
  shiftUuid: string;
  /** Managers may close a shift a cashier left open. */
  canClose: boolean;
  tolerance: number;
  onClose: () => void;
}

const dateTime = (iso: string): string =>
  new Date(iso).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const time = (iso: string): string => new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

export function ShiftDetailSheet({ shiftUuid, canClose, tolerance, onClose }: ShiftDetailSheetProps): JSX.Element {
  const { t } = useLanguage();
  const [closing, setClosing] = useState(false);
  const { data: shift, isLoading } = useQuery({
    queryKey: ["shift", shiftUuid],
    queryFn: () => getShift(shiftUuid),
    select: (res) => res.data ?? undefined,
  });

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle>{t.shiftDetail}</SheetTitle>
          {shift && (
            <p className="text-sm text-muted-foreground">
              <span className="font-mono">{shift.shiftNumber}</span> · {shift.cashier.name} · {shiftStatusLabel(shift.status, t)}
            </p>
          )}
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {isLoading || !shift ? (
            <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : (
            <>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <Info label={t.shiftOpenedAt} value={dateTime(shift.openedAt)} />
                <Info label={t.shiftClosedAt} value={shift.closedAt ? dateTime(shift.closedAt) : "—"} />
                {shift.closedBy && <Info label={t.shiftClosedBy} value={shift.closedBy.name} />}
                {shift.openingNote && <Info label={t.shiftNote} value={shift.openingNote} />}
              </dl>

              {shift.summary ? (
                <ShiftSummaryGrid t={t} openingCash={shift.openingCash} summary={shift.summary} />
              ) : (
                <p className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5 text-sm text-muted-foreground">
                  <EyeOff className="h-4 w-4" aria-hidden /> {t.shiftHidden}
                </p>
              )}

              {shift.status === "CLOSED" && shift.countedCash !== null && shift.difference !== null && (
                <div className="space-y-1 rounded-xl border border-border px-4 py-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.shiftCountedCash}</span>
                    <span className="tabular-nums text-foreground">{formatCurrency(shift.countedCash)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.shiftDifference}</span>
                    <span className={cn("font-semibold tabular-nums", differenceTone(shift.difference))}>
                      {differenceLabel(shift.difference, t)} {Math.abs(shift.difference) >= 0.005 && formatCurrency(Math.abs(shift.difference))}
                    </span>
                  </div>
                  {shift.closingNote && <p className="pt-1 text-muted-foreground">“{shift.closingNote}”</p>}
                </div>
              )}

              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.shiftMovements}</h3>
                {shift.cashMovements.length === 0 ? (
                  <p className="text-sm text-muted-foreground">—</p>
                ) : (
                  <ul className="divide-y divide-border rounded-xl border border-border text-sm">
                    {shift.cashMovements.map((m) => (
                      <li key={m.uuid} className="flex items-start justify-between gap-3 px-4 py-2">
                        <div className="min-w-0">
                          <p className="text-foreground">{m.note}</p>
                          <p className="text-xs text-muted-foreground">{time(m.createdAt)} · {m.type === "IN" ? t.shiftCashIn : t.shiftCashOut}</p>
                        </div>
                        <span className={cn("whitespace-nowrap tabular-nums", m.type === "IN" ? "text-success" : "text-destructive")}>
                          {m.type === "IN" ? "+" : "−"}{formatCurrency(m.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t.shiftSales} ({shift.sales.length})
                </h3>
                {shift.sales.length === 0 ? (
                  <p className="text-sm text-muted-foreground">—</p>
                ) : (
                  <ul className="divide-y divide-border rounded-xl border border-border text-sm">
                    {shift.sales.map((s) => (
                      <li key={s.uuid} className="flex items-center justify-between gap-3 px-4 py-2">
                        <div className="min-w-0">
                          <p className="font-mono text-xs text-foreground">{s.saleNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {time(s.soldAt)}
                            {s.refundedHere && <span className="ml-1 text-destructive">· {t.shiftRefundedHere}</span>}
                          </p>
                        </div>
                        {shift.summary && <span className="whitespace-nowrap tabular-nums text-foreground">{formatCurrency(s.grandTotal)}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>

        {shift?.status === "OPEN" && canClose && (
          <div className="border-t border-border px-5 py-3">
            <Button type="button" className="w-full rounded-xl" onClick={() => setClosing(true)}>
              <LockKeyhole className="h-4 w-4" aria-hidden /> {t.shiftClose}
            </Button>
          </div>
        )}
        {closing && shift && <CloseShiftModal shift={shift} tolerance={tolerance} onClose={() => setClosing(false)} />}
      </SheetContent>
    </Sheet>
  );
}

function Info({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="truncate text-foreground">{value}</dd>
    </div>
  );
}
