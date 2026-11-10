import type { JSX, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, Ban, CheckCircle2, FileText, Loader2, PlayCircle, Save, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormSectionLabel } from "@/components/medical-records/FormSection";
import { SEVERITY_DOT, SEVERITY_TEXT, sortBySeverity } from "@/components/medical-records/severity";
import { PrescriptionStatusBadge } from "@/components/prescriptions/PrescriptionTable";
import { useLanguage } from "@/hooks/useLanguage";
import { useCan } from "@/hooks/usePermission";
import { getDoctorsDropdown } from "@/service/doctorService";
import { getVisits } from "@/service/medicalRecordService";
import {
  cancelExamination,
  completeExamination,
  saveExamination,
  startExamination,
} from "@/service/examinationService";
import { getApiErrorMessage } from "@/utils/apiError";
import { cn } from "@/utils/cn";
import { toDoctorName } from "@/utils/stringHelpers";
import type { Translations } from "@/configs/i18n";
import type { Allergy } from "@/types/medicalRecord";
import type { AllergyConflict, CompleteExamPayload, Examination, ExamFieldsPayload } from "@/types/examination";
import { ExamPrescriptionEditor, type RxLine } from "./ExamPrescriptionEditor";
import { ExamStatusBadge, formatQueueNumber } from "./examStatus";

// ── Form state ────────────────────────────────────────────────────────────────

interface ExamForm {
  chiefComplaint: string;
  bloodPressure: string;
  temperatureCelsius: string;
  pulsePerMinute: string;
  weightKg: string;
  heightCm: string;
  diagnosis: string;
  notes: string;
}

const str = (v: number | string | null | undefined): string => (v == null ? "" : String(v));

const formFromExam = (e: Examination): ExamForm => ({
  chiefComplaint: str(e.chiefComplaint),
  bloodPressure: str(e.bloodPressure),
  temperatureCelsius: str(e.temperatureCelsius),
  pulsePerMinute: str(e.pulsePerMinute),
  weightKg: str(e.weightKg),
  heightCm: str(e.heightCm),
  diagnosis: str(e.diagnosis),
  notes: str(e.notes),
});

