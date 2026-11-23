import type { JSX } from "react";
import { Pencil, Pill, Trash2 } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { Medicine } from "@/types/medicine";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getInitials, getAvatarColor, formatDate } from "./medicineUtils";
import { useNameFormat } from "@/hooks/useNameFormat";

// ── MedicineDetailPanel ───────────────────────────────────────────────────────

export interface MedicineDetailPanelProps {
  medicine: Medicine;
  t: Translations;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function MedicineDetailPanel({
  medicine,
  t,
  onClose,
  onEdit,
  onDelete,
}: MedicineDetailPanelProps): JSX.Element {
  const fmt = useNameFormat();
  const isActive = medicine.status.toUpperCase() === "ACTIVE";

  return (
    <DetailModal
      icon={<Pill className="h-4 w-4 text-primary" />}
      title={t.medicineDetailsTitle}
      onClose={onClose}
      actions={[
        { label: t.medicineEdit, icon: <Pencil className="h-4 w-4" />, variant: "outline", onClick: onEdit },
        { label: t.medicineDelete, icon: <Trash2 className="h-4 w-4" />, variant: "destructive", onClick: onDelete },
      ]}
    >
      {/* Hero */}
      <div className="flex items-center gap-4 px-5 py-6">
        <div
          className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${getAvatarColor(medicine.name)}`}
        >
          {getInitials(medicine.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold name-case text-foreground">{medicine.name}</p>
          <StatusBadge
            status={medicine.status}
            label={isActive ? t.medicineStatusActive : t.medicineStatusInactive}
            className="mt-1"
          />
        </div>
      </div>

      <div className="mx-5 border-t border-border" />

      {/* Info pairs */}
      <div className="divide-y divide-border px-5">
        <InfoPair label={t.medicineShapeLabel} value={medicine.medicineShape?.name != null ? fmt(medicine.medicineShape.name) : undefined} />
        <InfoPair label={t.medicineTypeLabel} value={medicine.medicineType?.name != null ? fmt(medicine.medicineType.name) : undefined} />
        <InfoPair label={t.medicineClassLabel} value={medicine.medicineClass?.name != null ? fmt(medicine.medicineClass.name) : undefined} />
        <InfoPair label={t.medicineStrength} value={medicine.strength || undefined} />
        {medicine.variant && <InfoPair label={t.medicineVariant} value={medicine.variant} />}
        <InfoPair label={t.medicineUnit} value={medicine.unit} />
        <InfoPair label={t.medicineBarcode} value={medicine.barcode} valueClassName="font-mono" />
        {medicine.ingredients.length > 0 && (
          <div className="py-2.5">
            <span className="flex-shrink-0 text-sm text-muted-foreground">{t.medicineIngredients}</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {medicine.ingredients.map((ing) => (
                <span
                  key={ing.uuid}
                  className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {ing.name}
                  {ing.strength && <span className="ml-1 text-muted-foreground">{ing.strength}</span>}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dates */}
      <DetailDatesCard
        className="mt-auto"
        rows={[
          { label: t.created, value: formatDate(medicine.createdAt) },
          { label: t.lastUpdated, value: formatDate(medicine.updatedAt) },
        ]}
      />
    </DetailModal>
  );
}
