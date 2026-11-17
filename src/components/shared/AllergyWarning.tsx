import type { JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { checkCustomerAllergies, type AllergyCheckItem } from "@/service/customerService";
import { SEVERITY_DOT } from "@/components/medical-records/severity";
import { cn } from "@/utils/cn";

/**
 * Warns when medicines in a cart or prescription clash with the customer's
 * recorded allergies (by medicine name or ingredient). Advisory only — the
 * pharmacist decides; nothing is blocked.
 */
export function AllergyWarning({
  customerUuid,
  items,
  className,
}: {
  customerUuid: string | null | undefined;
  items: AllergyCheckItem[];
  className?: string;
}): JSX.Element | null {
  const { t } = useLanguage();
  // One entry per distinct medicine, stable order, so the query key only changes with the content.
  const keyed = new Map<string, AllergyCheckItem>();
  for (const i of items) {
    const k = i.medicineUuid || i.medicineName?.trim().toLowerCase();
    if (k && !keyed.has(k)) keyed.set(k, i);
  }
  const list = [...keyed.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  const key = list.map((i) => i.medicineUuid || i.medicineName).join("|");
  const { data } = useQuery({
    queryKey: ["allergy-check", customerUuid, key],
    queryFn: () => checkCustomerAllergies(customerUuid!, list),
    enabled: !!customerUuid && list.length > 0,
    staleTime: 30_000,
  });
  const conflicts = (customerUuid && list.length > 0 ? data?.data : null) ?? [];
  if (conflicts.length === 0) return null;

  const severity = { MILD: t.medicalRecordAllergySeverityMild, MODERATE: t.medicalRecordAllergySeverityModerate, SEVERE: t.medicalRecordAllergySeveritySevere };

  return (
    <div role="alert" className={cn("rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5", className)}>
      <p className="flex items-center gap-1.5 text-sm font-semibold text-destructive">
        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
        {t.allergyWarningTitle}
      </p>
      <ul className="mt-1.5 space-y-1 text-xs">
        {conflicts.map((c, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span className={cn("mt-1 h-1.5 w-1.5 shrink-0 rounded-full", SEVERITY_DOT[c.severity])} aria-hidden />
            <span className="text-foreground">
              <span className="name-case font-medium">{c.medicineName}</span>
              {" — "}
              {t.allergyWarningLine.replace("{allergen}", c.allergenName).replace("{severity}", severity[c.severity].toLowerCase())}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
