import type { JSX, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, Ban, CheckCircle2, FileText, Loader2, Pencil, PlayCircle, Save, Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormSectionLabel } from "@/components/medical-records/FormSection";
import { SEVERITY_DOT } from "@/components/medical-records/severity";
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
import type { AllergyConflict, CompleteExamPayload, Examination, ExamFieldsPayload } from "@/types/examination";
import { ExamPrescriptionEditor, type RxLine } from "./ExamPrescriptionEditor";
import { ExamStatusBadge, formatQueueNumber } from "./examStatus";
import { PatientAllergies } from "./PatientAllergies";
import { TriagePanel, TriageStamp } from "./TriagePanel";
import { VitalsInputs, VitalsSummary } from "./VitalSigns";
import { vitalsFormOf, vitalsPayloadOf, type VitalsForm } from "./vitals";

// ── Form state ────────────────────────────────────────────────────────────────

interface ResultForm {
  chiefComplaint: string;
  findings: string;
  diagnosis: string;
  advice: string;
  notes: string;
}

const str = (v: string | null | undefined): string => v ?? "";

const resultFormOf = (e: Examination): ResultForm => ({
  chiefComplaint: str(e.chiefComplaint),
  findings: str(e.findings),
  diagnosis: str(e.diagnosis),
  advice: str(e.advice),
  notes: str(e.notes),
});

