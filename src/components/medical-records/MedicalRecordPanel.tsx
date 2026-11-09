import type { JSX } from "react";
import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Loader2,
  Pencil,
  Plus,
  Trash2,
  AlertTriangle,
  Heart,
  Phone,
  Droplets,
  ClipboardList,
  Stethoscope,
  UserRound,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { useLanguage } from "@/hooks/useLanguage";
import {
  getMedicalRecord,
  getVisits,
  removeAllergy,
  deleteVisit,
} from "@/service/medicalRecordService";
import { getApiErrorMessage } from "@/utils/apiError";
import { cn } from "@/utils/cn";
import type { Allergy, MedicalVisit, AllergySeverity } from "@/types/medicalRecord";
import type { Customer } from "@/types/customer";
import { MedicalRecordEditModal } from "./MedicalRecordEditModal";
import { AllergyFormModal } from "./AllergyFormModal";
import { VisitFormModal } from "./VisitFormModal";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatVisitDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function severityClass(s: AllergySeverity): string {
  const map: Record<AllergySeverity, string> = {
    MILD: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    MODERATE: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    SEVERE: "bg-destructive/10 text-destructive",
  };
  return map[s];
}

function allergyTypeClass(type: string): string {
  const map: Record<string, string> = {
    MEDICINE: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    FOOD: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    ENVIRONMENT: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    OTHER: "bg-muted text-muted-foreground",
  };
  return map[type] ?? "bg-muted text-muted-foreground";
}

// ── Overview Section ──────────────────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: JSX.Element; label: string; value: string | null }): JSX.Element {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn("mt-0.5 text-sm font-medium", value ? "text-foreground" : "text-muted-foreground/40")}>
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

// ── Allergy Card ──────────────────────────────────────────────────────────────

interface AllergyCardProps {
  allergy: Allergy;
  onDelete: (allergy: Allergy) => void;
  deleteLabel: string;
  severityMild: string;
  severityModerate: string;
  severitySevere: string;
  typeMedicine: string;
  typeFood: string;
  typeEnvironment: string;
  typeOther: string;
}

