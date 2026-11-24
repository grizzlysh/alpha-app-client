import type { JSX } from "react";
import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Info, Loader2, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";
import { useNameFormat } from "@/hooks/useNameFormat";
import { getMedicineStockCard } from "@/service/stockService";
import { toDateInputValue } from "@/utils/dateHelpers";
import { printDocument, stockCardDocument, stockText } from "./barcodeLabels";
import { PrintPreview } from "./PrintPreview";
import { labelText, previewZoom } from "./printPrefs";

const MAX_PERIOD_DAYS = 366;

export interface StockCardViewProps {
  medicineUuid: string;
  /** Extra buttons next to Print (e.g. Cancel in a dialog). */
  actions?: JSX.Element;
}

/** A medicine's daily stock card for a chosen period: totals, preview and print. */
export function StockCardView({ medicineUuid, actions }: StockCardViewProps): JSX.Element {
  const { t, language } = useLanguage();
  const fmt = useNameFormat();
  const locale = language === "id" ? "id-ID" : "en-GB";
  const today = new Date();
  const [from, setFrom] = useState(() => toDateInputValue(new Date(today.getFullYear(), today.getMonth(), 1)));
  const [to, setTo] = useState(() => toDateInputValue(today));
  const validPeriod = !!from && !!to && from <= to && (Date.parse(to) - Date.parse(from)) / 86_400_000 <= MAX_PERIOD_DAYS;

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["medicine-stock-card", medicineUuid, from, to],
    queryFn: () => getMedicineStockCard(medicineUuid, { from, to }),
    enabled: validPeriod,
    placeholderData: keepPreviousData,
  });
  const card = data?.data;
  const text = useMemo(() => labelText(t), [t]);
  const html = card ? stockCardDocument(card, text, { locale, formatName: fmt }) : null;
  const totalIn = card?.days.reduce((s, d) => s + d.in, 0) ?? 0;
  const totalOut = card?.days.reduce((s, d) => s + d.out, 0) ?? 0;

  function handlePrint(): void {
    if (!html || !card) return;
    if (!printDocument(`${t.printStockCard} · ${card.medicine.name}`, html)) toast.error(t.printPopupBlocked);
  }

  const summary = card
    ? [
        { label: text.openingBalance, value: card.openingBalance },
        { label: text.in, value: totalIn },
        { label: text.out, value: totalOut },
        { label: text.balance, value: card.closingBalance },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="card-from">{t.stockCardFrom}</Label>
          <DateInput id="card-from" value={from} onChange={setFrom} maxDate={new Date(`${to}T00:00:00`)} showShortcuts={false} className="w-56" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="card-to">{t.stockCardTo}</Label>
          <DateInput id="card-to" value={to} onChange={setTo} minDate={new Date(`${from}T00:00:00`)} maxDate={today} showShortcuts={false} className="w-56" />
        </div>
        {isFetching && <Loader2 className="mb-3 h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {!validPeriod ? (
        <p className="text-sm text-destructive">{t.stockCardInvalidPeriod}</p>
      ) : isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError || !card || !html ? (
        <p className="py-10 text-center text-sm text-muted-foreground">{t.unexpectedError}</p>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {summary.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card px-3 py-2">
                <dt className="text-xs text-muted-foreground">{s.label}</dt>
                <dd className="text-sm font-semibold tabular-nums text-foreground">{stockText(s.value, card.medicine.unit)}</dd>
              </div>
            ))}
          </dl>
          {card.days.length === 0 && <p className="text-sm text-muted-foreground">{t.stockCardEmptyPeriod}</p>}
          {card.movementsAfterPeriod > 0 && (
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              {t.stockCardAfterPeriod.replace("{n}", String(card.movementsAfterPeriod))}
            </p>
          )}
          <div className="overflow-auto rounded-xl border border-border bg-muted/40 p-2">
            <PrintPreview html={html} title={t.printPreview} zoom={previewZoom("card")} alignStart className="h-[26rem]" />
          </div>
        </>
      )}

      <div className="flex justify-end gap-2">
        {actions}
        <Button className="gap-2 rounded-xl" disabled={!html || !validPeriod} onClick={handlePrint}>
          <Printer className="h-4 w-4" />
          {t.printButton}
        </Button>
      </div>
    </div>
  );
}