const resultPayloadOf = (f: ResultForm): ExamFieldsPayload => ({
  chiefComplaint: f.chiefComplaint.trim(),
  findings: f.findings.trim(),
  diagnosis: f.diagnosis.trim(),
  advice: f.advice.trim(),
  notes: f.notes.trim(),
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
  const canTriage = can("examinations.triage");
  const canPrescribe = can("prescriptions.create");
  const canManageAllergies = can("medical_records.write");

  const [form, setForm] = useState<ResultForm>(() => resultFormOf(exam));
  const [vitals, setVitals] = useState<VitalsForm>(() => vitalsFormOf(exam));
  const [dirty, setDirty] = useState(false);
  // Vitals are only sent when the doctor touched them, so a nurse's correction
  // made meanwhile isn't overwritten by the doctor's stale copy.
  const [vitalsDirty, setVitalsDirty] = useState(false);
  const [editVitals, setEditVitals] = useState(false);
  const [rx, setRx] = useState(() => loadRxDraft(exam.uuid));
  const [conflicts, setConflicts] = useState<AllergyConflict[]>([]);
  const [doctorUuid, setDoctorUuid] = useState("");
  const [confirmAllergy, setConfirmAllergy] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [lineError, setLineError] = useState(false);

  // A refetch of the same exam (polling, "save draft") must not wipe typing in
  // progress; only follow the server copy while nothing is pending.
  useEffect(() => {
    if (!dirty) setForm(resultFormOf(exam));
    if (!vitalsDirty) setVitals(vitalsFormOf(exam));
  }, [exam, dirty, vitalsDirty]);

  useEffect(() => saveRxDraft(exam.uuid, rx), [exam.uuid, rx]);

  const onConflictsChange = useCallback((c: AllergyConflict[]) => setConflicts(c), []);

  const isWaiting = exam.status === "WAITING";
  const inProgress = exam.status === "IN_PROGRESS";
  const isClosed = exam.status === "COMPLETED" || exam.status === "CANCELLED";
  const editable = inProgress && canPerform;
  // Not triaged: the doctor records the vitals in the exam itself.
  const showVitalsForm = editable && (editVitals || !exam.triagedAt);

  function setField(key: keyof ResultForm, value: string): void {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  }
  function setVital(key: keyof VitalsForm, value: string): void {
    setVitals((f) => ({ ...f, [key]: value }));
    setVitalsDirty(true);
    setDirty(true);
  }

  const payload = (): ExamFieldsPayload => ({
    ...resultPayloadOf(form),
    ...(vitalsDirty && vitalsPayloadOf(vitals)),
  });

  const onError = (err: unknown) => toast.error(getApiErrorMessage(err, language, t.unexpectedError));
  const refreshQueue = () => queryClient.invalidateQueries({ queryKey: ["examinations"] });

  const startMutation = useMutation({
    mutationFn: () => startExamination(exam.uuid, doctorUuid || undefined),
    onSuccess: refreshQueue,
    onError,
  });

  const saveMutation = useMutation({
    mutationFn: () => saveExamination(exam.uuid, payload()),
    onSuccess: () => {
      setDirty(false);
      setVitalsDirty(false);
      setEditVitals(false);
      toast.success(t.examSavedDraft);
    },
    onError,
  });

  const completeMutation = useMutation({
    mutationFn: (body: CompleteExamPayload) => completeExamination(exam.uuid, body),
    onSuccess: (_res, body) => {
      setDirty(false);
      setVitalsDirty(false);
      setRx({ lines: [], notes: "" });
      saveRxDraft(exam.uuid, { lines: [], notes: "" });
      setConfirmAllergy(false);
      toast.success(body.prescription ? t.examCompleteWithRx : t.examCompleteSuccess);
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
      ...payload(),
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

  const age = ageLabel(exam.patient.dateOfBirth, t);
  const gender =
    exam.patient.gender === "MALE" ? t.examGenderMale : exam.patient.gender === "FEMALE" ? t.examGenderFemale : null;
  const meta = [gender, age, exam.patient.bloodType && `${t.examBloodTypeShort} ${exam.patient.bloodType}`, exam.patient.phone].filter(Boolean);

  const recent = <RecentVisits customerUuid={exam.patient.uuid} currentUuid={exam.uuid} t={t} language={language} />;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* ── Patient header ── */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
        <div className="flex h-12 min-w-12 flex-col items-center justify-center rounded-xl bg-primary/10 px-2 text-primary">
          <span className="text-[9px] font-semibold uppercase leading-none tracking-wider opacity-70">{t.examQueueShort}</span>
          <span className="font-mono text-lg font-bold tabular-nums leading-tight">{formatQueueNumber(exam.queueNumber)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-base font-semibold text-foreground">{exam.patient.name.toUpperCase()}</p>
            <ExamStatusBadge status={exam.status} t={t} />
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            <span className="font-mono">{exam.patient.medicalRecordNumber}</span>
            {meta.map((v) => ` · ${v}`).join("")}
          </p>
          {exam.doctor && (
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
              <Stethoscope className="h-3 w-3" aria-hidden />
              {toDoctorName(exam.doctor.name)}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {!isClosed && canCheckIn && (
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

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
        {/* Allergies: always the first thing anyone sees. */}
        <PatientAllergies
          customerUuid={exam.patient.uuid}
          allergies={exam.patient.allergies}
          canManage={canManageAllergies && !isClosed}
          t={t}
        />

        {/* ── 1. Waiting: triage + call in ── */}
        {isWaiting && (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <TriagePanel exam={exam} canEdit={canTriage} />
            <div className="space-y-5">
              {canPerform && (
                <section className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
                  <h3 className="text-sm font-semibold text-foreground">{t.examCallInTitle}</h3>
                  {!exam.triagedAt && <p className="mt-1 text-xs text-muted-foreground">{t.examCallInNotTriaged}</p>}
                  <div className="mt-3 space-y-3">
                    <DoctorPicker value={doctorUuid} onChange={setDoctorUuid} fallback={exam.doctor?.name} t={t} />
                    <Button className="h-10 w-full gap-2 rounded-xl" disabled={busy} onClick={() => startMutation.mutate()}>
                      {startMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
                      {t.examCallIn}
                    </Button>
                  </div>
                </section>
              )}
              {recent}
            </div>
          </div>
        )}

        {/* ── 2. In progress / closed ── */}
        {!isWaiting && (
          <>
            <section className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <FormSectionLabel>{t.examVitalsTitle}</FormSectionLabel>
                <div className="ml-auto flex items-center gap-2">
                  <TriageStamp exam={exam} />
                  {editable && exam.triagedAt && !editVitals && (
                    <Button variant="ghost" size="sm" className="h-7 gap-1 rounded-lg px-2 text-xs" onClick={() => setEditVitals(true)}>
                      <Pencil className="h-3 w-3" />
                      {t.examEditVitals}
                    </Button>
                  )}
                </div>
              </div>
              {showVitalsForm ? (
                <VitalsInputs value={vitals} onChange={setVital} disabled={busy} t={t} />
              ) : (
                <VitalsSummary values={exam} t={t} />
              )}
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <section className="space-y-4">
                <FormSectionLabel>{t.examResultTitle}</FormSectionLabel>
                {editable ? (
                  <>
                    <Field id="exam-complaint" label={t.medicalRecordVisitChiefComplaint}>
                      <Textarea id="exam-complaint" value={form.chiefComplaint} onChange={(e) => setField("chiefComplaint", e.target.value)} placeholder={t.medicalRecordVisitChiefComplaintPlaceholder} rows={2} className="resize-none rounded-xl" />
                    </Field>
                    <Field id="exam-findings" label={t.examFindings}>
                      <Textarea id="exam-findings" value={form.findings} onChange={(e) => setField("findings", e.target.value)} placeholder={t.examFindingsPlaceholder} rows={3} className="resize-none rounded-xl" />
                    </Field>
                    <Field id="exam-diagnosis" label={t.medicalRecordVisitDiagnosis}>
                      <Textarea id="exam-diagnosis" value={form.diagnosis} onChange={(e) => setField("diagnosis", e.target.value)} placeholder={t.medicalRecordVisitDiagnosisPlaceholder} rows={2} className="resize-none rounded-xl" />
                    </Field>
                    <Field id="exam-advice" label={t.examAdvice}>
                      <Textarea id="exam-advice" value={form.advice} onChange={(e) => setField("advice", e.target.value)} placeholder={t.examAdvicePlaceholder} rows={2} className="resize-none rounded-xl" />
                    </Field>
                    <Field id="exam-notes" label={t.examInternalNotes}>
                      <Textarea id="exam-notes" value={form.notes} onChange={(e) => setField("notes", e.target.value)} placeholder={t.medicalRecordVisitNotesPlaceholder} rows={2} className="resize-none rounded-xl" />
                    </Field>
                  </>
                ) : (
                  <dl className="space-y-3">
                    <ResultText label={t.medicalRecordVisitChiefComplaint} value={exam.chiefComplaint} />
                    <ResultText label={t.examFindings} value={exam.findings} />
                    <ResultText label={t.medicalRecordVisitDiagnosis} value={exam.diagnosis} emphasis />
                    <ResultText label={t.examAdvice} value={exam.advice} />
                    <ResultText label={exam.status === "CANCELLED" ? t.examCancelReason : t.examInternalNotes} value={exam.notes} />
                    {!exam.chiefComplaint && !exam.findings && !exam.diagnosis && !exam.advice && !exam.notes && (
                      <p className="text-sm text-muted-foreground">{t.examNoResult}</p>
                    )}
                  </dl>
                )}
              </section>

              <div className="space-y-6">
                <section className="space-y-3">
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
                </section>
                {recent}
              </div>
            </div>
          </>
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

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }): JSX.Element {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function ResultText({ label, value, emphasis }: { label: string; value: string | null; emphasis?: boolean }): JSX.Element | null {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className={cn("mt-0.5 whitespace-pre-line text-sm text-foreground", emphasis && "font-semibold")}>{value}</dd>
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