function AllergyCard({
  allergy,
  onDelete,
  deleteLabel,
  severityMild,
  severityModerate,
  severitySevere,
  typeMedicine,
  typeFood,
  typeEnvironment,
  typeOther,
}: AllergyCardProps): JSX.Element {
  const severityLabels: Record<AllergySeverity, string> = {
    MILD: severityMild,
    MODERATE: severityModerate,
    SEVERE: severitySevere,
  };
  const typeLabels: Record<string, string> = {
    MEDICINE: typeMedicine,
    FOOD: typeFood,
    ENVIRONMENT: typeEnvironment,
    OTHER: typeOther,
  };

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
      {allergy.severity === "SEVERE" && (
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground">{allergy.allergenName}</span>
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", allergyTypeClass(allergy.allergenType))}>
            {typeLabels[allergy.allergenType] ?? allergy.allergenType}
          </span>
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", severityClass(allergy.severity))}>
            {severityLabels[allergy.severity] ?? allergy.severity}
          </span>
        </div>
        {allergy.reaction && (
          <p className="mt-1 text-xs text-muted-foreground">{allergy.reaction}</p>
        )}
        {allergy.notes && (
          <p className="mt-0.5 text-xs text-muted-foreground/70 italic">{allergy.notes}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(allergy)}
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="sr-only">{deleteLabel}</span>
      </Button>
    </div>
  );
}

// ── Main Panel ────────────────────────────────────────────────────────────────

type ModalState =
  | { mode: "editRecord" }
  | { mode: "addAllergy" }
  | { mode: "deleteAllergy"; allergy: Allergy }
  | { mode: "addVisit" }
  | { mode: "editVisit"; visit: MedicalVisit }
  | { mode: "deleteVisit"; visit: MedicalVisit }
  | null;

export interface MedicalRecordPanelProps {
  customer: Customer;
}

export function MedicalRecordPanel({ customer }: MedicalRecordPanelProps): JSX.Element {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<ModalState>(null);
  const [visitPage, setVisitPage] = useState(1);
  const VISIT_LIMIT = 10;

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
  const visits = visitsData?.data ?? [];
  const visitMeta = visitsData?.meta;

  const deleteAllergyMutation = useMutation({
    mutationFn: ({ allergyUuid }: { allergyUuid: string }) =>
      removeAllergy(customer.uuid, allergyUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-record", customer.uuid] });
      toast.success(
        <LiveToastMessage getMessage={(t) => t.medicalRecordAllergyDeleteSuccess} />
      );
      setModal(null);
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, language, t.unexpectedError));
    },
  });

  const deleteVisitMutation = useMutation({
    mutationFn: ({ visitUuid }: { visitUuid: string }) =>
      deleteVisit(customer.uuid, visitUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-visits", customer.uuid] });
      toast.success(
        <LiveToastMessage getMessage={(t) => t.medicalRecordVisitDeleteSuccess} />
      );
      setModal(null);
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, language, t.unexpectedError));
    },
  });

  function closeModal(): void {
    setModal(null);
  }

  function handleDeleteAllergy(): void {
    if (modal?.mode !== "deleteAllergy") return;
    deleteAllergyMutation.mutate({ allergyUuid: modal.allergy.uuid });
  }

  function handleDeleteVisit(): void {
    if (modal?.mode !== "deleteVisit") return;
    deleteVisitMutation.mutate({ visitUuid: modal.visit.uuid });
  }

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Patient header */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <UserRound className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">{customer.name.toUpperCase()}</p>
            <div className="flex items-center gap-2">
              {record ? (
                <span className="font-mono text-xs text-muted-foreground">
                  {record.number}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground/40">—</span>
              )}
              {customer.phone && (
                <span className="text-xs text-muted-foreground">· {customer.phone}</span>
              )}
            </div>
          </div>
        </div>

        {/* Loading */}
        {recordLoading && (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* No medical record yet */}
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

        {/* Tabs */}
        {!recordLoading && record && (
          <Tabs defaultValue="overview" className="flex flex-1 flex-col overflow-hidden">
            <TabsList className="mx-5 mt-4 self-start">
              <TabsTrigger value="overview">{t.medicalRecordOverviewTab}</TabsTrigger>
              <TabsTrigger value="allergies">
                {t.medicalRecordAllergiesTab}
                {record.allergies.length > 0 && (
                  <span className={cn(
                    "ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-semibold",
                    record.allergies.some(a => a.severity === "SEVERE")
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {record.allergies.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="visits">{t.medicalRecordVisitsTab}</TabsTrigger>
            </TabsList>

            {/* ── Overview Tab ── */}
            <TabsContent value="overview" className="flex-1 overflow-y-auto px-5 pb-6">
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.medicalRecordTitle}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 rounded-xl text-xs"
                  onClick={() => setModal({ mode: "editRecord" })}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {t.medicalRecordEdit}
                </Button>
              </div>

              <div className="mt-3 divide-y divide-border rounded-xl border border-border bg-card px-3">
                <InfoRow
                  icon={<ClipboardList className="h-3.5 w-3.5" />}
                  label={t.medicalRecordNumber}
                  value={record.number}
                />
                <InfoRow
                  icon={<Droplets className="h-3.5 w-3.5" />}
                  label={t.medicalRecordBloodType}
                  value={record.bloodType}
                />
                <InfoRow
                  icon={<Heart className="h-3.5 w-3.5" />}
                  label={t.medicalRecordEmergencyContactName}
                  value={record.emergencyContactName}
                />
                <InfoRow
                  icon={<Phone className="h-3.5 w-3.5" />}
                  label={t.medicalRecordEmergencyContactPhone}
                  value={record.emergencyContactPhone}
                />
              </div>

              {/* Allergy summary */}
              {record.allergies.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t.medicalRecordAllergiesTab}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {record.allergies.map((a) => (
                      <span
                        key={a.uuid}
                        className={cn(
                          "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                          severityClass(a.severity)
                        )}
                      >
                        {a.severity === "SEVERE" && <AlertTriangle className="h-3 w-3" />}
                        {a.allergenName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* ── Allergies Tab ── */}
            <TabsContent value="allergies" className="flex-1 overflow-y-auto px-5 pb-6">
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.medicalRecordAllergiesTab}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 rounded-xl text-xs"
                  onClick={() => setModal({ mode: "addAllergy" })}
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t.medicalRecordAllergyAdd}
                </Button>
              </div>

              {record.allergies.length === 0 ? (
                <div className="mt-6 flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20">
                  <Heart className="h-6 w-6 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">{t.medicalRecordAllergyNoData}</p>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  {record.allergies.map((a) => (
                    <AllergyCard
                      key={a.uuid}
                      allergy={a}
                      onDelete={(allergy) => setModal({ mode: "deleteAllergy", allergy })}
                      deleteLabel={t.medicalRecordAllergyDelete}
                      severityMild={t.medicalRecordAllergySeverityMild}
                      severityModerate={t.medicalRecordAllergySeverityModerate}
                      severitySevere={t.medicalRecordAllergySeveritySevere}
                      typeMedicine={t.medicalRecordAllergyTypeMedicine}
                      typeFood={t.medicalRecordAllergyTypeFood}
                      typeEnvironment={t.medicalRecordAllergyTypeEnvironment}
                      typeOther={t.medicalRecordAllergyTypeOther}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ── Visits Tab ── */}
            <TabsContent value="visits" className="flex flex-1 flex-col overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.medicalRecordVisitsTab}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 rounded-xl text-xs"
                  onClick={() => setModal({ mode: "addVisit" })}
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t.medicalRecordVisitAdd}
                </Button>
              </div>

              {visitsLoading ? (
                <div className="flex flex-1 items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : visits.length === 0 ? (
                <div className="mx-5 mt-4 flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20">
                  <Stethoscope className="h-6 w-6 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">{t.medicalRecordVisitNoData}</p>
                </div>
              ) : (
                <div className="mt-3 flex flex-1 flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto px-5 pb-2">
                    <div className="space-y-2">
                      {visits.map((visit) => (
                        <VisitRow
                          key={visit.uuid}
                          visit={visit}
                          onEdit={(v) => setModal({ mode: "editVisit", visit: v })}
                          onDelete={(v) => setModal({ mode: "deleteVisit", visit: v })}
                          editLabel={t.medicalRecordVisitEdit}
                          deleteLabel={t.medicalRecordVisitDelete}
                          chiefComplaintLabel={t.medicalRecordVisitChiefComplaint}
                          diagnosisLabel={t.medicalRecordVisitDiagnosis}
                          doctorLabel={t.medicalRecordVisitDoctor}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Pagination */}
                  {visitMeta && visitMeta.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
                      <span>
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
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* ── Modals ── */}
      {modal?.mode === "editRecord" && record && (
        <MedicalRecordEditModal
          record={record}
          customerUuid={customer.uuid}
          onClose={closeModal}
          onSuccess={closeModal}
        />
      )}

      {modal?.mode === "addAllergy" && (
        <AllergyFormModal
          customerUuid={customer.uuid}
          onClose={closeModal}
          onSuccess={closeModal}
        />
      )}

      {modal?.mode === "addVisit" && (
        <VisitFormModal
          customerUuid={customer.uuid}
          onClose={closeModal}
          onSuccess={closeModal}
        />
      )}

      {modal?.mode === "editVisit" && (
        <VisitFormModal
          customerUuid={customer.uuid}
          visit={modal.visit}
          onClose={closeModal}
          onSuccess={closeModal}
        />
      )}

      {/* Delete Allergy Confirm */}
      {modal?.mode === "deleteAllergy" && (
        <Dialog open onOpenChange={(open) => !open && !deleteAllergyMutation.isPending && closeModal()}>
          <DialogContent className="max-w-md" onInteractOutside={(e) => { if (deleteAllergyMutation.isPending) e.preventDefault(); }}>
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle>{t.medicalRecordAllergyDeleteConfirmTitle}</DialogTitle>
                  <DialogDescription className="mt-1">
                    {t.medicalRecordAllergyDeleteConfirmDesc}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
              <p className="font-medium text-foreground">{modal.allergy.allergenName}</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeModal} disabled={deleteAllergyMutation.isPending} className="rounded-xl">
                {t.cancel}
              </Button>
              <Button variant="destructive" onClick={handleDeleteAllergy} disabled={deleteAllergyMutation.isPending} className="min-w-[6rem] rounded-xl">
                {deleteAllergyMutation.isPending ? t.medicalRecordAllergyDeleting : t.medicalRecordAllergyDelete}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Visit Confirm */}
      {modal?.mode === "deleteVisit" && (
        <Dialog open onOpenChange={(open) => !open && !deleteVisitMutation.isPending && closeModal()}>
          <DialogContent className="max-w-md" onInteractOutside={(e) => { if (deleteVisitMutation.isPending) e.preventDefault(); }}>
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle>{t.medicalRecordVisitDeleteConfirmTitle}</DialogTitle>
                  <DialogDescription className="mt-1">
                    {t.medicalRecordVisitDeleteConfirmDesc}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
              <p className="font-medium text-foreground">{formatVisitDate(modal.visit.visitDate)}</p>
              {modal.visit.chiefComplaint && (
                <p className="mt-0.5 text-sm text-muted-foreground">{modal.visit.chiefComplaint}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeModal} disabled={deleteVisitMutation.isPending} className="rounded-xl">
                {t.cancel}
              </Button>
              <Button variant="destructive" onClick={handleDeleteVisit} disabled={deleteVisitMutation.isPending} className="min-w-[6rem] rounded-xl">
                {deleteVisitMutation.isPending ? t.medicalRecordVisitDeleting : t.medicalRecordVisitDelete}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// ── Visit Row ─────────────────────────────────────────────────────────────────

interface VisitRowProps {
  visit: MedicalVisit;
  onEdit: (v: MedicalVisit) => void;
  onDelete: (v: MedicalVisit) => void;
  editLabel: string;
  deleteLabel: string;
  chiefComplaintLabel: string;
  diagnosisLabel: string;
  doctorLabel: string;
}

function VisitRow({
  visit,
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
  chiefComplaintLabel,
  diagnosisLabel,
  doctorLabel: _doctorLabel,
}: VisitRowProps): JSX.Element {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {formatVisitDate(visit.visitDate)}
            </span>
            {visit.doctor && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Stethoscope className="h-3 w-3" />
                {visit.doctor.name}
              </span>
            )}
          </div>
          {visit.chiefComplaint && (
            <p className="mt-1 text-xs text-muted-foreground">
              <span className="font-medium">{chiefComplaintLabel}:</span> {visit.chiefComplaint}
            </p>
          )}
          {visit.diagnosis && (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">{diagnosisLabel}:</span> {visit.diagnosis}
            </p>
          )}
          {/* Vitals mini row */}
          {(visit.weightKg || visit.heightCm || visit.bloodPressure || visit.temperatureCelsius || visit.pulsePerMinute) && (
            <div className="mt-1.5 flex flex-wrap gap-2">
              {visit.weightKg != null && (
                <span className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                  {visit.weightKg}kg
                </span>
              )}
              {visit.heightCm != null && (
                <span className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                  {visit.heightCm}cm
                </span>
              )}
              {visit.bloodPressure && (
                <span className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                  {visit.bloodPressure} mmHg
                </span>
              )}
              {visit.temperatureCelsius != null && (
                <span className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                  {visit.temperatureCelsius}°C
                </span>
              )}
              {visit.pulsePerMinute != null && (
                <span className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                  {visit.pulsePerMinute} bpm
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-shrink-0 gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(visit)}
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="sr-only">{editLabel}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(visit)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">{deleteLabel}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
