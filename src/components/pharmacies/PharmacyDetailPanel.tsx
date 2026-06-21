import type { JSX } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Hospital,
  Pencil,
  Trash2,
  Plus,
  MoreVertical,
  CheckCircle2,
  XCircle,
  FileKey,
} from "lucide-react";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Translations } from "@/configs/i18n";
import type { Pharmacy } from "@/types/pharmacy";
import type { BusinessLicense } from "@/types/businessLicense";
import { getBusinessLicenses } from "@/service/businessLicenseService";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  getPharmacyInitials,
  getPharmacyAvatarColor,
  getPharmacyCategoryLabel,
  getPharmacyStatusLabel,
  getBizLicenseStatusLabel,
  formatDate,
} from "./pharmacyUtils";
import { PharmacyBizLicenseFormModal } from "./PharmacyBizLicenseFormModal";
import { PharmacyBizLicenseDeleteModal } from "./PharmacyBizLicenseDeleteModal";

// ── Sub-modal state ───────────────────────────────────────────────────────────

type SubModal =
  | { mode: "create-license" }
  | { mode: "edit-license"; license: BusinessLicense }
  | { mode: "delete-license"; license: BusinessLicense }
  | null;

// ── BizLicenseCard ────────────────────────────────────────────────────────────

interface BizLicenseCardProps {
  license: BusinessLicense;
  t: Translations;
  onEdit: () => void;
  onDelete: () => void;
}

function BizLicenseCard({ license, t, onEdit, onDelete }: BizLicenseCardProps): JSX.Element {
  const isActive = license.status === "ACTIVE";
  return (
    <div className="rounded-xl border border-border bg-card p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium uppercase text-foreground">{license.licenseNumber}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(license.validFrom)} → {formatDate(license.validUntil)}
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <StatusBadge status={license.status} label={getBizLicenseStatusLabel(license.status, t)} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <DropdownMenuItem onClick={onEdit} className="gap-2.5 rounded-lg">
                <Pencil className="h-4 w-4 text-muted-foreground" />
                {t.licenseEdit}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                {t.licenseDelete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-2.5">
        {isActive ? (
          <div className="flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-success" />
            <span className="font-medium text-success">{t.licenseActiveBadge}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{getBizLicenseStatusLabel(license.status, t)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── PharmacyDetailPanel ───────────────────────────────────────────────────────

export interface PharmacyDetailPanelProps {
  pharmacy: Pharmacy;
  t: Translations;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function PharmacyDetailPanel({
  pharmacy,
  t,
  onClose,
  onEdit,
  onDelete,
}: PharmacyDetailPanelProps): JSX.Element {
  const [subModal, setSubModal] = useState<SubModal>(null);

  const { data: licensesData, isLoading: licensesLoading } = useQuery({
    queryKey: ["pharmacy-biz-licenses", pharmacy.uuid],
    queryFn: () => getBusinessLicenses(pharmacy.uuid),
  });

  const licenses = licensesData?.data ?? [];

  function closeSubModal(): void {
    setSubModal(null);
  }

  return (
    <>
      <DetailModal
        icon={<Hospital className="h-4 w-4 text-primary" />}
        title={t.pharmaDetailsTitle}
        onClose={onClose}
        actions={[
          { label: t.pharmaEdit, icon: <Pencil className="h-4 w-4" />, variant: "outline", onClick: onEdit },
          { label: t.pharmaDelete, icon: <Trash2 className="h-4 w-4" />, variant: "destructive", onClick: onDelete },
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
            <p className="text-lg font-bold text-foreground">{pharmacy.name}</p>
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
          <InfoPair label={t.pharmaCategory} value={getPharmacyCategoryLabel(pharmacy.category, t)} />
          <InfoPair label={t.pharmaPhone} value={pharmacy.phone} />
          <InfoPair label={t.pharmaEmail} value={pharmacy.email} />
          <InfoPair label={t.pharmaAddress} value={pharmacy.address} />
          <InfoPair label={t.pharmaCode} value={pharmacy.code} />
        </div>

        <div className="mx-5 border-t border-border" />

        {/* Business Licenses section */}
        <div className="px-5 py-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileKey className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">{t.bizLicenseTitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setSubModal({ mode: "create-license" })}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10 whitespace-nowrap"
            >
              <Plus className="h-3 w-3" />
              {t.add}
            </button>
          </div>

          {licensesLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : licenses.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-8 text-center">
              <FileKey className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm font-medium text-muted-foreground">{t.bizLicenseTitle}</p>
              <p className="text-xs text-muted-foreground/60">{t.bizLicenseDesc}</p>
              <button
                type="button"
                onClick={() => setSubModal({ mode: "create-license" })}
                className="mt-1 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <Plus className="h-3.5 w-3.5" />
                {t.add}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {licenses.map((license) => (
                <BizLicenseCard
                  key={license.uuid}
                  license={license}
                  t={t}
                  onEdit={() => setSubModal({ mode: "edit-license", license })}
                  onDelete={() => setSubModal({ mode: "delete-license", license })}
                />
              ))}
            </div>
          )}
        </div>

        {/* Dates */}
        <DetailDatesCard
          className="mt-auto"
          rows={[
            { label: t.created, value: formatDate(pharmacy.createdAt) },
            { label: t.lastUpdated, value: formatDate(pharmacy.updatedAt) },
          ]}
        />
      </DetailModal>

      {subModal?.mode === "create-license" && (
        <PharmacyBizLicenseFormModal
          mode="create"
          pharmacyUuid={pharmacy.uuid}
          onClose={closeSubModal}
          onSuccess={closeSubModal}
        />
      )}
      {subModal?.mode === "edit-license" && (
        <PharmacyBizLicenseFormModal
          mode="edit"
          pharmacyUuid={pharmacy.uuid}
          license={subModal.license}
          onClose={closeSubModal}
          onSuccess={closeSubModal}
        />
      )}
      {subModal?.mode === "delete-license" && (
        <PharmacyBizLicenseDeleteModal
          pharmacyUuid={pharmacy.uuid}
          license={subModal.license}
          onClose={closeSubModal}
          onSuccess={closeSubModal}
        />
      )}
    </>
  );
}
