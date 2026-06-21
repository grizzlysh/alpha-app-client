import type { JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRight, ArrowRight } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { StockMovement } from "@/types/stockMovement";
import { getStockMovement } from "@/service/stockMovementService";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import {
  getSMInitials,
  getSMAvatarColor,
  getSMTypeBadgeClass,
  getSMTypeLabel,
  getSMReasonLabel,
  formatDate,
} from "./stockMovementUtils";

export interface StockMovementDetailPanelProps {
  movement: StockMovement;
  t: Translations;
  onClose: () => void;
}

export function StockMovementDetailPanel({
  movement,
  t,
  onClose,
}: StockMovementDetailPanelProps): JSX.Element {
  const { data } = useQuery({
    queryKey: ["stock-movements", movement.uuid],
    queryFn: () => getStockMovement(movement.uuid),
  });

  const detail = data?.data;

  const referenceNumber =
    detail?.invoiceDetail?.invoice.invoiceNumber ??
    detail?.sale?.saleNumber ??
    detail?.stockReturn?.returnNumber ??
    detail?.stockDisposal?.disposalNumber ??
    movement.reference?.number ??
    null;

  return (
    <DetailModal
      icon={<ArrowLeftRight className="h-4 w-4 text-primary" />}
      title={t.smDetailsTitle}
      onClose={onClose}
    >
      {/* Hero */}
      <div className="flex items-center gap-4 px-5 py-6">
        <div
          className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-xs font-bold ${getSMAvatarColor(movement.medicine.uuid)}`}
        >
          {getSMInitials(movement.medicine.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-bold uppercase text-foreground">
            {movement.medicine.name}
          </p>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${getSMTypeBadgeClass(movement.type)}`}
          >
            {getSMTypeLabel(movement.type, t)}
          </span>
        </div>
      </div>

      <div className="mx-5 border-t border-border" />

      {/* Info pairs */}
      <div className="divide-y divide-border px-5">
        <InfoPair label={t.smDate} value={formatDate(movement.createdAt)} />
        <InfoPair label={t.smReason} value={getSMReasonLabel(movement.reason, t)} />
        <InfoPair label={t.smBatch} value={movement.stockDetail.batchNumber} valueClassName="uppercase" />
        <InfoPair label={t.smQuantity}>
          <div className="flex items-center gap-1.5 text-sm font-medium tabular-nums">
            <span className="text-muted-foreground">{movement.quantityBefore}</span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="text-foreground">{movement.quantityAfter}</span>
            <span className="ml-1 text-muted-foreground">{movement.medicine.unit}</span>
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${getSMTypeBadgeClass(movement.type)}`}
            >
              {movement.type === "IN" ? "+" : "-"}{movement.quantity}
            </span>
          </div>
        </InfoPair>
        {referenceNumber && (
          <InfoPair label={t.smReference} value={referenceNumber} />
        )}
        {movement.description && (
          <InfoPair label={t.smDescription} value={movement.description} />
        )}
        {detail?.createdByUser && (
          <InfoPair label={t.smCreatedBy} value={detail.createdByUser.name} />
        )}
      </div>

      {/* Dates */}
      <DetailDatesCard
        className="mt-auto"
        rows={[{ label: t.created, value: formatDate(movement.createdAt) }]}
      />
    </DetailModal>
  );
}
