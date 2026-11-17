import type { JSX } from "react";
import { Pencil, Trash2, UserRound } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { Customer } from "@/types/customer";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getInitials, getAvatarColor, formatDate } from "./customerUtils";
import { PurchaseHistory } from "./PurchaseHistory";
import { useCan } from "@/hooks/usePermission";

function SectionTitle({ title }: { title: string }): JSX.Element {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </span>
      <div className="flex-1 border-t border-border" />
    </div>
  );
}

export interface CustomerDetailPanelProps {
  customer: Customer;
  t: Translations;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CustomerDetailPanel({
  customer,
  t,
  onClose,
  onEdit,
  onDelete,
}: CustomerDetailPanelProps): JSX.Element {
  const can = useCan();
  const showPurchases = !customer.isWalkIn && can("sales.read");
  const isPatient = customer.customerType === "PATIENT";
  const isProfessional = customer.customerType === "PROFESSIONAL";

  function getTypeLabel(): string {
    if (isPatient) return t.customerTypePatient;
    if (isProfessional) return t.customerTypeProfessional;
    return customer.customerType;
  }

  function formatGender(gender: string | null): string | null {
    if (!gender) return null;
    return gender === "MALE" ? t.patientGenderMale : t.patientGenderFemale;
  }

  function formatDob(dob: string | null): string | null {
    if (!dob) return null;
    return formatDate(dob);
  }

  return (
    <DetailModal
      icon={<UserRound className="h-4 w-4 text-primary" />}
      title={t.customerDetailsTitle}
      onClose={onClose}
      className={showPurchases ? "sm:max-w-md" : undefined}
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
              label={customer.status === "ACTIVE" ? t.patientStatusActive : t.patientStatusInactive}
            />
            <span className="inline-block rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
              {getTypeLabel()}
            </span>
            {customer.isWalkIn && (
              <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {t.patientWalkInBadge}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-5 border-t border-border" />

      {/* General info */}
      <div className="divide-y divide-border px-5">
        <InfoPair label={t.patientPhone} value={customer.phone} />
        <InfoPair label={t.patientAddress} value={customer.address} />
        <InfoPair label={t.patientDescription} value={customer.description} />
      </div>

      {/* Patient detail section */}
      {isPatient && (
        <>
          <SectionTitle title={t.patientDetailSectionTitle} />
          <div className="divide-y divide-border px-5">
            {customer.medicalRecord && (
              <InfoPair label={t.customerMedicalRecordNumber} value={customer.medicalRecord.number} />
            )}
            <InfoPair label={t.patientNik} value={customer.patientDetail?.nik ?? null} />
            <InfoPair label={t.patientGender} value={formatGender(customer.patientDetail?.gender ?? null)} />
            <InfoPair label={t.patientDateOfBirth} value={formatDob(customer.patientDetail?.dateOfBirth ?? null)} />
            <InfoPair label={t.patientBpjsNumber} value={customer.patientDetail?.bpjsNumber ?? null} />
          </div>
        </>
      )}

      {/* Professional detail section */}
      {isProfessional && customer.professionalDetail && (
        <>
          <SectionTitle title={t.professionalDetailSectionTitle} />
          <div className="divide-y divide-border px-5">
            <InfoPair label={t.professionalProfession} value={customer.professionalDetail.profession} />
            <InfoPair label={t.professionalStrNumber} value={customer.professionalDetail.strNumber} />
            <InfoPair label={t.professionalSipNumber} value={customer.professionalDetail.sipNumber} />
          </div>
        </>
      )}

      {showPurchases && (
        <>
          <SectionTitle title={t.purchaseHistoryTitle} />
          <div className="px-5 pb-6">
            <PurchaseHistory customerUuid={customer.uuid} />
          </div>
        </>
      )}

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
