import type { JSX } from "react";
import { Receipt, Ban, Undo2, Wallet, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import type { Translations } from "@/configs/i18n";
import type { Sale } from "@/types/sale";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getSale } from "@/service/saleService";
import {
  getSaleStatusLabel,
  getSaleTypeLabel,
  getSalePaymentStatusLabel,
  getPaymentMethodLabel,
  getSaleInitials,
  getSaleAvatarColor,
  canCancelSale,
  canRefundSale,
  canAddPayment,
  canCompleteSale,
  formatDate,
  formatCurrency,
} from "./salesUtils";

export interface SaleDetailPanelProps {
  sale: Sale;
  t: Translations;
  onClose: () => void;
  onCancel: () => void;
  onRefund: () => void;
  onAddPayment: () => void;
  onComplete: () => void;
}

export function SaleDetailPanel({
  sale: listSale,
  t,
  onClose,
  onCancel,
  onRefund,
  onAddPayment,
  onComplete,
}: SaleDetailPanelProps): JSX.Element {
  const { data } = useQuery({
    queryKey: ["sale", listSale.uuid],
    queryFn: () => getSale(listSale.uuid),
    staleTime: 30 * 1000,
  });

  const sale: Sale = data?.data ?? listSale;

  return (
    <DetailModal
      icon={<Receipt className="h-4 w-4 text-primary" />}
      title={t.saleDetailsTitle}
      onClose={onClose}
      actions={[
        {
          label: t.saleComplete,
          icon: <CheckCircle2 className="h-4 w-4" />,
          variant: "success",
          onClick: onComplete,
          hidden: !canCompleteSale(sale.status),
        },
        {
          label: t.salePaymentAdd,
          icon: <Wallet className="h-4 w-4" />,
          variant: "outline",
          onClick: onAddPayment,
          hidden: !canAddPayment(sale.status, sale.saleType, sale.payment?.paymentStatus),
        },
        {
          label: t.saleRefund,
          icon: <Undo2 className="h-4 w-4" />,
          variant: "outline",
          onClick: onRefund,
          hidden: !canRefundSale(sale.status),
        },
        {
          label: t.saleCancel,
          icon: <Ban className="h-4 w-4" />,
          variant: "destructive",
          onClick: onCancel,
          hidden: !canCancelSale(sale.status),
        },
      ]}
    >
      {/* Hero */}
      <div className="flex items-center gap-4 px-5 py-6">
        <div
          className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-xs font-bold ${getSaleAvatarColor(sale.saleNumber)}`}
        >
          {getSaleInitials(sale.saleNumber)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-foreground">{sale.saleNumber}</p>
          <StatusBadge
            status={sale.status}
            label={getSaleStatusLabel(sale.status, t)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="mx-5 border-t border-border" />

      {/* Info pairs */}
      <div className="divide-y divide-border px-5">
        <InfoPair label={t.saleCustomer} value={sale.customer.name} valueClassName="uppercase" />
        <InfoPair label={t.saleType} value={getSaleTypeLabel(sale.saleType, t)} />
        <InfoPair label={t.saleSoldAt} value={formatDate(sale.soldAt)} />
        {sale.saleType === "CREDIT" && sale.dueDate && (
          <InfoPair label={t.saleDueDate} value={formatDate(sale.dueDate)} />
        )}
        <InfoPair label={t.saleDescription} value={sale.description} />
      </div>

      {/* Totals */}
      <div className="mx-5 mt-5 space-y-2 rounded-xl bg-muted/40 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t.posSubtotal}</span>
          <span className="font-medium text-foreground">{formatCurrency(sale.totalAmount)}</span>
        </div>
        {sale.discountAmount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t.posDiscountLabel}</span>
            <span className="font-medium text-destructive">-{formatCurrency(sale.discountAmount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t.saleTaxAmount} ({sale.ppnPercentage}%)</span>
          <span className="font-medium text-foreground">{formatCurrency(sale.ppnAmount)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t.saleTotalAmount}</span>
          <span className="font-semibold text-foreground">{formatCurrency(sale.grandTotal)}</span>
        </div>
        {sale.payment && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t.salePaidAmount}</span>
              <span className="font-medium text-foreground">{formatCurrency(sale.paidAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t.salePaymentStatusColumn}</span>
              <StatusBadge
                status={sale.payment.paymentStatus}
                label={getSalePaymentStatusLabel(sale.payment.paymentStatus, t)}
              />
            </div>
          </>
        )}
      </div>

      {/* Items */}
      {sale.details.length > 0 && (
        <div className="px-5 pb-1 pt-5">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.saleItemsSection}
            <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-primary">
              {sale.details.length}
            </span>
          </p>
          <div className="space-y-1.5">
            {sale.details.map((item) => (
              <div
                key={item.uuid}
                className="rounded-lg border border-border bg-muted/30 px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium uppercase text-foreground">{item.medicine.name}</p>
                  <span className="shrink-0 text-sm font-medium text-foreground">
                    {formatCurrency(item.totalAmount)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t.saleBatchLabel}: <span className="uppercase">{item.stockDetail.batchNumber}</span>
                  {" · "}
                  {item.quantityPieces} {item.medicine.unit}
                  {item.discountPercentage > 0 && ` · ${t.saleDiscountLabel} ${item.discountPercentage}%`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment history */}
      {sale.payment && sale.payment.history.length > 0 && (
        <div className="px-5 pb-1 pt-5">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.salePaymentHistorySection}
          </p>
          <div className="space-y-1.5">
            {sale.payment.history.map((h) => (
              <div
                key={h.uuid}
                className="rounded-lg border border-border bg-muted/30 px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {formatCurrency(h.amount)}
                  </p>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {getPaymentMethodLabel(h.paymentMethod, t)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(h.paymentDate)}</p>
                {h.description && (
                  <p className="text-xs text-muted-foreground">{h.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dates */}
      <DetailDatesCard
        className="mt-auto"
        rows={[{ label: t.created, value: formatDate(sale.createdAt) }]}
      />
    </DetailModal>
  );
}
