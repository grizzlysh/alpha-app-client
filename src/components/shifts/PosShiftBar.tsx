import type { JSX } from "react";
import { useState } from "react";
import { ArrowLeftRight, LockKeyhole, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useCurrentShift } from "@/hooks/useCurrentShift";
import { CashMovementModal } from "./CashMovementModal";
import { CloseShiftModal } from "./CloseShiftModal";
import { OpenShiftModal } from "./OpenShiftModal";
import { formatCurrency } from "./shiftUtils";

type ModalState = "open" | "movement" | "close" | null;

const timeOf = (iso: string): string =>
  new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

/**
 * The cashier's shift at the till: a prompt to open one when shifts are on,
 * otherwise the open shift with cash in/out and close. Renders nothing when
 * shifts are turned off.
 */
export function PosShiftBar(): JSX.Element | null {
  const { t } = useLanguage();
  const { data } = useCurrentShift();
  const [modal, setModal] = useState<ModalState>(null);

  if (!data?.settings.enabled) return null;
  const { settings, shift } = data;

  return (
    <>
      {shift ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <span className="h-2 w-2 rounded-full bg-success" aria-hidden />
              {t.shiftTitle} <span className="font-mono text-xs text-muted-foreground">{shift.shiftNumber}</span>
            </span>
            <span className="text-muted-foreground">{t.shiftOpenSince} {timeOf(shift.openedAt)}</span>
            {shift.summary && (
              <span className="text-muted-foreground">
                {t.shiftExpectedCash}: <span className="font-medium tabular-nums text-foreground">{formatCurrency(shift.summary.expectedCash)}</span>
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" className="rounded-lg" onClick={() => setModal("movement")}>
              <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden />
              {t.shiftCashMovement}
            </Button>
            <Button type="button" size="sm" variant="outline" className="rounded-lg" onClick={() => setModal("close")}>
              <LockKeyhole className="h-3.5 w-3.5" aria-hidden />
              {t.shiftClose}
            </Button>
          </div>
        </div>
      ) : (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          <div className="min-w-0">
            <p className="font-semibold text-foreground">{t.shiftNotOpenTitle}</p>
            <p className="text-muted-foreground">{t.shiftNotOpenDesc}</p>
          </div>
          <Button type="button" size="sm" className="rounded-lg" onClick={() => setModal("open")}>
            <Wallet className="h-3.5 w-3.5" aria-hidden />
            {t.shiftOpen}
          </Button>
        </div>
      )}

      {modal === "open" && <OpenShiftModal suggestedCash={settings.openingCash} onClose={() => setModal(null)} />}
      {modal === "movement" && shift && <CashMovementModal shiftUuid={shift.uuid} onClose={() => setModal(null)} />}
      {modal === "close" && shift && (
        <CloseShiftModal shift={shift} tolerance={settings.differenceTolerance} onClose={() => setModal(null)} />
      )}
    </>
  );
}
