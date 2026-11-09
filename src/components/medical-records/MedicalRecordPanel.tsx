import type { JSX } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Loader2,
  Pencil,
  Plus,
  Trash2,
  AlertTriangle,
  ClipboardList,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  FileText,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { PrescriptionFormModal } from "@/components/prescriptions/PrescriptionFormModal";
import { PrescriptionStatusBadge } from "@/components/prescriptions/PrescriptionTable";
import { useLanguage } from "@/hooks/useLanguage";
import { useCan } from "@/hooks/usePermission";
import { getMedicalRecord, getVisits, removeAllergy, deleteVisit } from "@/service/medicalRecordService";
import { getApiErrorMessage } from "@/utils/apiError";
import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import type { Allergy, AllergySeverity, AllergyType, MedicalVisit } from "@/types/medicalRecord";
import type { Customer } from "@/types/customer";
import { MedicalRecordEditModal } from "./MedicalRecordEditModal";
import { AllergyFormModal } from "./AllergyFormModal";
import { VisitFormModal } from "./VisitFormModal";
import { SEVERITY_DOT, SEVERITY_TEXT, sortBySeverity } from "./severity";

const VISIT_LIMIT = 10;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatVisitDate(isoStr: string, language: string): string {
  return new Date(isoStr).toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function relativeDayLabel(isoStr: string, t: Translations): string | null {
  const day = new Date(isoStr);
  const today = new Date();
  const diff = Math.round(
    (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
      Date.UTC(day.getFullYear(), day.getMonth(), day.getDate())) /
      86400000
  );
  if (diff === 0) return t.medicalRecordVisitToday;
  if (diff === 1) return t.medicalRecordVisitYesterday;
  if (diff > 1 && diff <= 30) return t.medicalRecordVisitDaysAgo.replace("{n}", String(diff));
  return null;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function useLabels(t: Translations) {
  const severity: Record<AllergySeverity, string> = {
    MILD: t.medicalRecordAllergySeverityMild,
    MODERATE: t.medicalRecordAllergySeverityModerate,
    SEVERE: t.medicalRecordAllergySeveritySevere,
  };
  const type: Record<AllergyType, string> = {
    MEDICINE: t.medicalRecordAllergyTypeMedicine,
    FOOD: t.medicalRecordAllergyTypeFood,
    ENVIRONMENT: t.medicalRecordAllergyTypeEnvironment,
    OTHER: t.medicalRecordAllergyTypeOther,
  };
  return { severity, type };
}

const TAB_TRIGGER =
  "flex flex-1 items-center justify-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none";

function CountBadge({ n, alert }: { n: number; alert?: boolean }): JSX.Element | null {
  if (n <= 0) return null;
  return (
    <span className="flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
      {alert && <span className="h-1.5 w-1.5 rounded-full bg-destructive" aria-hidden />}
      {n}
    </span>
  );
}

// ── Main Panel ────────────────────────────────────────────────────────────────

type ModalState =
  | { mode: "editRecord" }
  | { mode: "addAllergy" }
  | { mode: "editAllergy"; allergy: Allergy }
  | { mode: "deleteAllergy"; allergy: Allergy }
  | { mode: "addVisit" }
  | { mode: "editVisit"; visit: MedicalVisit }
  | { mode: "deleteVisit"; visit: MedicalVisit }
  | { mode: "prescribe"; visit: MedicalVisit }
  | null;

export interface MedicalRecordPanelProps {
  customer: Customer;
}

export function MedicalRecordPanel({ customer }: MedicalRecordPanelProps): JSX.Element {
  const { t, language } = useLanguage();
  const can = useCan();
  const navigate = useNavigate();
  const canWrite = can("medical_records.write");
  const canPrescribe = can("prescriptions.create");
  const canOpenPrescription = can("prescriptions.read");
  const queryClient = useQueryClient();
  const labels = useLabels(t);
  const [modal, setModal] = useState<ModalState>(null);
  const [visitPage, setVisitPage] = useState(1);

  const { data: recordData, isLoading: recordLoading } = useQuery({
    queryKey: ["medical-record", customer.uuid],
    queryFn: () => getMedicalRecord(customer.uuid),
  });

  const { data: visitsData, isLoading: visitsLoading } = useQuery({
    queryKey: ["medical-visits", customer.uuid, visitPage],
    queryFn: () => getVisits(customer.uuid, { page: visitPage, limit: VISIT_LIMIT }),
    placeholderData: keepPreviousData,
  });

  const record = recordData?.data;
  const allergies = record ? sortBySeverity(record.allergies) : [];
  const hasSevere = allergies.some((a) => a.severity === "SEVERE");
  const visits = [...(visitsData?.data ?? [])].sort(
    (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
  );
  const visitMeta = visitsData?.meta;
  const visitTotal = visitMeta?.total ?? visits.length;
  const lastVisit = visitPage === 1 ? visits[0] : undefined;

  const deleteAllergyMutation = useMutation({
    mutationFn: ({ allergyUuid }: { allergyUuid: string }) => removeAllergy(customer.uuid, allergyUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-record", customer.uuid] });
      toast.success(<LiveToastMessage getMessage={(t) => t.medicalRecordAllergyDeleteSuccess} />);
      setModal(null);
    },
    onError: (err) => toast.error(getApiErrorMessage(err, language, t.unexpectedError)),
  });

  const deleteVisitMutation = useMutation({
    mutationFn: ({ visitUuid }: { visitUuid: string }) => deleteVisit(customer.uuid, visitUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-visits", customer.uuid] });
      toast.success(<LiveToastMessage getMessage={(t) => t.medicalRecordVisitDeleteSuccess} />);
      setModal(null);
    },
    onError: (err) => toast.error(getApiErrorMessage(err, language, t.unexpectedError)),
  });

  function closeModal(): void {
    setModal(null);
  }

  const emergencyContact = record
    ? [record.emergencyContactName, record.emergencyContactPhone].filter(Boolean).join(" · ") || null
    : null;

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        {/* ── Patient header ── */}
        <div className="flex items-center gap-3 px-5 pb-3 pt-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
            {getInitials(customer.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">{customer.name.toUpperCase()}</p>
            <p className="truncate text-xs text-muted-foreground">
              <span className="font-mono">{record?.number ?? "—"}</span>
              {customer.phone && <> · {customer.phone}</>}
            </p>
          </div>
          {canWrite && record && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 shrink-0 gap-1.5 rounded-xl text-xs"
              onClick={() => setModal({ mode: "editRecord" })}
            >
              <Pencil className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.medicalRecordPatientInfo}</span>
            </Button>
          )}
        </div>

        {recordLoading && (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!recordLoading && !record && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/40">
              <ClipboardList className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">{t.medicalRecordNotFoundTitle}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t.medicalRecordNotFoundDesc}</p>
            </div>
          </div>
        )}

        {!recordLoading && record && (
          <>
            {/* ── Compact summary: short facts in one row, no wasted space ── */}
            <dl className="mx-5 grid grid-cols-2 gap-x-6 gap-y-2 rounded-xl border border-border bg-muted/20 px-4 py-2.5 text-sm sm:grid-cols-3">
              <SummaryItem label={t.medicalRecordBloodType} value={record.bloodType} empty={t.medicalRecordNotSet} />
              <SummaryItem
                label={t.medicalRecordEmergencyContact}
                value={emergencyContact}
                empty={t.medicalRecordNotSet}
              />
              <SummaryItem
                label={t.medicalRecordLastVisit}
                value={lastVisit ? formatVisitDate(lastVisit.visitDate, language) : null}
                empty="—"
                className="col-span-2 sm:col-span-1"
              />
            </dl>

            {/* ── Allergies at a glance (visible on every tab) ── */}
            <div className="mx-5 mt-2 flex min-h-8 flex-wrap items-center gap-1.5 text-xs">
              <span className="mr-1 font-medium text-muted-foreground">{t.medicalRecordAllergiesTab}:</span>
              {allergies.length === 0 ? (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                  {t.medicalRecordNoKnownAllergies}
                </span>
              ) : (
                allergies.map((a) => (
                  <span
                    key={a.uuid}
                    title={labels.severity[a.severity]}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-0.5 font-medium text-foreground"
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", SEVERITY_DOT[a.severity])} aria-hidden />
                    {a.allergenName}
                    <span className="sr-only">({labels.severity[a.severity]})</span>
                  </span>
                ))
              )}
            </div>

            {/* ── Tabs ── */}
            <Tabs defaultValue="visits" className="mt-2 flex min-h-0 flex-1 flex-col gap-0">
              <div className="border-b border-border px-5">
                <TabsList className="flex h-auto w-full gap-0 rounded-none bg-transparent p-0">
                  <TabsTrigger value="visits" className={TAB_TRIGGER}>
                    <Stethoscope className="h-4 w-4" />
                    {t.medicalRecordVisitsTab}
                    <CountBadge n={visitTotal} />
                  </TabsTrigger>
                  <TabsTrigger value="allergies" className={TAB_TRIGGER}>
                    <AlertTriangle className="h-4 w-4" />
                    {t.medicalRecordAllergiesTab}
                    <CountBadge n={allergies.length} alert={hasSevere} />
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Visits */}
              <TabsContent value="visits" className="flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden">
                {canWrite && (
                  <div className="flex justify-end px-5 pt-3">
                    <Button size="sm" className="h-8 gap-1.5 rounded-xl text-xs" onClick={() => setModal({ mode: "addVisit" })}>
                      <Plus className="h-3.5 w-3.5" />
                      {t.medicalRecordVisitAdd}
                    </Button>
                  </div>
                )}

                {visitsLoading ? (
                  <div className="flex flex-1 items-center justify-center py-10">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : visits.length === 0 ? (
                  <EmptyBox icon={<Stethoscope className="h-6 w-6 text-muted-foreground/40" />} text={t.medicalRecordVisitNoData} />
                ) : (
                  <>
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                      <VisitTimeline
                        visits={visits}
                        language={language}
                        isFirstPage={visitPage === 1}
                        onEdit={canWrite ? (v) => setModal({ mode: "editVisit", visit: v }) : undefined}
                        onDelete={canWrite ? (v) => setModal({ mode: "deleteVisit", visit: v }) : undefined}
                        onPrescribe={canPrescribe ? (v) => setModal({ mode: "prescribe", visit: v }) : undefined}
                        onOpenPrescription={
                          canOpenPrescription ? (uuid) => navigate(`/prescriptions?open=${uuid}`) : undefined
                        }
                      />
                    </div>

                    {visitMeta && visitMeta.totalPages > 1 && (
                      <div className="flex items-center justify-between border-t border-border px-5 py-2.5 text-xs text-muted-foreground">
                        <span className="tabular-nums">
                          {visitPage} / {visitMeta.totalPages}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-lg"
                            disabled={visitPage <= 1}
                            onClick={() => setVisitPage((p) => p - 1)}
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-lg"
                            disabled={visitPage >= visitMeta.totalPages}
                            onClick={() => setVisitPage((p) => p + 1)}
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              {/* Allergies */}
              <TabsContent value="allergies" className="min-h-0 flex-1 overflow-y-auto data-[state=inactive]:hidden">
                {canWrite && (
                  <div className="flex justify-end px-5 pt-3">
                    <Button size="sm" className="h-8 gap-1.5 rounded-xl text-xs" onClick={() => setModal({ mode: "addAllergy" })}>
                      <Plus className="h-3.5 w-3.5" />
                      {t.medicalRecordAllergyAdd}
                    </Button>
                  </div>
                )}

                {allergies.length === 0 ? (
                  <EmptyBox icon={<ShieldCheck className="h-6 w-6 text-muted-foreground/40" />} text={t.medicalRecordAllergyNoData} />
                ) : (
                  <ul className="mx-5 my-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
                    {allergies.map((a) => (
                      <AllergyRow
                        key={a.uuid}
                        allergy={a}
                        severityLabel={labels.severity[a.severity]}
                        typeLabel={labels.type[a.allergenType]}
                        t={t}
                        onEdit={canWrite ? (allergy) => setModal({ mode: "editAllergy", allergy }) : undefined}
                        onDelete={canWrite ? (allergy) => setModal({ mode: "deleteAllergy", allergy }) : undefined}
                      />
                    ))}
                  </ul>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      {/* ── Modals ── */}
      {modal?.mode === "editRecord" && record && (
        <MedicalRecordEditModal record={record} customerUuid={customer.uuid} onClose={closeModal} onSuccess={closeModal} />
      )}

      {(modal?.mode === "addAllergy" || modal?.mode === "editAllergy") && (
        <AllergyFormModal
          customerUuid={customer.uuid}
          allergy={modal.mode === "editAllergy" ? modal.allergy : undefined}
          onClose={closeModal}
          onSuccess={closeModal}
        />
      )}

      {(modal?.mode === "addVisit" || modal?.mode === "editVisit") && (
        <VisitFormModal
          customerUuid={customer.uuid}
          visit={modal.mode === "editVisit" ? modal.visit : undefined}
          onClose={closeModal}
          onSuccess={closeModal}
        />
      )}

      {modal?.mode === "prescribe" && (
        <PrescriptionFormModal
          mode="create"
          fromVisit={{
            customerUuid: customer.uuid,
            customerName: customer.name,
            doctorUuid: modal.visit.doctor?.uuid,
            medicalVisitUuid: modal.visit.uuid,
            visitLabel: [formatVisitDate(modal.visit.visitDate, language), modal.visit.diagnosis].filter(Boolean).join(" · "),
          }}
          onClose={closeModal}
          onSuccess={() => {
            toast.success(<LiveToastMessage getMessage={(t) => t.prescriptionCreateSuccess} />);
            closeModal();
          }}
        />
      )}

      {modal?.mode === "deleteAllergy" && (
        <ConfirmDelete
          title={t.medicalRecordAllergyDeleteConfirmTitle}
          desc={t.medicalRecordAllergyDeleteConfirmDesc}
          subject={<p className="font-medium text-foreground">{modal.allergy.allergenName}</p>}
          pending={deleteAllergyMutation.isPending}
          confirmLabel={deleteAllergyMutation.isPending ? t.medicalRecordAllergyDeleting : t.medicalRecordAllergyDelete}
          cancelLabel={t.cancel}
          onCancel={closeModal}
          onConfirm={() => deleteAllergyMutation.mutate({ allergyUuid: modal.allergy.uuid })}
        />
      )}

      {modal?.mode === "deleteVisit" && (
        <ConfirmDelete
          title={t.medicalRecordVisitDeleteConfirmTitle}
          desc={t.medicalRecordVisitDeleteConfirmDesc}
          subject={
            <>
              <p className="font-medium text-foreground">{formatVisitDate(modal.visit.visitDate, language)}</p>
              {modal.visit.chiefComplaint && (
                <p className="mt-0.5 text-sm text-muted-foreground">{modal.visit.chiefComplaint}</p>
              )}
            </>
          }
          pending={deleteVisitMutation.isPending}
          confirmLabel={deleteVisitMutation.isPending ? t.medicalRecordVisitDeleting : t.medicalRecordVisitDelete}
          cancelLabel={t.cancel}
          onCancel={closeModal}
          onConfirm={() => deleteVisitMutation.mutate({ visitUuid: modal.visit.uuid })}
        />
      )}
    </>
  );
}

// ── Small pieces ──────────────────────────────────────────────────────────────

function SummaryItem({
  label,
  value,
  empty,
  className,
}: {
  label: string;
  value: string | null;
  empty: string;
  className?: string;
}): JSX.Element {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className={cn("truncate font-medium", value ? "text-foreground" : "text-muted-foreground/50")}>
        {value ?? empty}
      </dd>
    </div>
  );
}

function EmptyBox({ icon, text }: { icon: JSX.Element; text: string }): JSX.Element {
  return (
    <div className="mx-5 my-4 flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20">
      {icon}
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function ConfirmDelete({
  title,
  desc,
  subject,
  pending,
  confirmLabel,
  cancelLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  desc: string;
  subject: JSX.Element;
  pending: boolean;
  confirmLabel: string;
  cancelLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}): JSX.Element {
  return (
    <Dialog open onOpenChange={(open) => !open && !pending && onCancel()}>
      <DialogContent className="max-w-md" onInteractOutside={(e) => { if (pending) e.preventDefault(); }}>
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="mt-1">{desc}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">{subject}</div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={pending} className="rounded-xl">
            {cancelLabel}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={pending} className="min-w-[6rem] rounded-xl">
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Allergy row ───────────────────────────────────────────────────────────────

function AllergyRow({
  allergy,
  severityLabel,
  typeLabel,
  t,
  onEdit,
  onDelete,
}: {
  allergy: Allergy;
  severityLabel: string;
  typeLabel: string;
  t: Translations;
  onEdit?: (a: Allergy) => void;
  onDelete?: (a: Allergy) => void;
}): JSX.Element {
  return (
    <li className="group flex items-start gap-3 px-4 py-3">
      {/* fixed-width severity column so names line up */}
      <div className={cn("flex w-20 flex-shrink-0 items-center gap-1.5 pt-0.5 text-xs font-medium", SEVERITY_TEXT[allergy.severity])}>
        <span className={cn("h-2 w-2 rounded-full", SEVERITY_DOT[allergy.severity])} aria-hidden />
        {severityLabel}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">
          {allergy.allergenName}
          <span className="ml-2 text-xs font-normal text-muted-foreground">{typeLabel}</span>
        </p>
        {allergy.reaction && (
          <p className="mt-0.5 text-xs text-foreground/80">
            <span className="text-muted-foreground">{t.medicalRecordAllergyReaction}: </span>
            {allergy.reaction}
          </p>
        )}
        {allergy.notes && <p className="mt-0.5 text-xs text-muted-foreground">{allergy.notes}</p>}
      </div>
      {(onEdit || onDelete) && (
        <div className="flex flex-shrink-0 gap-0.5">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(allergy)}
            >
              <Pencil className="h-3.5 w-3.5" />
              <span className="sr-only">{t.medicalRecordAllergyEdit}</span>
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(allergy)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only">{t.medicalRecordAllergyDelete}</span>
            </Button>
          )}
        </div>
      )}
    </li>
  );
}

// ── Visit Timeline ────────────────────────────────────────────────────────────
// Newest at the top, one continuous rail with a dot per visit.

interface VisitTimelineProps {
  visits: MedicalVisit[];
  language: string;
  isFirstPage: boolean;
  onEdit?: (v: MedicalVisit) => void;
  onDelete?: (v: MedicalVisit) => void;
  onPrescribe?: (v: MedicalVisit) => void;
  onOpenPrescription?: (prescriptionUuid: string) => void;
}

function VisitTimeline({ visits, isFirstPage, ...rest }: VisitTimelineProps): JSX.Element {
  return (
    <ol className="relative">
      <span className="absolute bottom-3 left-[7px] top-3 w-px bg-border" aria-hidden />
      {visits.map((visit, i) => {
        const isLatest = isFirstPage && i === 0;
        return (
          <li key={visit.uuid} className="relative pb-4 pl-7 last:pb-0">
            <span
              className={cn(
                "absolute left-0 top-3.5 h-[15px] w-[15px] rounded-full border-2 bg-card",
                isLatest ? "border-primary" : "border-muted-foreground/40"
              )}
              aria-hidden
            >
              {isLatest && <span className="absolute inset-[3px] rounded-full bg-primary" />}
            </span>
            <VisitCard visit={visit} isLatest={isLatest} {...rest} />
          </li>
        );
      })}
    </ol>
  );
}

function VisitCard({
  visit,
  language,
  isLatest,
  onEdit,
  onDelete,
  onPrescribe,
  onOpenPrescription,
}: Omit<VisitTimelineProps, "visits" | "isFirstPage"> & { visit: MedicalVisit; isLatest: boolean }): JSX.Element {
  const { t } = useLanguage();
  const relative = relativeDayLabel(visit.visitDate, t);
  const vitals = [
    visit.bloodPressure ? `${visit.bloodPressure} mmHg` : null,
    visit.temperatureCelsius != null ? `${visit.temperatureCelsius}°C` : null,
    visit.pulsePerMinute != null ? `${visit.pulsePerMinute} bpm` : null,
    visit.weightKg != null ? `${visit.weightKg} kg` : null,
    visit.heightCm != null ? `${visit.heightCm} cm` : null,
  ].filter(Boolean) as string[];

  const rx = visit.prescription;
  const showFooter = Boolean(rx) || Boolean(onPrescribe);

  return (
    <div className={cn("rounded-xl border bg-card", isLatest ? "border-primary/30" : "border-border")}>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-sm font-semibold text-foreground">{formatVisitDate(visit.visitDate, language)}</span>
              {relative && <span className="text-xs text-muted-foreground">· {relative}</span>}
              {isLatest && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  {t.medicalRecordVisitLatest}
                </span>
              )}
            </div>
            {visit.doctor && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Stethoscope className="h-3 w-3" aria-hidden />
                {visit.doctor.name}
              </p>
            )}
          </div>
          {(onEdit || onDelete) && (
            <div className="flex flex-shrink-0 gap-0.5">
              {onEdit && (
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => onEdit(visit)}>
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="sr-only">{t.medicalRecordVisitEdit}</span>
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => onDelete(visit)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">{t.medicalRecordVisitDelete}</span>
                </Button>
              )}
            </div>
          )}
        </div>

        {(visit.chiefComplaint || visit.diagnosis || visit.notes) && (
          <dl className="mt-2 grid grid-cols-[6.5rem_1fr] gap-x-3 gap-y-1 text-xs">
            {visit.chiefComplaint && (
              <>
                <dt className="text-muted-foreground">{t.medicalRecordVisitChiefComplaint}</dt>
                <dd className="min-w-0 text-foreground">{visit.chiefComplaint}</dd>
              </>
            )}
            {visit.diagnosis && (
              <>
                <dt className="text-muted-foreground">{t.medicalRecordVisitDiagnosis}</dt>
                <dd className="min-w-0 font-medium text-foreground">{visit.diagnosis}</dd>
              </>
            )}
            {visit.notes && (
              <>
                <dt className="text-muted-foreground">{t.medicalRecordVisitNotes}</dt>
                <dd className="min-w-0 text-foreground/80">{visit.notes}</dd>
              </>
            )}
          </dl>
        )}

        {vitals.length > 0 && (
          <p className="mt-2 font-mono text-[11px] text-muted-foreground">{vitals.join("  ·  ")}</p>
        )}
      </div>

      {/* Outcome of the visit: a linked prescription, or the option to write one. */}
      {showFooter && (
        <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2">
          {rx ? (
            <>
              <span className="flex min-w-0 items-center gap-1.5 text-xs text-foreground">
                <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                <span className="truncate">{rx.prescriptionNumber ?? t.medicalRecordVisitPrescriptionNoNumber}</span>
                <PrescriptionStatusBadge status={rx.status} t={t} />
              </span>
              {onOpenPrescription && (
                <Button variant="ghost" size="sm" className="h-7 rounded-lg px-2 text-xs" onClick={() => onOpenPrescription(rx.uuid)}>
                  {t.medicalRecordVisitOpenPrescription}
                </Button>
              )}
            </>
          ) : (
            <>
              <span className="text-xs text-muted-foreground">{t.medicalRecordVisitNoPrescription}</span>
              {onPrescribe && (
                <Button variant="outline" size="sm" className="h-7 gap-1 rounded-lg px-2 text-xs" onClick={() => onPrescribe(visit)}>
                  <Plus className="h-3 w-3" />
                  {t.medicalRecordVisitCreatePrescription}
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
