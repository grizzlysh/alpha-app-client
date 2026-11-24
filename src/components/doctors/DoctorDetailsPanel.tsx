import type { JSX } from "react";
import { Pencil, Trash2, Stethoscope } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { Doctor } from "@/types/doctor";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/utils/dateHelpers";
import { toDoctorName } from "@/utils/stringHelpers";

export interface DoctorDetailsPanelProps {
  doctor: Doctor;
  t: Translations;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function DoctorDetailsPanel({
  doctor,
  t,
  onClose,
  onEdit,
  onDelete,
}: DoctorDetailsPanelProps): JSX.Element {
  return (
    <DetailModal
      icon={<Stethoscope className="h-4 w-4 text-primary" />}
      title={t.doctorDetailsTitle}
      onClose={onClose}
      actions={[
        {
          label: t.doctorEdit,
          icon: <Pencil className="h-4 w-4" />,
          variant: "outline",
          onClick: onEdit,
        },
        {
          label: t.doctorDelete,
          icon: <Trash2 className="h-4 w-4" />,
          variant: "destructive",
          onClick: onDelete,
        },
      ]}
    >
      {/* Hero */}
      <div className="flex items-center gap-4 px-5 py-6">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10">
          <Stethoscope className="h-7 w-7 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-foreground">{toDoctorName(doctor.name)}</p>
          {doctor.specialty && (
            <p className="mt-0.5 text-sm text-muted-foreground">{doctor.specialty}</p>
          )}
          <div className="mt-1">
            <StatusBadge
              status={doctor.status}
              label={doctor.status === "ACTIVE" ? t.doctorStatusActive : t.doctorStatusInactive}
            />
          </div>
        </div>
      </div>

      <div className="mx-5 border-t border-border" />

      {/* Info pairs */}
      <div className="divide-y divide-border px-5">
        <InfoPair label={t.doctorLicenseNumber} value={doctor.licenseNumber} />
        <InfoPair label={t.doctorClinicName} value={doctor.clinicName} />
        <InfoPair label={t.doctorPhone} value={doctor.phone} />
        {doctor.user && (
          <InfoPair label={t.doctorLinkedUser} value={`${doctor.user.name} (${doctor.user.email})`} />
        )}
      </div>

      {/* Dates */}
      <DetailDatesCard
        className="mt-auto"
        rows={[
          { label: t.doctorRegistered, value: formatDate(doctor.createdAt) },
          { label: t.doctorUpdated, value: formatDate(doctor.updatedAt) },
        ]}
      />
    </DetailModal>
  );
}
