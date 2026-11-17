import type { JSX } from "react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Plus, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AllergyFormModal } from "@/components/medical-records/AllergyFormModal";
import { SEVERITY_DOT, sortBySeverity } from "@/components/medical-records/severity";
import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import type { Allergy } from "@/types/medicalRecord";

/**
 * The patient's allergies, always shown first. With `canManage` (nurse at
 * triage, doctor during the exam) each chip opens the edit form and new ones
 * can be added without leaving the queue.
 */
export function PatientAllergies({
  customerUuid,
  allergies,
  canManage,
  t,
}: {
  customerUuid: string;
  allergies: Allergy[];
  canManage: boolean;
  t: Translations;
}): JSX.Element {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Allergy | "new" | null>(null);
  const sorted = sortBySeverity(allergies);
  const hasSevere = sorted.some((a) => a.severity === "SEVERE");

  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3",
        sorted.length === 0
          ? "border-border bg-muted/20"
          : hasSevere
            ? "border-destructive/40 bg-destructive/5"
            : "border-amber-300 bg-amber-50/60 dark:border-amber-700/60 dark:bg-amber-950/20"
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          {sorted.length === 0 ? (
            <ShieldCheck className="h-4 w-4 text-muted-foreground" aria-hidden />
          ) : (
            <AlertTriangle className={cn("h-4 w-4", hasSevere ? "text-destructive" : "text-amber-600")} aria-hidden />
          )}
          {sorted.length === 0 ? t.examNoAllergies : t.examAllergies}
        </p>

        {sorted.length > 0 && (
          <ul className="flex flex-1 flex-wrap gap-1.5">
            {sorted.map((a) => {
              const chip = (
                <>
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", SEVERITY_DOT[a.severity])} aria-hidden />
                  <span className="font-medium text-foreground">{a.allergenName}</span>
                  {a.reaction && <span className="text-muted-foreground">· {a.reaction}</span>}
                </>
              );
              return (
                <li key={a.uuid}>
                  {canManage ? (
                    <button
                      type="button"
                      onClick={() => setEditing(a)}
                      title={t.examEditAllergy}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs transition-colors hover:border-primary/50 hover:bg-primary/5"
                    >
                      {chip}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs">{chip}</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {canManage && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn("h-8 gap-1 rounded-full px-3 text-xs", sorted.length === 0 && "ml-auto")}
            onClick={() => setEditing("new")}
          >
            <Plus className="h-3.5 w-3.5" />
            {t.examAddAllergy}
          </Button>
        )}
      </div>

      {editing && (
        <AllergyFormModal
          customerUuid={customerUuid}
          allergy={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            queryClient.invalidateQueries({ queryKey: ["examinations"] });
          }}
        />
      )}
    </div>
  );
}
