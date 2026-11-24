import type { JSX } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileKey, Plus } from "lucide-react";

import type { Translations } from "@/configs/i18n";
import type { BusinessLicense } from "@/types/businessLicense";
import { getBusinessLicenses } from "@/service/businessLicenseService";
import { BizLicenseCard } from "./BizLicenseCard";
import { PharmacyBizLicenseFormModal } from "./PharmacyBizLicenseFormModal";
import { PharmacyBizLicenseDeleteModal } from "./PharmacyBizLicenseDeleteModal";

type SubModal =
  | { mode: "create-license" }
  | { mode: "edit-license"; license: BusinessLicense }
  | { mode: "delete-license"; license: BusinessLicense }
  | null;

export interface PharmacyLicensesSectionProps {
  pharmacy: { uuid: string };
  t: Translations;
  /** Hide the add / edit / delete actions the user is not allowed to use. */
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  className?: string;
}

/** A pharmacy's business licenses (SIA) with add / edit / delete. */
export function PharmacyLicensesSection({
  pharmacy,
  t,
  canCreate = true,
  canUpdate = true,
  canDelete = true,
  className = "px-5 py-5",
}: PharmacyLicensesSectionProps): JSX.Element {
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
      {/* Business Licenses section */}
      <div className={className}>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileKey className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">
              {t.bizLicenseTitle}
            </p>
          </div>
          {canCreate && (
            <button
              type="button"
              onClick={() => setSubModal({ mode: "create-license" })}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10 whitespace-nowrap"
            >
              <Plus className="h-3 w-3" />
              {t.add}
            </button>
          )}
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
            <p className="text-sm font-medium text-muted-foreground">
              {t.bizLicenseTitle}
            </p>
            <p className="text-xs text-muted-foreground/60">
              {t.bizLicenseDesc}
            </p>
            {canCreate && (
              <button
                type="button"
                onClick={() => setSubModal({ mode: "create-license" })}
                className="mt-1 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <Plus className="h-3.5 w-3.5" />
                {t.add}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {licenses.map((license) => (
              <BizLicenseCard
                key={license.uuid}
                license={license}
                t={t}
                onEdit={
                  canUpdate
                    ? () => setSubModal({ mode: "edit-license", license })
                    : undefined
                }
                onDelete={
                  canDelete
                    ? () => setSubModal({ mode: "delete-license", license })
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>

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
