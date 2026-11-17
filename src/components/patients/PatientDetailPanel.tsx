import type { JSX } from "react";
import { Pencil, Trash2, UserRound } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { Patient } from "@/types/patient";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getInitials, getAvatarColor, formatDate } from "./patientUtils";

// ── Section divider ───────────────────────────────────────────────────────────

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

// ── PatientDetailPanel ───────────────────────────────────────────────────────

export interface PatientDetailPanelProps {
  patient: Patient;
  t: Translations;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PatientDetailPanel({
  patient,
  t,
  onClose,
  onEdit,
  onDelete,
}: PatientDetailPanelProps): JSX.Element {
  const isPatient = patient.partyType === "PATIENT";
  const isProfessional = patient.partyType === "PROFESSIONAL";

  function getPartyTypeLabel(): string {
    if (isPatient) return t.patientPartyTypePatient;
    if (isProfessional) return t.patientPartyTypeProfessional;
    return patient.partyType;
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
      title={t.patientDetailsTitle}
      onClose={onClose}
      actions={[
        {
          label: t.patientEdit,
          icon: <Pencil className="h-4 w-4" />,
          variant: "outline",
          onClick: onEdit,
          hidden: patient.isWalkIn,
        },
        {
          label: t.patientDelete,
          icon: <Trash2 className="h-4 w-4" />,
          variant: "destructive",
          onClick: onDelete,
          hidden: patient.isWalkIn,
        },
      ]}
    >
      {/* Hero */}
      <div className="flex items-center gap-4 px-5 py-6">
        <div
          className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${getAvatarColor(patient.name)}`}
        >
          {getInitials(patient.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold name-case text-foreground">{patient.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <StatusBadge
              status={patient.status}
              label={patient.status === "ACTIVE" ? t.patientStatusActive : t.patientStatusInactive}
            />
            <span className="inline-block rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
              {getPartyTypeLabel()}
            </span>
            {patient.isWalkIn && (
              <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {t.patientWalkInBadge}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-5 border-t border-border" />

      {/* General info pairs */}
      <div className="divide-y divide-border px-5">
        <InfoPair label={t.patientPhone} value={patient.phone} />
        <InfoPair label={t.patientAddress} value={patient.address} />
        <InfoPair label={t.patientDescription} value={patient.description} />
      </div>

      {/* Patient detail section */}
      {isPatient && patient.patientDetail && (
        <>
          <SectionTitle title={t.patientDetailSectionTitle} />
          <div className="divide-y divide-border px-5">
            <InfoPair label={t.patientNik} value={patient.patientDetail.nik} />
            <InfoPair label={t.patientGender} value={formatGender(patient.patientDetail.gender)} />
            <InfoPair label={t.patientDateOfBirth} value={formatDob(patient.patientDetail.dateOfBirth)} />
            <InfoPair label={t.patientBpjsNumber} value={patient.patientDetail.bpjsNumber} />
            <InfoPair label={t.patientMedicalRecordNumber} value={patient.patientDetail.medicalRecordNumber} />
          </div>
        </>
      )}

      {/* Professional detail section */}
      {isProfessional && patient.professionalDetail && (
        <>
          <SectionTitle title={t.professionalDetailSectionTitle} />
          <div className="divide-y divide-border px-5">
            <InfoPair label={t.professionalProfession} value={patient.professionalDetail.profession} />
            <InfoPair label={t.professionalStrNumber} value={patient.professionalDetail.strNumber} />
            <InfoPair label={t.professionalSipNumber} value={patient.professionalDetail.sipNumber} />
          </div>
        </>
      )}

      {/* Dates */}
      <DetailDatesCard
        className="mt-auto"
        rows={[
          { label: t.created, value: formatDate(patient.createdAt) },
          { label: t.lastUpdated, value: formatDate(patient.updatedAt) },
        ]}
      />
    </DetailModal>
  );
}
