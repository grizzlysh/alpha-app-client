import type { JSX } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trash2, Receipt, ShoppingCart, CreditCard, Plus } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import type { Translations } from "@/configs/i18n";
import type { Invoice, InvoicePaymentHistory } from "@/types/invoice";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import { InvoicePaymentAddModal } from "./InvoicePaymentAddModal";
import { InvoicePaymentDeleteModal } from "./InvoicePaymentDeleteModal";
import { getInvoice } from "@/service/invoiceService";
import {
  getPaymentStatusLabel,
  getInvoiceInitials,
  getInvoiceAvatarColor,
  canDelete,
  formatDate,
  formatCurrency,
} from "./invoiceUtils";

// ── Small helpers ─────────────────────────────────────────────────────────────

interface SummaryRowProps {
  label: string;
  value: string;
  bold?: boolean;
  destructive?: boolean;
  positive?: boolean;
  muted?: boolean;
}

function SummaryRow({ label, value, bold, destructive, positive, muted }: SummaryRowProps): JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-sm", bold ? "font-semibold text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
      <span
        className={cn(
          "text-sm",
          bold ? "font-bold text-foreground" : "font-medium text-foreground",
          destructive && "text-destructive",
          positive && "text-primary",
          muted && "text-muted-foreground/40"
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────────

export interface InvoiceDetailPanelProps {
  invoice: Invoice;
  t: Translations;
  onClose: () => void;
  onDelete: () => void;
}

export function InvoiceDetailPanel({
  invoice,
  t,
  onClose,
  onDelete,
}: InvoiceDetailPanelProps): JSX.Element {
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<InvoicePaymentHistory | null>(null);

  const { data: freshData } = useQuery({
    queryKey: ["invoice", invoice.uuid],
    queryFn: () => getInvoice(invoice.uuid),
    staleTime: 0,
  });
  const data = freshData?.data ?? invoice;

  const canBeDeleted = canDelete(data.paymentStatus);

  const totalDiscount = data.details.reduce((sum, d) => sum + d.discountAmount, 0);
  const ppnNominal = data.ppnNominal ?? 0;
  const subtotal = data.totalAmount - ppnNominal;
  const grossTotal = subtotal + totalDiscount;
  const hasPpn = !!data.ppnEnabled;
  const hasDiscount = totalDiscount > 0;

  const paymentHistory = data.payment?.history ?? [];
  const isFullyPaid = data.paymentStatus === "PAID";

  return (
    <>
    {showAddPayment && (
      <InvoicePaymentAddModal
        invoice={data}
        onClose={() => setShowAddPayment(false)}
        onSuccess={() => setShowAddPayment(false)}
      />
    )}
    {deleteTarget && (
      <InvoicePaymentDeleteModal
        invoiceUuid={data.uuid}
        history={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onSuccess={() => setDeleteTarget(null)}
      />
    )}
    <DetailModal
      icon={<Receipt className="h-4 w-4 text-primary" />}
      title={t.invoiceDetailsTitle}
      onClose={onClose}
      className="max-w-5xl sm:max-w-5xl"
      bodyClassName="flex flex-1 flex-row overflow-hidden"
    >
      {/* ── Left: Items table ──────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.invoiceItemsSection}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {data.details.length}
          </span>
        </div>

        {data.details.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-muted-foreground">
            <ShoppingCart className="h-8 w-8 opacity-30" />
            <p className="text-sm">—</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <table className="w-full table-fixed text-sm">
              <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
                <tr className="border-b border-border">
                  <th className="w-[30%] px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {t.invoiceItemMedicine}
                  </th>
                  <th className="w-[20%] px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {t.invoiceItemQtyBox}
                  </th>
                  <th className="w-[10%] px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {t.invoiceItemDiscount}
                  </th>
                  <th className="w-[18%] px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {t.invoiceItemPrice}
                  </th>
                  <th className="w-[22%] px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                    {t.invoiceItemTotal}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.details.map((item) => (
                  <tr key={item.uuid} className="hover:bg-muted/40">
                    <td className="overflow-hidden px-5 py-3">
                      <p className="truncate font-semibold uppercase text-foreground">
                        {item.medicine.name}
                      </p>
                      <p className="mt-0.5 truncate font-mono uppercase text-xs text-muted-foreground">
                        {item.batchNumber}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDate(item.expiryDate)}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      <p className="font-medium text-foreground">
                        {item.quantityBox.toLocaleString()}{" "}
                        <span className="text-muted-foreground">Box</span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        × {item.quantityPerBox} {item.medicine.unit}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-foreground">
                        = {item.quantityPieces.toLocaleString()} {item.medicine.unit}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-right">
                      {item.discountPercentage > 0 ? (
                        <span className="text-xs font-medium text-destructive">
                          −{item.discountPercentage}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-foreground">
                      {formatCurrency(item.finalPrice)}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums font-semibold text-foreground">
                      {formatCurrency(item.quantityBox * item.finalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-px flex-shrink-0 bg-border" />

      {/* ── Right: Invoice info ─────────────────────────────────────────── */}
      <div className="flex w-96 flex-shrink-0 flex-col">
        <div className="flex-1 overflow-y-auto">

          {/* Hero */}
          <div className="flex items-center gap-4 px-5 py-6">
            <div
              className={cn(
                "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-xs font-bold",
                getInvoiceAvatarColor(data.invoiceNumber)
              )}
            >
              {getInvoiceInitials(data.invoiceNumber)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold uppercase text-foreground">{data.invoiceNumber}</p>
              <StatusBadge
                status={data.paymentStatus}
                label={getPaymentStatusLabel(data.paymentStatus, t)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Date strip — 3 cells, each center-aligned */}
          <div className="grid grid-cols-3 divide-x divide-border border-y border-border bg-muted/30">
            <div className="flex flex-col items-center px-3 py-3 text-center">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {t.invoiceDate}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">
                {formatDate(data.invoiceDate)}
              </p>
            </div>
            <div className="flex flex-col items-center px-3 py-3 text-center">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {t.invoiceDueDate}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">
                {data.dueDate ? formatDate(data.dueDate) : "—"}
              </p>
            </div>
            <div className="flex flex-col items-center px-3 py-3 text-center">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {t.invoiceReceiveDate}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">
                {data.receiveDate ? formatDate(data.receiveDate) : "—"}
              </p>
            </div>
          </div>

          {/* Info pairs */}
          <div className="divide-y divide-border px-5">
            <InfoPair label={t.invoiceDistributor} value={data.distributor.name} valueClassName="uppercase" />
            <InfoPair label={t.invoiceSignedBy} value={data.signedBy?.name} />
            <InfoPair
              label={t.invoicePurchaseOrder}
              value={data.purchaseOrder?.orderNumber}
            />
            <InfoPair label={t.invoiceDescription} value={data.description} />
          </div>

          {/* Financial summary */}
          <div className="m-5 overflow-hidden rounded-xl border border-border">
            <div className="border-b border-border bg-muted/40 px-4 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t.invoiceTotalAmount}
              </p>
            </div>
            <div className="space-y-2 px-4 py-3">
              <SummaryRow label={t.invoiceSubtotal} value={formatCurrency(grossTotal)} />
              <SummaryRow
                label={t.invoiceDiscount}
                value={hasDiscount ? `− ${formatCurrency(totalDiscount)}` : "—"}
                destructive={hasDiscount}
                muted={!hasDiscount}
              />
              <SummaryRow
                label={`PPN ${data.ppnPercentage ?? 0}%`}
                value={hasPpn ? `+ ${formatCurrency(ppnNominal)}` : "—"}
                positive={hasPpn}
                muted={!hasPpn}
              />
              <div className="border-t border-border pt-2">
                <SummaryRow
                  label={t.invoiceTotalAmount}
                  value={formatCurrency(data.totalAmount)}
                  bold
                />
              </div>
              <SummaryRow label={t.invoicePaidAmount} value={formatCurrency(data.paidAmount)} />
              <SummaryRow
                label={t.invoiceRemaining}
                value={formatCurrency(data.totalAmount - data.paidAmount)}
                destructive={data.paidAmount < data.totalAmount}
                muted={data.paidAmount >= data.totalAmount}
              />
            </div>
          </div>

          {/* Payment history */}
          <div className="mx-5 mb-5">
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t.invoicePaymentSectionTitle}
                  </p>
                </div>
                {!isFullyPaid && (
                  <button
                    type="button"
                    onClick={() => setShowAddPayment(true)}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors whitespace-nowrap"
                  >
                    <Plus className="h-3 w-3" />
                    {t.add}
                  </button>
                )}
              </div>

              {paymentHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-1.5 py-6 text-muted-foreground">
                  <CreditCard className="h-6 w-6 opacity-30" />
                  <p className="text-xs">{t.invoicePaymentNoHistory}</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {paymentHistory.map((entry) => (
                    <div key={entry.uuid} className="flex items-start justify-between gap-3 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground tabular-nums">
                            {formatCurrency(entry.amount)}
                          </span>
                          <span className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                            entry.paymentMethod === "CASH"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : entry.paymentMethod === "TRANSFER"
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          )}>
                            {entry.paymentMethod === "CASH"
                              ? t.invoicePaymentMethodCash
                              : entry.paymentMethod === "TRANSFER"
                              ? t.invoicePaymentMethodTransfer
                              : t.invoicePaymentMethodCredit}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatDate(entry.paymentDate)}
                        </p>
                        {entry.description && (
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {entry.description}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(entry)}
                        className="flex-shrink-0 rounded-lg p-1 text-muted-foreground/50 hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Created / Last Updated */}
          <DetailDatesCard
            rows={[
              { label: t.created, value: formatDate(data.createdAt) },
              { label: t.lastUpdated, value: formatDate(data.updatedAt) },
            ]}
          />

        </div>

        {/* Delete button — pinned to bottom of right column */}
        {canBeDeleted && (
          <div className="border-t border-border p-5">
            <Button
              variant="destructive"
              className="w-full gap-2 rounded-xl"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
              {t.invoiceDelete}
            </Button>
          </div>
        )}
      </div>
    </DetailModal>
    </>
  );
}
