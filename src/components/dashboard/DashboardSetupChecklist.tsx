import type { JSX } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ChevronRight, Circle, Rocket, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { getPharmacySetupStatus } from "@/service/pharmacyService";
import { cn } from "@/utils/cn";

const dismissKey = (pharmacyUuid: string) => `setup-checklist-dismissed:${pharmacyUuid}`;

function readDismissed(pharmacyUuid: string): boolean {
  try {
    return localStorage.getItem(dismissKey(pharmacyUuid)) === "1";
  } catch {
    return false;
  }
}

/**
 * What a new pharmacy still has to set up, shown to its owner/admin on the
 * dashboard until everything is done (or they hide it).
 */
export function DashboardSetupChecklist({ pharmacyUuid }: { pharmacyUuid: string }): JSX.Element | null {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(() => readDismissed(pharmacyUuid));

  const { data } = useQuery({
    queryKey: ["pharmacy-setup", pharmacyUuid],
    queryFn: getPharmacySetupStatus,
    staleTime: 60_000,
    enabled: !dismissed,
  });
  const s = data?.data;
  if (dismissed || !s) return null;

  const steps = [
    { done: s.hasActiveLicense, label: t.setupLicense, to: "/pharmacies" },
    { done: s.hasHeadPharmacist, label: t.setupHeadPharmacist, to: "/users" },
    { done: s.staffCount > 0, label: t.setupStaff, to: "/users" },
    { done: s.medicineCount > 0, label: t.setupMedicines, to: "/medicines" },
    { done: s.distributorCount > 0, label: t.setupDistributors, to: "/distributors" },
    { done: s.storageCabinetCount > 0, label: t.setupStorage, to: "/storage" },
    { done: s.stockedMedicineCount > 0, label: t.setupStock, to: "/stock" },
  ];
  const doneCount = steps.filter((x) => x.done).length;
  if (doneCount === steps.length) return null;

  function hide(): void {
    try {
      localStorage.setItem(dismissKey(pharmacyUuid), "1");
    } catch {
      // Storage unavailable: hide for this visit only.
    }
    setDismissed(true);
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-3 border-b border-border px-5 py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Rocket className="h-4 w-4 text-primary" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground">{t.setupTitle}</h3>
          <p className="text-xs text-muted-foreground">
            {t.setupProgress.replace("{done}", String(doneCount)).replace("{total}", String(steps.length))}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
          </div>
        </div>
        <button
          type="button"
          onClick={hide}
          aria-label={t.setupHide}
          title={t.setupHide}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <ul className="grid divide-y divide-border sm:grid-cols-2 sm:divide-y-0">
        {steps.map((step) => (
          <li key={step.label}>
            <Link
              to={step.to}
              className={cn(
                "flex items-center gap-2.5 px-5 py-2.5 text-sm transition-colors hover:bg-muted/40",
                step.done ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {step.done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-muted-foreground/50" aria-hidden />
              )}
              <span className={cn("min-w-0 flex-1", step.done && "line-through decoration-muted-foreground/40")}>{step.label}</span>
              {!step.done && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
