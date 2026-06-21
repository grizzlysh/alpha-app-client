import type { JSX } from "react";
import { ArchiveX, Trash2, Ban } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import type { Translations } from "@/configs/i18n";
import type { StockDisposal } from "@/types/stockDisposal";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getStockDisposal } from "@/service/stockDisposalService";
import {
  getSDStatusLabel,
  getSDReasonLabel,
  getSDInitials,
  getSDAvaterColor,
  canCancel,
  canDelete,
  formatDate,
} from "./stockDisposalUtils";

export interface StockDisposalDetailPanelProps {
  disposal: StockDisposal;
  t: Translations;
  onClose: () => void;
  onEdit: () => void;
  onComplete: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function StockDisposalDetailPanel({
  disposal: listDisposal,
  t,
  onClose,
  onEdit: _onEdit,
  onComplete: _onComplete,
  onCancel,
  onDelete,
}: StockDisposalDetailPanelProps): JSX.Element {
  const { data } = useQuery({
    queryKey: ["stock-disposal", listDisposal.uuid],
    queryFn: () => getStockDisposal(listDisposal.uuid),
    staleTime: 30 * 1000,
  });

  const disposal: StockDisposal = data?.data ?? listDisposal;

  return (
    <DetailModal
      icon={<ArchiveX className="h-4 w-4 text-primary" />}
      title={t.sdDetailsTitle}
      onClose={onClose}
      actions={[
        {
          label: t.sdCancel,
          icon: <Ban className="h-4 w-4" />,
          variant: "destructive",
          onClick: onCancel,
          hidden: !canCancel(disposal.status),
        },
        {
          label: t.sdDelete,
          icon: <Trash2 className="h-4 w-4" />,
          variant: "destructive",
          onClick: onDelete,
          hidden: !canDelete(disposal.status),
        },
      ]}
    >
      {/* Hero */}
      <div className="flex items-center gap-4 px-5 py-6">
        <div
          className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-xs font-bold ${getSDAvaterColor(disposal.disposalNumber)}`}
        >
          {getSDInitials(disposal.disposalNumber)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-foreground">{disposal.disposalNumber}</p>
          <StatusBadge
            status={disposal.status}
            label={getSDStatusLabel(disposal.status, t)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="mx-5 border-t border-border" />

      {/* Info pairs */}
      <div className="divide-y divide-border px-5">
        <InfoPair label={t.sdSignedBy} value={disposal.signedByUser?.name} />
        {disposal.status === "COMPLETED" && (
          <InfoPair
            label={t.sdDisposedAt}
            value={disposal.disposedAt ? formatDate(disposal.disposedAt) : undefined}
          />
        )}
        <InfoPair label={t.sdDescription} value={disposal.description} />
        {disposal.status === "CANCELLED" && (
          <InfoPair label={t.sdCancellationReason} value={disposal.cancellationReason} />
        )}
      </div>

      {/* Items */}
      {disposal.details.length > 0 && (
        <div className="px-5 pb-1 pt-5">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.sdItemsSection}
            <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-primary">
              {disposal.details.length}
            </span>
          </p>
          <div className="space-y-1.5">
            {disposal.details.map((item) => (
              <div
                key={item.uuid}
                className="rounded-lg border border-border bg-muted/30 px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium uppercase text-foreground">
                    {item.medicine.name}
                  </p>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {getSDReasonLabel(item.reason, t)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t.sdBatchLabel}: <span className="uppercase">{item.stockDetail.batchNumber}</span>
                  {" · "}
                  {item.quantityPieces} {item.medicine.unit}
                  {item.quantityBox > 0 && ` · ${item.quantityBox} box`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.sdExpiryLabel}: {formatDate(item.stockDetail.expiryDate)}
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
          { label: t.created, value: formatDate(disposal.createdAt) },
          { label: t.lastUpdated, value: formatDate(disposal.updatedAt) },
        ]}
      />
    </DetailModal>
  );
}
