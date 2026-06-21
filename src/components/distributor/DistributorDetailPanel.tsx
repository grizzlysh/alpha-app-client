import type { JSX } from "react";
import { Pencil, Trash2, Truck } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { Distributor } from "@/types/distributor";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import { getInitials, getAvatarColor, formatDate } from "./distributorUtils";

// ── DistributorDetailPanel ────────────────────────────────────────────────────

export interface DistributorDetailPanelProps {
  distributor: Distributor;
  t: Translations;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function DistributorDetailPanel({
  distributor,
  t,
  onClose,
  onEdit,
  onDelete,
}: DistributorDetailPanelProps): JSX.Element {
  return (
    <DetailModal
      icon={<Truck className="h-4 w-4 text-primary" />}
      title={t.distributorDetailsTitle}
      onClose={onClose}
      actions={[
        { label: t.distributorEdit, icon: <Pencil className="h-4 w-4" />, variant: "outline", onClick: onEdit },
        { label: t.distributorDelete, icon: <Trash2 className="h-4 w-4" />, variant: "destructive", onClick: onDelete },
      ]}
    >
      {/* Hero */}
      <div className="flex items-center gap-4 px-5 py-6">
        <div
          className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${getAvatarColor(distributor.name)}`}
        >
          {getInitials(distributor.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold uppercase text-foreground">
            {distributor.name}
          </p>
        </div>
      </div>

      <div className="mx-5 border-t border-border" />

      {/* Info pairs */}
      <div className="divide-y divide-border px-5">
        <InfoPair label={t.distributorContactPerson} value={distributor.contactPerson} />
        <InfoPair label={t.distributorPhone} value={distributor.phone} />
        <InfoPair label={t.distributorPermitNumber} value={distributor.permitNumber} />
        <InfoPair label={t.distributorEmail} value={distributor.email} />
        <InfoPair label={t.distributorAddress} value={distributor.address} />
        <InfoPair label={t.distributorNotes} value={distributor.description} />
      </div>

      {/* Dates */}
      <DetailDatesCard
        className="mt-auto"
        rows={[
          { label: t.created, value: formatDate(distributor.createdAt) },
          { label: t.lastUpdated, value: formatDate(distributor.updatedAt) },
        ]}
      />
    </DetailModal>
  );
}
