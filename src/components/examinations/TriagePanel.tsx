import type { JSX } from "react";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClipboardCheck, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/useLanguage";
import { triageExamination } from "@/service/examinationService";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Examination } from "@/types/examination";
import { VitalsInputs, VitalsSummary } from "./VitalSigns";
import { vitalsFormOf, vitalsPayloadOf, type VitalsForm } from "./vitals";

const timeOf = (iso: string): string => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/** Who recorded the vitals and when, or that nobody has yet. */
export function TriageStamp({ exam }: { exam: Examination }): JSX.Element {
  const { t } = useLanguage();
  if (!exam.triagedAt) {
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
        {t.examNotTriaged}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
      <ClipboardCheck className="h-3 w-3" aria-hidden />
      {t.examTriagedBy.replace("{name}", exam.triagedBy?.name ?? "—").replace("{time}", timeOf(exam.triagedAt))}
    </span>
  );
}

/**
 * Triage: the nurse / front desk records the complaint and vital signs before
 * the doctor. Optional — the doctor can call in a patient who skipped it.
 */
export function TriagePanel({ exam, canEdit }: { exam: Examination; canEdit: boolean }): JSX.Element {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();

  const [complaint, setComplaint] = useState(exam.chiefComplaint ?? "");
  const [vitals, setVitals] = useState<VitalsForm>(() => vitalsFormOf(exam));
  const [dirty, setDirty] = useState(false);

  // Follow server updates (polling, another desk) unless the user is typing.
  useEffect(() => {
    if (dirty) return;
    setComplaint(exam.chiefComplaint ?? "");
    setVitals(vitalsFormOf(exam));
  }, [exam, dirty]);

  const mutation = useMutation({
    mutationFn: () => triageExamination(exam.uuid, { chiefComplaint: complaint.trim(), ...vitalsPayloadOf(vitals) }),
    onSuccess: () => {
      setDirty(false);
      toast.success(t.examTriageSaved);
      queryClient.invalidateQueries({ queryKey: ["examinations"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, language, t.unexpectedError)),
  });

  return (
    <section className="rounded-2xl border border-border bg-card">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{t.examTriageTitle}</h3>
          <p className="text-xs text-muted-foreground">{t.examTriageDesc}</p>
        </div>
        <TriageStamp exam={exam} />
      </header>

      <div className="space-y-4 p-4">
        {canEdit ? (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="triage-complaint">{t.medicalRecordVisitChiefComplaint}</Label>
              <Textarea
                id="triage-complaint"
                value={complaint}
                onChange={(e) => {
                  setComplaint(e.target.value);
                  setDirty(true);
                }}
                placeholder={t.examComplaintPlaceholder}
                rows={2}
                className="resize-none rounded-xl"
              />
            </div>
            <VitalsInputs
              value={vitals}
              onChange={(key, v) => {
                setVitals((f) => ({ ...f, [key]: v }));
                setDirty(true);
              }}
              disabled={mutation.isPending}
              t={t}
            />
            <div className="flex justify-end">
              <Button className="h-10 gap-2 rounded-xl" disabled={mutation.isPending || (!dirty && !!exam.triagedAt)} onClick={() => mutation.mutate()}>
                {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {exam.triagedAt ? t.examTriageUpdate : t.examTriageSave}
              </Button>
            </div>
          </>
        ) : (
          <>
            {exam.chiefComplaint && (
              <p className="text-sm">
                <span className="text-muted-foreground">{t.medicalRecordVisitChiefComplaint}: </span>
                {exam.chiefComplaint}
              </p>
            )}
            <VitalsSummary values={exam} t={t} compact />
          </>
        )}
      </div>
    </section>
  );
}
