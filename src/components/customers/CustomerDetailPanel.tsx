import type { JSX } from "react";
import { Pencil, Trash2, UserRound } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { Customer } from "@/types/customer";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getInitials, getAvatarColor, formatDate } from "./customerUtils";

// ── CustomerDetailPanel ───────────────────────────────────────────────────────

export interface CustomerDetailPanelProps {
  customer: Customer;
  t: Translations;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CustomerDetailPanel({
  customer,
  t,
  onClose,
  onEdit,
  onDelete,
}: CustomerDetailPanelProps): JSX.Element {
  return (
    <DetailModal
      icon={<UserRound className="h-4 w-4 text-primary" />}
      title={t.customerDetailsTitle}
      onClose={onClose}
      actions={[
        {
          label: t.customerEdit,
          icon: <Pencil className="h-4 w-4" />,
          variant: "outline",
          onClick: onEdit,
          hidden: customer.isWalkIn,
        },
        {
          label: t.customerDelete,
          icon: <Trash2 className="h-4 w-4" />,
          variant: "destructive",
          onClick: onDelete,
          hidden: customer.isWalkIn,
        },
      ]}
    >
      {/* Hero */}
      <div className="flex items-center gap-4 px-5 py-6">
        <div
          className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${getAvatarColor(customer.name)}`}
        >
          {getInitials(customer.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold uppercase text-foreground">{customer.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <StatusBadge
              status={customer.status}
              label={customer.status === "ACTIVE" ? t.customerStatusActive : t.customerStatusInactive}
            />
            {customer.isWalkIn && (
              <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {t.customerWalkInBadge}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-5 border-t border-border" />

      {/* Info pairs */}
      <div className="divide-y divide-border px-5">
        <InfoPair label={t.customerPhone} value={customer.phone} />
        <InfoPair label={t.customerAddress} value={customer.address} />
        <InfoPair label={t.customerDescription} value={customer.description} />
      </div>

      {/* Dates */}
      <DetailDatesCard
        className="mt-auto"
        rows={[
          { label: t.created, value: formatDate(customer.createdAt) },
          { label: t.lastUpdated, value: formatDate(customer.updatedAt) },
        ]}
      />
    </DetailModal>
  );
}
