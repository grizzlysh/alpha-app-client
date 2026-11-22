import type { JSX } from "react";
import { Hospital, Pencil, Trash2 } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { Pharmacy } from "@/types/pharmacy";
import {
  DetailModal,
  InfoPair,
  DetailDatesCard,
} from "@/components/shared/DetailModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  getPharmacyInitials,
  getPharmacyAvatarColor,
  getPharmacyCategoryLabel,
  getPharmacyStatusLabel,
  formatDate,
} from "./pharmacyUtils";
import { PharmacyLicensesSection } from "./PharmacyLicensesSection";

// ── PharmacyDetailPanel ───────────────────────────────────────────────────────

export interface PharmacyDetailPanelProps {
  pharmacy: Pharmacy;
  t: Translations;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PharmacyDetailPanel({
  pharmacy,
  t,
  onClose,
  onEdit,
  onDelete,
}: PharmacyDetailPanelProps): JSX.Element {
  return (
    <DetailModal
      icon={<Hospital className="h-4 w-4 text-primary" />}
      title={t.pharmaDetailsTitle}
      onClose={onClose}
      actions={[
        {
          label: t.pharmaEdit,
          icon: <Pencil className="h-4 w-4" />,
          variant: "outline",
          onClick: onEdit,
        },
        {
          label: t.pharmaDelete,
          icon: <Trash2 className="h-4 w-4" />,
          variant: "destructive",
          onClick: onDelete,
        },
      ]}
    >
      {/* Hero */}
      <div className="flex items-center gap-4 px-5 py-6">
        <div
          className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${getPharmacyAvatarColor(pharmacy.name)}`}
        >
          {getPharmacyInitials(pharmacy.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold uppercase text-foreground">
            {pharmacy.name}
          </p>
          <StatusBadge
            status={pharmacy.status}
            label={getPharmacyStatusLabel(pharmacy.status, t)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="mx-5 border-t border-border" />

      {/* Info pairs */}
      <div className="divide-y divide-border px-5">
        <InfoPair
          label={t.pharmaCategory}
          value={getPharmacyCategoryLabel(pharmacy.category, t)}
        />
        <InfoPair label={t.pharmaPhone} value={pharmacy.phone} />
        <InfoPair label={t.pharmaEmail} value={pharmacy.email} />
        <InfoPair label={t.pharmaAddress} value={pharmacy.address} />
        <InfoPair label={t.pharmaLocation} value={pharmacy.location} />
        <InfoPair label={t.pharmaCode} value={pharmacy.code} />
      </div>

      <div className="mx-5 border-t border-border" />

      <PharmacyLicensesSection pharmacy={pharmacy} t={t} />

      {/* Dates */}
      <DetailDatesCard
        className="mt-auto"
        rows={[
          { label: t.created, value: formatDate(pharmacy.createdAt) },
          { label: t.lastUpdated, value: formatDate(pharmacy.updatedAt) },
        ]}
      />
    </DetailModal>
  );
}
