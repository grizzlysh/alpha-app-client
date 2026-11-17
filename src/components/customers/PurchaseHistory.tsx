import type { JSX } from "react";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronDown, FileText, Loader2, Plus, Receipt, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency, getSaleStatusLabel } from "@/components/sales/salesUtils";
import { useLanguage } from "@/hooks/useLanguage";
import { getCustomerPurchases } from "@/service/customerService";
import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import type { CustomerPurchaseHistory, PurchaseMedicine } from "@/types/customer";

const PAGE_SIZE = 10;

type Sale = CustomerPurchaseHistory["sales"][number];

function relativeDay(iso: string, t: Translations, locale: string): string {
  const d = new Date(iso);
  const start = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((start(new Date()) - start(d)) / 86_400_000);
  if (days <= 0) return t.purchaseToday;
  if (days === 1) return t.purchaseYesterday;
  if (days < 30) return t.purchaseDaysAgo.replace("{n}", String(days));
  return d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
}

export interface PurchaseHistoryProps {
  customerUuid: string;
  /** At the till: adds one of a frequently bought medicine to the cart. */
  onBuyAgain?: (medicine: PurchaseMedicine) => Promise<void> | void;
}

/**
 * What a customer bought here: three headline numbers, the medicines they buy
 * most (with "add" at the POS) and their sales, newest first.
 */
export function PurchaseHistory({ customerUuid, onBuyAgain }: PurchaseHistoryProps): JSX.Element {
  const { t, language } = useLanguage();
  const locale = language === "id" ? "id-ID" : "en-US";
  const [adding, setAdding] = useState<string | null>(null);

  const query = useInfiniteQuery({
    queryKey: ["customer-purchases", customerUuid],
    queryFn: ({ pageParam }) => getCustomerPurchases(customerUuid, { page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const meta = last.data?.meta;
      return meta && meta.page < meta.totalPages ? meta.page + 1 : undefined;
    },
  });

  const first = query.data?.pages[0]?.data;
  const sales = query.data?.pages.flatMap((p) => p.data?.sales ?? []) ?? [];

  if (query.isLoading) {
    return (
      <div className="space-y-3" aria-busy="true">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted/50" />
          ))}
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-muted/40" />
        ))}
      </div>
    );
  }

  if (query.isError || !first) {
    return <p className="text-sm text-muted-foreground">{t.unexpectedError}</p>;
  }

  if (first.summary.transactionCount === 0 && sales.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-10 text-center">
        <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
        <p className="text-sm font-medium text-foreground">{t.purchaseEmptyTitle}</p>
        <p className="text-xs text-muted-foreground">{t.purchaseEmptyDesc}</p>
      </div>
    );
  }

  const { summary } = first;

  async function buyAgain(medicine: PurchaseMedicine): Promise<void> {
    if (!onBuyAgain) return;
    setAdding(medicine.uuid);
    try {
      await onBuyAgain(medicine);
    } finally {
      setAdding(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Headline numbers ── */}
      <div>
        <dl className="grid grid-cols-3 gap-2">
          <Stat label={t.purchaseTransactions} value={String(summary.transactionCount)} />
          <Stat label={t.purchaseTotalSpent} value={formatCurrency(summary.totalSpent)} />
          <Stat label={t.purchaseLast} value={summary.lastPurchaseAt ? relativeDay(summary.lastPurchaseAt, t, locale) : "—"} />
        </dl>
        {summary.firstPurchaseAt && (
          <p className="mt-2 text-xs text-muted-foreground">
            {t.purchaseCustomerSince.replace(
              "{date}",
              new Date(summary.firstPurchaseAt).toLocaleDateString(locale, { month: "long", year: "numeric" })
            )}
            {" · "}
            {t.purchaseAverage.replace("{amount}", formatCurrency(summary.averageSpent))}
          </p>
        )}
      </div>

      {/* ── Frequently bought ── */}
      {first.frequentItems.length > 0 && (
        <section className="space-y-2">
          <SectionLabel>{t.purchaseFrequent}</SectionLabel>
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
            {first.frequentItems.map((f) => (
              <li key={f.medicine.uuid} className="flex items-center gap-3 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{f.medicine.name.toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.purchaseTimesBought.replace("{n}", String(f.timesBought))}
                    {" · "}
                    {f.totalPieces} {f.medicine.unit.toLowerCase()}
                    {" · "}
                    {relativeDay(f.lastBoughtAt, t, locale)}
                  </p>
                </div>
                {onBuyAgain && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 shrink-0 gap-1 rounded-lg px-2.5 text-xs"
                    disabled={adding !== null}
                    onClick={() => buyAgain(f.medicine)}
                  >
                    {adding === f.medicine.uuid ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                    {t.purchaseAdd}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Sales ── */}
      <section className="space-y-2">
        <SectionLabel>{t.purchaseSales}</SectionLabel>
        <ul className="space-y-2">
          {sales.map((s) => (
            <SaleRow key={s.uuid} sale={s} t={t} locale={locale} />
          ))}
        </ul>
        {query.hasNextPage && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 w-full rounded-xl text-xs"
            disabled={query.isFetchingNextPage}
            onClick={() => query.fetchNextPage()}
          >
            {query.isFetchingNextPage && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            {t.purchaseLoadMore}
          </Button>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="rounded-xl border border-border bg-muted/20 px-3 py-2.5">
      <dt className="truncate text-[11px] font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-semibold tabular-nums text-foreground">{value}</dd>
    </div>
  );
}

function SectionLabel({ children }: { children: string }): JSX.Element {
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</p>
      <span className="h-px flex-1 bg-border" aria-hidden />
    </div>
  );
}

function SaleRow({ sale, t, locale }: { sale: Sale; t: Translations; locale: string }): JSX.Element {
  const [open, setOpen] = useState(false);
  const voided = sale.status === "REFUNDED" || sale.status === "CANCELLED";
  const summary = sale.items.map((i) => `${i.medicine.name} ×${i.quantityPieces}`).join(", ");
  const date = new Date(sale.soldAt);

  return (
    <li className={cn("overflow-hidden rounded-xl border border-border", voided && "bg-muted/20")}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/40"
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Receipt className="h-4 w-4" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-sm font-semibold text-foreground">
              {date.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span className="text-xs text-muted-foreground">
              {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            {voided && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                {getSaleStatusLabel(sale.status, t)}
              </span>
            )}
            {sale.paymentStatus && sale.paymentStatus !== "PAID" && !voided && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                {sale.paymentStatus === "PARTIAL" ? t.salePaymentStatusPartial : t.salePaymentStatusUnpaid}
              </span>
            )}
          </span>
          {!open && <span className="mt-0.5 block truncate text-xs text-muted-foreground">{summary}</span>}
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className={cn("text-sm font-semibold tabular-nums", voided ? "text-muted-foreground line-through" : "text-foreground")}>
            {formatCurrency(sale.grandTotal)}
          </span>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden />
        </span>
      </button>

      {open && (
        <div className="border-t border-border bg-muted/10 px-3 py-2">
          <p className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span className="font-mono">{sale.saleNumber}</span>
            {sale.prescription && (
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" aria-hidden />
                {sale.prescription.prescriptionNumber ?? t.examPrescription}
              </span>
            )}
          </p>
          <ul className="space-y-1 text-xs">
            {sale.items.map((i, idx) => (
              <li key={idx} className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-foreground">
                  {i.medicine.name}
                  <span className="ml-1.5 text-muted-foreground">
                    × {i.quantityPieces} {i.medicine.unit.toLowerCase()}
                  </span>
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">{formatCurrency(i.totalAmount)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
