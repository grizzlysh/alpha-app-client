import type { JSX } from "react";
import type { LucideIcon } from "lucide-react";
import { Pencil } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { Parameter } from "@/types/parameters";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import { formatDate } from "./parameterUtils";

// ── ParameterDetailPanel ──────────────────────────────────────────────────────

export interface ParameterDetailPanelProps {
  parameter: Parameter;
  t: Translations;
  icon: LucideIcon;
  onClose: () => void;
  onEdit: () => void;
}

export function ParameterDetailPanel({
  parameter,
  t,
  icon: Icon,
  onClose,
  onEdit,
}: ParameterDetailPanelProps): JSX.Element {
  return (
    <DetailModal
      icon={<Icon className="h-4 w-4 text-primary" />}
      title={t.paramDetailsTitle}
      onClose={onClose}
      actions={[
        { label: t.paramEdit, icon: <Pencil className="h-4 w-4" />, onClick: onEdit },
      ]}
    >
      {/* Hero */}
      <div className="flex items-center gap-4 px-5 py-6">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10">
          <Icon className="h-7 w-7 text-primary/60" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-base font-semibold text-foreground">
            {parameter.key}
          </p>
        </div>
      </div>

      <div className="mx-5 border-t border-border" />

      {/* Info pairs */}
      <div className="divide-y divide-border px-5">
        <InfoPair label={t.paramKey} value={parameter.key} />
        <InfoPair label={t.paramValue} value={parameter.value} />
        <InfoPair label={t.paramDescription} value={parameter.description} />
      </div>

      {/* Dates */}
      <DetailDatesCard
        className="mt-auto"
        rows={[
          { label: t.created, value: formatDate(parameter.createdAt) },
          { label: t.lastUpdated, value: formatDate(parameter.updatedAt) },
        ]}
      />
    </DetailModal>
  );
}
