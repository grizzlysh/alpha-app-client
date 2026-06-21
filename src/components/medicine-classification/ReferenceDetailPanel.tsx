import type { JSX } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useLanguage } from "@/hooks/useLanguage";
import type { ReferenceItem, ReferenceLabels } from "./referenceTypes";
import { getInitials, getAvatarColor, formatDate } from "./referenceUtils";

// ── ReferenceDetailPanel ──────────────────────────────────────────────────────

export interface ReferenceDetailPanelProps {
  item: ReferenceItem;
  labels: ReferenceLabels;
  icon: JSX.Element;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ReferenceDetailPanel({
  item,
  labels,
  icon,
  onClose,
  onEdit,
  onDelete,
}: ReferenceDetailPanelProps): JSX.Element {
  const { t } = useLanguage();
  return (
    <DetailModal
      icon={icon}
      title={labels.detailsTitle}
      onClose={onClose}
      actions={[
        { label: labels.editBtn, icon: <Pencil className="h-4 w-4" />, variant: "outline", onClick: onEdit },
        { label: labels.deleteBtn, icon: <Trash2 className="h-4 w-4" />, variant: "destructive", onClick: onDelete },
      ]}
    >
      {/* Hero */}
      <div className="flex items-center gap-4 px-5 py-6">
        <div
          className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${getAvatarColor(item.name)}`}
        >
          {getInitials(item.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-bold text-foreground">{item.name}</p>
          <StatusBadge
            status={item.status}
            label={item.status.toUpperCase() === "ACTIVE" ? labels.statusActive : labels.statusInactive}
            className="mt-1"
          />
        </div>
      </div>

      <div className="mx-5 border-t border-border" />

      {/* Info pairs */}
      <div className="divide-y divide-border px-5">
        <InfoPair label={labels.statusColumn}>
          <StatusBadge
            status={item.status}
            label={item.status.toUpperCase() === "ACTIVE" ? labels.statusActive : labels.statusInactive}
          />
        </InfoPair>

        {item.requiredPrescription !== undefined && labels.requiredPrescriptionLabel && (
          <InfoPair label={labels.requiredPrescriptionLabel}>
            <span className="text-sm text-foreground">
              {item.requiredPrescription
                ? labels.requiredPrescriptionYes
                : labels.requiredPrescriptionNo}
            </span>
          </InfoPair>
        )}
      </div>

      {/* Dates */}
      <DetailDatesCard
        className="mt-auto"
        rows={[
          { label: t.created, value: formatDate(item.createdAt) },
          { label: t.lastUpdated, value: formatDate(item.updatedAt) },
        ]}
      />
    </DetailModal>
  );
}