const numOrNull = (v: string): number | null => {
  const n = parseFloat(v.replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

const toPayload = (f: ExamForm): ExamFieldsPayload => ({
  chiefComplaint: f.chiefComplaint.trim(),
  diagnosis: f.diagnosis.trim(),
  notes: f.notes.trim(),
  bloodPressure: f.bloodPressure.trim(),
  temperatureCelsius: numOrNull(f.temperatureCelsius),
  pulsePerMinute: f.pulsePerMinute ? Math.round(numOrNull(f.pulsePerMinute) ?? 0) || null : null,
  weightKg: numOrNull(f.weightKg),
  heightCm: numOrNull(f.heightCm),
});

// Prescription draft survives a reload (or the doctor switching patients).
const rxDraftKey = (uuid: string) => `exam-rx:${uuid}`;
function loadRxDraft(uuid: string): { lines: RxLine[]; notes: string } {
  try {
    const raw = sessionStorage.getItem(rxDraftKey(uuid));
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { lines: [], notes: "" };
}
function saveRxDraft(uuid: string, draft: { lines: RxLine[]; notes: string }): void {
  try {
    if (draft.lines.length === 0 && !draft.notes) sessionStorage.removeItem(rxDraftKey(uuid));
    else sessionStorage.setItem(rxDraftKey(uuid), JSON.stringify(draft));
  } catch {
    // ignore
  }
}

function ageLabel(dob: string | null, t: Translations): string | null {
  if (!dob) return null;
  const d = new Date(dob);
  const now = new Date();
  let years = now.getFullYear() - d.getFullYear();
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) years--;
  return years >= 0 ? t.examYears.replace("{n}", String(years)) : null;
}

// ── Component ────────────────────────────────────────────────────────────────

export interface ExamWorkspaceProps {
  exam: Examination;
}

export function ExamWorkspace({ exam }: ExamWorkspaceProps): JSX.Element {
  const { t, language } = useLanguage();
  const can = useCan();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const canPerform = can("examinations.perform");
  const canCheckIn = can("examinations.checkin");
  const canPrescribe = can("prescriptions.create");

  const [form, setForm] = useState<ExamForm>(() => formFromExam(exam));
  const [dirty, setDirty] = useState(false);
  const [rx, setRx] = useState(() => loadRxDraft(exam.uuid));
  const [conflicts, setConflicts] = useState<AllergyConflict[]>([]);
  const [doctorUuid, setDoctorUuid] = useState("");
  const [confirmAllergy, setConfirmAllergy] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [lineError, setLineError] = useState(false);

  // A refetch of the same exam (e.g. after "save draft") must not wipe typing in
  // progress; only reset when the server copy changes and nothing is pending.
  useEffect(() => {
    if (!dirty) setForm(formFromExam(exam));
  }, [exam, dirty]);

  useEffect(() => saveRxDraft(exam.uuid, rx), [exam.uuid, rx]);

  const onConflictsChange = useCallback((c: AllergyConflict[]) => setConflicts(c), []);

  const isWaiting = exam.status === "WAITING";
  const inProgress = exam.status === "IN_PROGRESS";
  const editable = inProgress && canPerform;

  function set<K extends keyof ExamForm>(key: K, value: string): void {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  }

  const onError = (err: unknown) => toast.error(getApiErrorMessage(err, language, t.unexpectedError));
  const refreshQueue = () => queryClient.invalidateQueries({ queryKey: ["examinations"] });

  const startMutation = useMutation({
    mutationFn: () => startExamination(exam.uuid, doctorUuid || undefined),
    onSuccess: refreshQueue,
    onError,
  });

  const saveMutation = useMutation({
    mutationFn: () => saveExamination(exam.uuid, toPayload(form)),
    onSuccess: () => {
      setDirty(false);
      toast.success(t.examSavedDraft);
    },
    onError,
  });

  const completeMutation = useMutation({
    mutationFn: (payload: CompleteExamPayload) => completeExamination(exam.uuid, payload),
    onSuccess: (_res, payload) => {
      setDirty(false);
      setRx({ lines: [], notes: "" });
      saveRxDraft(exam.uuid, { lines: [], notes: "" });
      setConfirmAllergy(false);
      toast.success(payload.prescription ? t.examCompleteWithRx : t.examCompleteSuccess);
    },
    onError,
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelExamination(exam.uuid, cancelReason.trim() || undefined),
    onSuccess: () => {
      setConfirmCancel(false);
      saveRxDraft(exam.uuid, { lines: [], notes: "" });
    },
    onError,
  });

  const busy = startMutation.isPending || saveMutation.isPending || completeMutation.isPending || cancelMutation.isPending;

  function finish(acknowledgeAllergies = false): void {
    const filled = rx.lines.filter((l) => l.medicineName.trim() || l.qty !== "");
    if (filled.some((l) => !l.medicineName.trim() || l.qty === "" || l.qty < 1)) {
      setLineError(true);
      return;
    }
    setLineError(false);
    if (filled.length > 0 && conflicts.length > 0 && !acknowledgeAllergies) {
      setConfirmAllergy(true);
      return;
    }
    completeMutation.mutate({
      ...toPayload(form),
      ...(filled.length > 0 && {
        prescription: {
          notes: rx.notes.trim() || undefined,
          items: filled.map((l) => ({
            medicineName: l.medicineName.trim(),
            qty: Number(l.qty),
            frequency: l.frequency.trim() || undefined,
            duration: l.duration.trim() || undefined,
          })),
        },
      }),
      acknowledgeAllergies,
    });
  }

  const allergies = sortBySeverity(exam.patient.allergies as Allergy[]);
  const age = ageLabel(exam.patient.dateOfBirth, t);
  const gender =
    exam.patient.gender === "MALE" ? t.examGenderMale : exam.patient.gender === "FEMALE" ? t.examGenderFemale : null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
        <div className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-primary/10 px-2 font-mono text-base font-bold tabular-nums text-primary">
          {formatQueueNumber(exam.queueNumber)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-semibold text-foreground">{exam.patient.name.toUpperCase()}</p>
            <ExamStatusBadge status={exam.status} t={t} />
          </div>
          <p className="truncate text-xs text-muted-foreground">
            <span className="font-mono">{exam.patient.medicalRecordNumber}</span>
            {[gender, age, exam.patient.bloodType && `Gol. ${exam.patient.bloodType}`, exam.patient.phone]
              .filter(Boolean)
              .map((v) => ` · ${v}`)
              .join("")}
            {exam.doctor && ` · ${toDoctorName(exam.doctor.name)}`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(isWaiting || inProgress) && canCheckIn && (
            <Button variant="ghost" size="sm" className="h-9 gap-1.5 rounded-xl text-muted-foreground" disabled={busy} onClick={() => setConfirmCancel(true)}>
              <Ban className="h-4 w-4" />
              <span className="hidden sm:inline">{t.examCancel}</span>
            </Button>
          )}
          {editable && (
            <>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-xl" disabled={busy || !dirty} onClick={() => saveMutation.mutate()}>
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {t.examSaveDraft}
              </Button>
              <Button size="sm" className="h-9 gap-1.5 rounded-xl" disabled={busy} onClick={() => finish()}>
                {completeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {t.examComplete}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* ── Allergies: always the first thing the doctor sees ── */}
        <div className="px-5 pt-4">
          {allergies.length === 0 ? (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              {t.examNoAllergies}
            </p>
          ) : (
            <div className="rounded-xl border border-border bg-muted/20 px-3 py-2.5">
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" aria-hidden />
                {t.examAllergies}
              </p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                {allergies.map((a) => (
                  <li key={a.uuid} className="flex items-center gap-1.5">
                    <span className={cn("h-2 w-2 rounded-full", SEVERITY_DOT[a.severity])} aria-hidden />
                    <span className="font-medium text-foreground">{a.allergenName}</span>
                    {a.reaction && <span className="text-muted-foreground">({a.reaction})</span>}
                    <span className={cn("sr-only", SEVERITY_TEXT[a.severity])}>{a.severity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── Waiting: call in ── */}
        {isWaiting && (
          <div className="mx-5 mt-4 rounded-xl border border-dashed border-border p-5">
            {exam.chiefComplaint && (
              <p className="mb-4 text-sm">
                <span className="text-muted-foreground">{t.medicalRecordVisitChiefComplaint}: </span>
                {exam.chiefComplaint}
              </p>
            )}
            {canPerform ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <DoctorPicker value={doctorUuid} onChange={setDoctorUuid} fallback={exam.doctor?.name} t={t} />
                <Button className="h-10 gap-2 rounded-xl" disabled={busy} onClick={() => startMutation.mutate()}>
                  {startMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
                  {t.examCallIn}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t.examStatusWaiting}</p>
            )}
          </div>
        )}

        {/* ── In progress / finished ── */}
        {!isWaiting && (
          <div className="grid gap-6 px-5 py-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-5">
              <Field label={t.medicalRecordVisitChiefComplaint}>
                <Textarea value={form.chiefComplaint} onChange={(e) => set("chiefComplaint", e.target.value)} disabled={!editable} placeholder={t.medicalRecordVisitChiefComplaintPlaceholder} rows={2} className="resize-none rounded-xl" />
              </Field>

              <div className="space-y-3">
                <FormSectionLabel>{t.medicalRecordVisitSectionExam}</FormSectionLabel>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Vital label={t.medicalRecordVisitBloodPressure} unit="mmHg" value={form.bloodPressure} onChange={(v) => set("bloodPressure", v)} disabled={!editable} placeholder="120/80" inputMode="text" />
                  <Vital label={t.medicalRecordVisitTemperature} unit="°C" value={form.temperatureCelsius} onChange={(v) => set("temperatureCelsius", v)} disabled={!editable} placeholder="36.5" />
                  <Vital label={t.medicalRecordVisitPulse} unit="bpm" value={form.pulsePerMinute} onChange={(v) => set("pulsePerMinute", v)} disabled={!editable} placeholder="80" />
                  <Vital label={t.medicalRecordVisitWeight} unit="kg" value={form.weightKg} onChange={(v) => set("weightKg", v)} disabled={!editable} placeholder="60" />
                  <Vital label={t.medicalRecordVisitHeight} unit="cm" value={form.heightCm} onChange={(v) => set("heightCm", v)} disabled={!editable} placeholder="165" />
                </div>
              </div>

              <div className="space-y-3">
                <FormSectionLabel>{t.medicalRecordVisitSectionAssessment}</FormSectionLabel>
                <Field label={t.medicalRecordVisitDiagnosis}>
                  <Textarea value={form.diagnosis} onChange={(e) => set("diagnosis", e.target.value)} disabled={!editable} placeholder={t.medicalRecordVisitDiagnosisPlaceholder} rows={2} className="resize-none rounded-xl" />
                </Field>
                <Field label={t.medicalRecordVisitNotesLabel}>
                  <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} disabled={!editable} placeholder={t.medicalRecordVisitNotesPlaceholder} rows={3} className="resize-none rounded-xl" />
                </Field>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-3">
                <FormSectionLabel>{t.examPrescription}</FormSectionLabel>
                {exam.prescription ? (
                  <ExistingPrescription exam={exam} t={t} onOpen={can("prescriptions.read") ? () => navigate(`/prescriptions?open=${exam.prescription!.uuid}`) : undefined} />
                ) : editable && canPrescribe ? (
                  <>
                    <p className="text-xs text-muted-foreground">{t.examPrescriptionHint}</p>
                    <ExamPrescriptionEditor
                      examUuid={exam.uuid}
                      lines={rx.lines}
                      notes={rx.notes}
                      onLinesChange={(lines) => setRx((r) => ({ ...r, lines }))}
                      onNotesChange={(notes) => setRx((r) => ({ ...r, notes }))}
                      onConflictsChange={onConflictsChange}
                      disabled={busy}
                    />
                    {lineError && <p className="text-xs text-destructive">{t.examLineRequired}</p>}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">{t.examNoPrescription}</p>
                )}
              </div>

              <RecentVisits customerUuid={exam.patient.uuid} currentUuid={exam.uuid} t={t} language={language} />
            </div>
          </div>
        )}

        {isWaiting && (
          <div className="px-5 py-4">
            <RecentVisits customerUuid={exam.patient.uuid} currentUuid={exam.uuid} t={t} language={language} />
          </div>
        )}
      </div>

      {/* ── Allergy confirmation ── */}
      {confirmAllergy && (
        <Dialog open onOpenChange={(o) => !o && !busy && setConfirmAllergy(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                {t.examAllergyConfirmTitle}
              </DialogTitle>
              <DialogDescription>{t.examAllergyConfirmDesc}</DialogDescription>
            </DialogHeader>
            <ul className="space-y-1 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
              {conflicts.map((c, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", SEVERITY_DOT[c.severity])} aria-hidden />
                  {t.examAllergyWarningLine.replace("{medicine}", c.medicineName).replace("{allergen}", c.allergenName)}
                </li>
              ))}
            </ul>
            <DialogFooter>
              <Button variant="outline" className="rounded-xl" disabled={busy} onClick={() => setConfirmAllergy(false)}>
                {t.examKeep}
              </Button>
              <Button variant="destructive" className="rounded-xl" disabled={busy} onClick={() => finish(true)}>
                {completeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t.examAllergyConfirm}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ── Cancel confirmation ── */}
      {confirmCancel && (
        <Dialog open onOpenChange={(o) => !o && !busy && setConfirmCancel(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t.examCancelTitle}</DialogTitle>
              <DialogDescription>{t.examCancelDesc}</DialogDescription>
            </DialogHeader>
            <Input value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder={t.examCancelReasonPlaceholder} className="h-10 rounded-xl" />
            <DialogFooter>
              <Button variant="outline" className="rounded-xl" disabled={busy} onClick={() => setConfirmCancel(false)}>
                {t.examKeep}
              </Button>
              <Button variant="destructive" className="rounded-xl" disabled={busy} onClick={() => cancelMutation.mutate()}>
                {cancelMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t.examCancelConfirm}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// ── Small pieces ──────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: ReactNode }): JSX.Element {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Vital({
  label,
  unit,
  value,
  onChange,
  disabled,
  placeholder,
  inputMode = "decimal",
}: {
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  placeholder: string;
  inputMode?: "decimal" | "text";
}): JSX.Element {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="relative">
        <Input value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} placeholder={placeholder} inputMode={inputMode} className="h-10 rounded-xl pr-12" />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

function DoctorPicker({
  value,
  onChange,
  fallback,
  t,
}: {
  value: string;
  onChange: (v: string) => void;
  fallback?: string;
  t: Translations;
}): JSX.Element {
  const { data } = useQuery({ queryKey: ["doctors-dropdown"], queryFn: () => getDoctorsDropdown() });
  // "" = let the server decide: the signed-in doctor, else the one picked at check-in.
  const options = useMemo(
    () => [
      { value: "", label: fallback ? toDoctorName(fallback) : t.examDoctorPlaceholder },
      ...(data?.data ?? []).map((d) => ({ value: d.uuid, label: toDoctorName(d.name) })),
    ],
    [data, fallback, t]
  );
  return (
    <div className="flex-1 space-y-1.5">
      <Label>{t.examChooseDoctor}</Label>
      <Combobox value={value} onValueChange={onChange} options={options} placeholder={t.examDoctorPlaceholder} className="h-10 w-full rounded-xl" />
    </div>
  );
}

function ExistingPrescription({ exam, t, onOpen }: { exam: Examination; t: Translations; onOpen?: () => void }): JSX.Element {
  const rx = exam.prescription!;
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/30 px-3 py-2">
        <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium">
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="truncate">{rx.prescriptionNumber ?? t.examPrescription}</span>
          <PrescriptionStatusBadge status={rx.status} t={t} />
        </span>
        {onOpen && (
          <Button variant="ghost" size="sm" className="h-7 rounded-lg px-2 text-xs" onClick={onOpen}>
            {t.examOpenPrescription}
          </Button>
        )}
      </div>
      <ul className="divide-y divide-border text-sm">
        {rx.details.map((d) => (
          <li key={d.uuid} className="flex items-baseline justify-between gap-3 px-3 py-2">
            <span className="min-w-0">
              <span className="font-medium text-foreground">{d.medicineName}</span>
              {(d.frequency || d.duration) && (
                <span className="ml-2 text-xs text-muted-foreground">{[d.frequency, d.duration].filter(Boolean).join(" · ")}</span>
              )}
            </span>
            <span className="shrink-0 tabular-nums text-muted-foreground">× {d.qty}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecentVisits({
  customerUuid,
  currentUuid,
  t,
  language,
}: {
  customerUuid: string;
  currentUuid: string;
  t: Translations;
  language: string;
}): JSX.Element {
  const { data, isLoading } = useQuery({
    queryKey: ["medical-visits", customerUuid, "recent"],
    queryFn: () => getVisits(customerUuid, { page: 1, limit: 4 }),
  });
  const visits = (data?.data ?? []).filter((v) => v.uuid !== currentUuid && v.status === "COMPLETED").slice(0, 3);

  return (
    <div className="space-y-3">
      <FormSectionLabel>{t.examRecentVisits}</FormSectionLabel>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : visits.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.examNoRecentVisits}</p>
      ) : (
        <ul className="space-y-2">
          {visits.map((v) => (
            <li key={v.uuid} className="rounded-xl border border-border px-3 py-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-foreground">
                  {new Date(v.visitDate).toLocaleDateString(language === "id" ? "id-ID" : "en-US", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                {v.doctor && <span className="truncate text-muted-foreground">{toDoctorName(v.doctor.name)}</span>}
              </div>
              {v.diagnosis && <p className="mt-0.5 font-medium text-foreground">{v.diagnosis}</p>}
              {v.chiefComplaint && <p className="mt-0.5 text-muted-foreground">{v.chiefComplaint}</p>}
              {v.prescription && (
                <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                  <FileText className="h-3 w-3" aria-hidden />
                  {v.prescription.prescriptionNumber ?? t.examPrescription}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
