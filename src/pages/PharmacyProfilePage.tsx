import type { JSX } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Hospital, Loader2, Pencil, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { PharmacyFormModal } from "@/components/pharmacies/PharmacyFormModal";
import { PharmacyLicensesSection } from "@/components/pharmacies/PharmacyLicensesSection";
import {
  formatDate,
  getPharmacyAvatarColor,
  getPharmacyCategoryLabel,
  getPharmacyInitials,
  getPharmacyStatusLabel,
} from "@/components/pharmacies/pharmacyUtils";
import { useLanguage } from "@/hooks/useLanguage";
import { useCan } from "@/hooks/usePermission";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { getPharmacy } from "@/service/pharmacyService";
import { cn } from "@/utils/cn";
import type { RootState } from "@/store";

/**
 * The pharmacy currently selected — like the user's own profile, but for the
 * pharmacy: its details, Head Pharmacist and business licenses. Other branches
 * are not listed here (that is the platform admin's Pharmacies page).
 */
export default function PharmacyProfilePage(): JSX.Element {
  const { t } = useLanguage();
  const can = useCan();
  const pageTitleRef = useScrollAwareTitle();
  const pharmacyUuid = useSelector((s: RootState) => s.auth.currentPharmacy?.uuid);
  const [editing, setEditing] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pharmacy", pharmacyUuid],
    queryFn: () => getPharmacy(pharmacyUuid!),
    enabled: !!pharmacyUuid,
  });
  const pharmacy = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h2 ref={pageTitleRef} className="text-2xl font-bold tracking-tight text-foreground">
          {t.navPharmacyProfile}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.pharmacyProfileSubtitle}</p>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError || !pharmacy ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">{t.unexpectedError}</Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
          <div className="space-y-6">
            {/* Identity */}
            <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div
                className={cn(
                  "flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-lg font-bold",
                  getPharmacyAvatarColor(pharmacy.name)
                )}
              >
                {getPharmacyInitials(pharmacy.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xl font-bold uppercase text-foreground">{pharmacy.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  <span className="font-mono">{pharmacy.code}</span> · {getPharmacyCategoryLabel(pharmacy.category, t)}
                </p>
                <StatusBadge status={pharmacy.status} label={getPharmacyStatusLabel(pharmacy.status, t)} className="mt-2" />
              </div>
              {can("pharmacies.update") && (
                <Button variant="outline" className="gap-2 rounded-xl sm:self-start" onClick={() => setEditing(true)}>
                  <Pencil className="h-4 w-4" />
                  {t.pharmaEdit}
                </Button>
              )}
            </Card>

            {/* Details */}
            <Card className="p-5">
              <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Hospital className="h-4 w-4 text-muted-foreground" aria-hidden />
                {t.pharmaInfoTitle}
              </p>
              <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                <Field label={t.pharmaPhone} value={pharmacy.phone} />
                <Field label={t.pharmaEmail} value={pharmacy.email} />
                <Field label={t.pharmaAddress} value={pharmacy.address} className="sm:col-span-2" />
                <Field label={t.pharmaLocation} value={pharmacy.location} />
                <Field label={t.roleTypeHeadPharmacist} value={pharmacy.pharmacistInCharge?.user.name ?? null}>
                  {!pharmacy.pharmacistInCharge && (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-warning">
                      <ShieldAlert className="h-4 w-4" aria-hidden />
                      {t.pharmaNoHeadPharmacist}
                    </span>
                  )}
                </Field>
                <Field label={t.created} value={formatDate(pharmacy.createdAt)} />
                <Field label={t.lastUpdated} value={formatDate(pharmacy.updatedAt)} />
              </dl>
            </Card>
          </div>

          {/* Business licenses */}
          <Card className="h-fit">
            <PharmacyLicensesSection
              pharmacy={pharmacy}
              t={t}
              canCreate={can("licenses.create")}
              canUpdate={can("licenses.update")}
              canDelete={can("licenses.delete")}
            />
          </Card>
        </div>
      )}

      {editing && pharmacy && (
        <PharmacyFormModal
          mode="edit"
          pharmacy={pharmacy}
          onClose={() => setEditing(false)}
          onSuccess={() => {
            toast.success(<LiveToastMessage getMessage={(tr) => tr.pharmaUpdateSuccess} />);
            setEditing(false);
          }}
        />
      )}
    </div>
  );
}

function Field({
  label,
  value,
  className,
  children,
}: {
  label: string;
  value: string | null;
  className?: string;
  children?: JSX.Element | false;
}): JSX.Element {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5">
        {children ||
          (value ? (
            <span className="break-words text-sm font-medium text-foreground">{value}</span>
          ) : (
            <span className="text-sm text-muted-foreground/50">—</span>
          ))}
      </dd>
    </div>
  );
}
