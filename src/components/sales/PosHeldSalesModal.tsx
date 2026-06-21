import type { JSX } from "react";
import { useState } from "react";
import { AlertTriangle, Ban, Clock, Loader2, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Translations } from "@/configs/i18n";
import type { Sale } from "@/types/sale";
import { getSales } from "@/service/saleService";
import { formatCurrency } from "./salesUtils";

export interface PosHeldSalesModalProps {
  t: Translations;
  open: boolean;
  cartHasItems: boolean;
  cancellingUuid: string | null;
  onContinue: (sale: Sale) => void;
  onCancelHeld: (sale: Sale) => void;
  onClose: () => void;
}

export function PosHeldSalesModal({
  t,
  open,
  cartHasItems,
  cancellingUuid,
  onContinue,
  onCancelHeld,
  onClose,
}: PosHeldSalesModalProps): JSX.Element {
  const [confirmSale, setConfirmSale] = useState<Sale | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["sales", { status: "PENDING" }],
    queryFn: () => getSales({ status: "PENDING", sortBy: "soldAt", sortOrder: "desc" }),
    enabled: open,
    staleTime: 0,
  });

  const sales = data?.data ?? [];

  return (
    <>
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {t.posHeldSalesTitle}
          </DialogTitle>
        </DialogHeader>

        {cartHasItems && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {t.posHeldSalesClearWarning}
          </div>
        )}

        <div className="max-h-[420px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : sales.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center">
              <ShoppingBag className="h-7 w-7 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">{t.posHeldSalesEmpty}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sales.map((sale) => {
                const isCancelling = cancellingUuid === sale.uuid;
                const isAnyBusy = cancellingUuid !== null;
                return (
                  <div
                    key={sale.uuid}
                    className="rounded-xl border border-border bg-muted/20 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {sale.saleNumber}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            · {sale.details.length} item{sale.details.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {sale.customer?.isWalkIn ? "Walk-in" : sale.customer?.name ?? "—"} ·{" "}
                          {format(new Date(sale.soldAt), "dd MMM, HH:mm")}
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-foreground">
                          {formatCurrency(sale.grandTotal)}
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          disabled={isAnyBusy}
                          onClick={() => setConfirmSale(sale)}
                        >
                          {isCancelling ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            t.posHeldSalesCancelHeld
                          )}
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-lg"
                          disabled={isAnyBusy}
                          onClick={() => onContinue(sale)}
                        >
                          {t.posHeldSalesContinue}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>

    {/* Cancel hold confirmation */}
    <Dialog open={confirmSale !== null} onOpenChange={(v) => { if (!v) setConfirmSale(null); }}>
      <DialogContent className="max-w-sm p-0">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-destructive/10">
            <Ban className="h-4 w-4 text-destructive" />
          </div>
          <DialogTitle className="text-base">{t.posHeldSalesCancelConfirmTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <DialogDescription className="text-sm text-muted-foreground">
            {t.posHeldSalesCancelConfirmDesc}
          </DialogDescription>
          {confirmSale && (
            <p className="rounded-lg bg-muted px-3 py-2 text-sm font-medium text-foreground">
              {confirmSale.saleNumber}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button
            variant="outline"
            onClick={() => setConfirmSale(null)}
            className="rounded-xl"
          >
            {t.cancel}
          </Button>
          <Button
            variant="destructive"
            className="min-w-[8rem] rounded-xl"
            onClick={() => {
              if (confirmSale) {
                onCancelHeld(confirmSale);
                setConfirmSale(null);
              }
            }}
          >
            {t.posHeldSalesCancelHeld}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </>
  );
}
