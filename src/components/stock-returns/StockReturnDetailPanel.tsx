import type { JSX } from "react";
import { Pencil, Trash2, CheckCircle2, XCircle, Ban, Undo2 } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { StockReturn } from "@/types/stockReturn";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  getSRStatusLabel,
  getSRInitials,
  getSRAvatarColor,
  canEdit,
  canComplete,
  canReject,
  canCancel,
  canDelete,
  formatDate,
} from "./stockReturnUtils";

function formatIDR(value: string | number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export interface StockReturnDetailPanelProps {
  stockReturn: StockReturn;
  t: Translations;
  onClose: () => void;
  onEdit: () => void;
  onComplete: () => void;
  onReject: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function StockReturnDetailPanel({
  stockReturn,
  t,
  onClose,
  onEdit,
  onComplete,
  onReject,
  onCancel,
  onDelete,
}: StockReturnDetailPanelProps): JSX.Element {
  const isCancelled = stockReturn.status === "CANCELLED";
  const isRejected = stockReturn.status === "REJECTED";
  const isCompleted = stockReturn.status === "COMPLETED";

  return (
    <DetailModal
      icon={<Undo2 className="h-4 w-4 text-primary" />}
      title={t.srDetailsTitle}
      onClose={onClose}
      actions={[
        {
          label: t.srEdit,
          icon: <Pencil className="h-4 w-4" />,
          variant: "outline",
          onClick: onEdit,
          hidden: !canEdit(stockReturn.status),
        },
        {
          label: t.srComplete,
          icon: <CheckCircle2 className="h-4 w-4" />,
          variant: "success",
          onClick: onComplete,
          hidden: !canComplete(stockReturn.status),
        },
        {
          label: t.srReject,
          icon: <XCircle className="h-4 w-4" />,
          variant: "destructive",
          onClick: onReject,
          hidden: !canReject(stockReturn.status),
        },
        {
          label: t.srCancel,
          icon: <Ban className="h-4 w-4" />,
          variant: "destructive",
          onClick: onCancel,
          hidden: !canCancel(stockReturn.status),
        },
        {
          label: t.srDelete,
          icon: <Trash2 className="h-4 w-4" />,
          variant: "destructive",
          onClick: onDelete,
          hidden: !canDelete(stockReturn.status),
        },
      ]}
    >
      {/* Hero */}
      <div className="flex items-center gap-4 px-5 py-5">
        <div
          className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-xs font-bold ${getSRAvatarColor(stockReturn.returnNumber)}`}
        >
          {getSRInitials(stockReturn.returnNumber)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-bold text-foreground">{stockReturn.returnNumber}</p>
          <p className="truncate text-sm uppercase text-muted-foreground">{stockReturn.distributor.name}</p>
          <StatusBadge
            status={stockReturn.status}
            label={getSRStatusLabel(stockReturn.status, t)}
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="mx-5 border-t border-border" />

      {/* Info pairs */}
      <div className="divide-y divide-border px-5">
        <InfoPair label={t.srSignedBy} value={stockReturn.signedBy?.name} />
        {isCompleted && (
          <InfoPair
            label={t.srReturnedAt}
            value={stockReturn.returnedAt ? formatDate(stockReturn.returnedAt) : undefined}
          />
        )}
        <InfoPair label={t.srReason} value={stockReturn.reason} />
        <InfoPair label={t.srDescription} value={stockReturn.description} />
        {isCancelled && (
          <InfoPair label={t.srCancellationReason} value={stockReturn.cancellationReason} />
        )}
        {isRejected && (
          <InfoPair label={t.srRejectionReason} value={stockReturn.rejectionReason} />
        )}
        <InfoPair label={t.srTotalAmount} value={formatIDR(stockReturn.totalAmount)} />
      </div>

      {/* Items */}
      {stockReturn.details.length > 0 && (
        <div className="px-5 pb-2 pt-5">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.srItemsSection}
            <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-primary">
              {stockReturn.details.length}
            </span>
          </p>
          <div className="space-y-2">
            {stockReturn.details.map((item) => (
              <div
                key={item.uuid}
                className="rounded-lg border border-border bg-muted/30 px-3 py-2.5"
              >
                <p className="text-sm font-medium uppercase text-foreground">{item.medicine.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t.srBatchLabel}: <span className="uppercase">{item.stockDetail.batchNumber}</span>
                  {" · "}
                  {item.quantityPieces} {item.medicine.unit}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.srExpiryLabel}: {formatDate(item.stockDetail.expiryDate)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t.srInvoiceLabel}: <span className="uppercase">{item.stockDetail.invoiceDetail.invoice.invoiceNumber}</span>
                </p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatIDR(item.price)} × {item.quantityPieces}
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {formatIDR(item.totalAmount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dates */}
      <DetailDatesCard
        className="mx-5 mb-5 mt-5"
        rows={[
          { label: t.created, value: formatDate(stockReturn.createdAt) },
          { label: t.lastUpdated, value: formatDate(stockReturn.updatedAt) },
        ]}
      />
    </DetailModal>
  );
}
