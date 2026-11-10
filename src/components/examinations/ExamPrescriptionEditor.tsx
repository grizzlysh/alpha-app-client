import type { JSX } from "react";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ComboboxCreatable } from "@/components/ui/combobox-creatable";
import { useLanguage } from "@/hooks/useLanguage";
import { getMedicinesDropdown } from "@/service/medicineService";
import { checkExamAllergies } from "@/service/examinationService";
import { cn } from "@/utils/cn";
import type { AllergyConflict } from "@/types/examination";
import { SEVERITY_DOT } from "@/components/medical-records/severity";

export interface RxLine {
  key: string;
  medicineName: string;
  qty: number | "";
  frequency: string;
  duration: string;
}

const newRxLine = (): RxLine => ({
  key: Math.random().toString(36).slice(2),
  medicineName: "",
  qty: "",
  frequency: "",
  duration: "",
});

export interface ExamPrescriptionEditorProps {
  examUuid: string;
  lines: RxLine[];
  notes: string;
  onLinesChange: (lines: RxLine[]) => void;
  onNotesChange: (notes: string) => void;
  /** Reports the current allergy matches so the parent can confirm before finishing. */
  onConflictsChange: (conflicts: AllergyConflict[]) => void;
  disabled?: boolean;
}

export function ExamPrescriptionEditor({
  examUuid,
  lines,
  notes,
  onLinesChange,
  onNotesChange,
  onConflictsChange,
  disabled,
}: ExamPrescriptionEditorProps): JSX.Element {
  const { t } = useLanguage();

  const { data: medicines } = useQuery({ queryKey: ["medicines-dropdown"], queryFn: getMedicinesDropdown });
  const medicineOptions = useMemo(
    () => (medicines?.data ?? []).map((m) => ({ value: m.name, label: m.name })),
    [medicines]
  );

  // Live allergy screening on the server (it also knows each medicine's ingredients).
  const names = lines.map((l) => l.medicineName.trim()).filter(Boolean);
  const [debouncedNames] = useDebounce(names.join("\n"), 400);
  const { data: conflictData } = useQuery({
    queryKey: ["examination", examUuid, "allergy-check", debouncedNames],
    queryFn: () => checkExamAllergies(examUuid, debouncedNames.split("\n").map((medicineName) => ({ medicineName }))),
    enabled: debouncedNames.length > 0,
    staleTime: 30_000,
  });
  const conflicts = useMemo(
    () => (debouncedNames.length > 0 ? conflictData?.data ?? [] : []),
    [conflictData, debouncedNames]
  );
  useEffect(() => onConflictsChange(conflicts), [conflicts, onConflictsChange]);

  const conflictByMedicine = new Map(conflicts.map((c) => [c.medicineName.trim().toLowerCase(), c]));

  function update(key: string, patch: Partial<RxLine>): void {
    onLinesChange(lines.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  }

  return (
    <div className="space-y-3">
      {conflicts.length > 0 && (
        <div role="alert" className="rounded-xl border border-destructive/40 bg-destructive/5 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-destructive">
            <AlertTriangle className="h-4 w-4" aria-hidden />
            {t.examAllergyWarningTitle}
          </p>
          <ul className="mt-1 space-y-0.5 text-xs text-foreground">
            {conflicts.map((c, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", SEVERITY_DOT[c.severity])} aria-hidden />
                {t.examAllergyWarningLine.replace("{medicine}", c.medicineName).replace("{allergen}", c.allergenName)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {lines.length > 0 && (
        <div className="space-y-2">
          {/* column labels, aligned with the row grid below */}
          <div className="hidden grid-cols-[minmax(0,1fr)_4.5rem_6rem_6rem_2rem] gap-2 px-0.5 text-[11px] font-medium text-muted-foreground sm:grid">
            <span>{t.examMedicine}</span>
            <span>{t.examQty}</span>
            <span>{t.examFrequency}</span>
            <span>{t.examDuration}</span>
            <span />
          </div>
          {lines.map((line) => {
            const flagged = conflictByMedicine.has(line.medicineName.trim().toLowerCase());
            return (
              <div
                key={line.key}
                className={cn(
                  "grid grid-cols-[minmax(0,1fr)_4.5rem_2rem] gap-2 sm:grid-cols-[minmax(0,1fr)_4.5rem_6rem_6rem_2rem]",
                  flagged && "rounded-xl ring-2 ring-destructive/40 ring-offset-2 ring-offset-card"
                )}
              >
                <ComboboxCreatable
                  value={line.medicineName}
                  onValueChange={(v) => update(line.key, { medicineName: v })}
                  options={medicineOptions}
                  placeholder={t.examMedicinePlaceholder}
                  searchPlaceholder={t.examMedicinePlaceholder}
                  creatableLabel={(v) => t.examUseTyped.replace("{v}", v)}
                  disabled={disabled}
                  className="h-10 w-full min-w-0 rounded-xl"
                />
                <Input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  aria-label={t.examQty}
                  placeholder={t.examQty}
                  value={line.qty}
                  disabled={disabled}
                  onChange={(e) => update(line.key, { qty: e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value, 10) || 1) })}
                  className="h-10 rounded-xl"
                />
                <Input
                  aria-label={t.examFrequency}
                  placeholder={t.examFrequencyPlaceholder}
                  value={line.frequency}
                  disabled={disabled}
                  onChange={(e) => update(line.key, { frequency: e.target.value })}
                  className="order-last col-span-2 h-10 rounded-xl sm:order-none sm:col-span-1"
                />
                <Input
                  aria-label={t.examDuration}
                  placeholder={t.examDurationPlaceholder}
                  value={line.duration}
                  disabled={disabled}
                  onChange={(e) => update(line.key, { duration: e.target.value })}
                  className="order-last h-10 rounded-xl sm:order-none"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                  className="h-10 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => onLinesChange(lines.filter((l) => l.key !== line.key))}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">{t.examRemoveLine}</span>
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        className="h-9 gap-1.5 rounded-xl"
        onClick={() => onLinesChange([...lines, newRxLine()])}
      >
        <Plus className="h-4 w-4" />
        {t.examAddMedicine}
      </Button>

      {lines.length > 0 && (
        <Textarea
          value={notes}
          disabled={disabled}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={t.examRxNotes}
          aria-label={t.examRxNotes}
          rows={2}
          className="resize-none rounded-xl"
        />
      )}
    </div>
  );
}
