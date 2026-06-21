import type { JSX } from "react";
import {
  Pencil,
  Trash2,
  Printer,
  Ban,
  ClipboardList,
  Repeat,
} from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { PurchaseOrder } from "@/types/purchaseOrder";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  getPOStatusLabel,
  getPOInitials,
  getPOAvatarColor,
  canEdit,
  canPrint,
  canCancel,
  canDelete,
  canRepurchase,
  formatDate,
} from "./purchaseOrderUtils";

// ── PurchaseOrderDetailPanel ──────────────────────────────────────────────────

export interface PurchaseOrderDetailPanelProps {
  order: PurchaseOrder;
  t: Translations;
  onClose: () => void;
  onEdit: () => void;
  onPrint: () => void;
  onRepurchase: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function PurchaseOrderDetailPanel({
  order,
  t,
  onClose,
  onEdit,
  onPrint,
  onRepurchase,
  onCancel,
  onDelete,
}: PurchaseOrderDetailPanelProps): JSX.Element {
  const isDraft = canEdit(order.status);
  const canBePrinted = canPrint(order.status);
  const canBeRepurchased = canRepurchase(order.status);
  const canBeCancelled = canCancel(order.status);
  const canBeDeleted = canDelete(order.status);

  return (
    <DetailModal
      icon={<ClipboardList className="h-4 w-4 text-primary" />}
      title={t.poDetailsTitle}
      onClose={onClose}
      actions={[
        {
          label: t.poEdit,
          icon: <Pencil className="h-4 w-4" />,
          variant: "outline",
          onClick: onEdit,
          hidden: !isDraft,
        },
        {
          label: isDraft ? t.poPrint : t.poReprint,
          icon: <Printer className="h-4 w-4" />,
          variant: isDraft ? "default" : "outline",
          onClick: onPrint,
          hidden: !canBePrinted,
        },
        {
          label: t.poRepurchase,
          icon: <Repeat className="h-4 w-4" />,
          variant: "outline",
          onClick: onRepurchase,
          hidden: !canBeRepurchased,
        },
        {
          label: t.poCancel,
          icon: <Ban className="h-4 w-4" />,
          variant: "destructive",
          onClick: onCancel,
          hidden: !canBeCancelled,
        },
        {
          label: t.poDelete,
          icon: <Trash2 className="h-4 w-4" />,
          variant: "destructive",
          onClick: onDelete,
          hidden: !canBeDeleted,
        },
      ]}
    >
      {/* Hero */}
      <div className="flex items-center gap-4 px-5 py-6">
        <div
          className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-xs font-bold ${getPOAvatarColor(order.orderNumber)}`}
        >
          {getPOInitials(order.orderNumber)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-foreground">{order.orderNumber}</p>
          <StatusBadge
            status={order.status}
            label={getPOStatusLabel(order.status, t)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="mx-5 border-t border-border" />

      {/* Info pairs */}
      <div className="divide-y divide-border px-5">
        <InfoPair label={t.poDistributor} value={order.distributor.name} valueClassName="uppercase" />
        <InfoPair label={t.poSignedBy} value={order.signedByUser?.name} />
        <InfoPair label={t.poDescription} value={order.description} />
        <InfoPair label={t.poCancellationReason} value={order.cancellationReason} />
      </div>

      {/* Items */}
      {order.details.length > 0 && (
        <div className="px-5 pb-1 pt-5">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.poItemsSection}
            <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-primary">
              {order.details.length}
            </span>
          </p>
          <div className="space-y-1.5">
            {order.details.map((item) => (
              <div
                key={item.uuid}
                className="rounded-lg border border-border bg-muted/30 px-3 py-2"
              >
                <p className="text-sm font-medium uppercase text-foreground">{item.medicine.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.quantity} {item.unit}
                  {item.description && ` · ${item.description}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dates */}
      <DetailDatesCard
        className="mt-auto"
        rows={[
          { label: t.created, value: formatDate(order.createdAt) },
          { label: t.lastUpdated, value: formatDate(order.updatedAt) },
        ]}
      />
    </DetailModal>
  );
}
