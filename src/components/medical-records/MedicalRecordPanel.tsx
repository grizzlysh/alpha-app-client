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
import { useCan } from "@/hooks/usePermission";
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

function formatVisitDate(isoStr: string, language: string): string {
  return new Date(isoStr).toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatMonthYear(isoStr: string, language: string): string {
  return new Date(isoStr).toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
    month: "long",
    year: "numeric",
  });
}

// Colour is reserved for severity only; everything else stays neutral so the
// one thing that matters clinically stands out.
const SEVERITY_ACCENT: Record<AllergySeverity, { bar: string; dot: string; text: string }> = {
  MILD: { bar: "bg-amber-400", dot: "bg-amber-400", text: "text-amber-700 dark:text-amber-400" },
  MODERATE: { bar: "bg-orange-500", dot: "bg-orange-500", text: "text-orange-700 dark:text-orange-400" },
  SEVERE: { bar: "bg-destructive", dot: "bg-destructive", text: "text-destructive" },
};

const SEVERITY_ORDER: Record<AllergySeverity, number> = { SEVERE: 0, MODERATE: 1, MILD: 2 };

function sortBySeverity(list: Allergy[]): Allergy[] {
  return [...list].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
}

function relativeDayLabel(isoStr: string, t: { medicalRecordVisitToday: string; medicalRecordVisitYesterday: string; medicalRecordVisitDaysAgo: string }): string | null {
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
  onDelete?: (allergy: Allergy) => void;
  deleteLabel: string;
  reactionLabel: string;
  severityLabel: string;
  typeLabel: string;
}

function AllergyCard({ allergy, onDelete, deleteLabel, reactionLabel, severityLabel, typeLabel }: AllergyCardProps): JSX.Element {
  const accent = SEVERITY_ACCENT[allergy.severity];
  return (
    <div className="relative flex items-start gap-3 overflow-hidden rounded-xl border border-border bg-card py-3 pl-4 pr-2">
      <span className={cn("absolute inset-y-0 left-0 w-1", accent.bar)} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
          <p className="text-sm font-semibold text-foreground">{allergy.allergenName}</p>
          <span className={cn("text-xs font-medium", accent.text)}>{severityLabel}</span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{typeLabel}</p>
        {allergy.reaction && (
          <p className="mt-1.5 text-xs text-foreground/80">
            <span className="text-muted-foreground">{reactionLabel}: </span>
            {allergy.reaction}
          </p>
        )}
        {allergy.notes && <p className="mt-0.5 text-xs text-muted-foreground">{allergy.notes}</p>}
      </div>
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(allergy)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">{deleteLabel}</span>
        </Button>
      )}
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
  const can = useCan();
  const canWrite = can("medical_records.write");
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
  const severityLabels: Record<AllergySeverity, string> = {
    MILD: t.medicalRecordAllergySeverityMild,
    MODERATE: t.medicalRecordAllergySeverityModerate,
    SEVERE: t.medicalRecordAllergySeveritySevere,
  };
  const typeLabels: Record<string, string> = {
    MEDICINE: t.medicalRecordAllergyTypeMedicine,
    FOOD: t.medicalRecordAllergyTypeFood,
    ENVIRONMENT: t.medicalRecordAllergyTypeEnvironment,
    OTHER: t.medicalRecordAllergyTypeOther,
  };
  const allergies = record ? sortBySeverity(record.allergies) : [];
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
                  <span className="ml-1.5 flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {record.allergies.some((a) => a.severity === "SEVERE") && (
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive" aria-hidden />
                    )}
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
                {canWrite && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 rounded-xl text-xs"
                    onClick={() => setModal({ mode: "editRecord" })}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {t.medicalRecordEdit}
                  </Button>
                )}
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
                    {allergies.map((a) => (
                      <span
                        key={a.uuid}
                        title={severityLabels[a.severity]}
                        className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full", SEVERITY_ACCENT[a.severity].dot)} aria-hidden />
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
                {canWrite && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 rounded-xl text-xs"
                    onClick={() => setModal({ mode: "addAllergy" })}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t.medicalRecordAllergyAdd}
                  </Button>
                )}
              </div>

              {record.allergies.length === 0 ? (
                <div className="mt-6 flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20">
                  <Heart className="h-6 w-6 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">{t.medicalRecordAllergyNoData}</p>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  {allergies.map((a) => (
                    <AllergyCard
                      key={a.uuid}
                      allergy={a}
                      onDelete={canWrite ? (allergy) => setModal({ mode: "deleteAllergy", allergy }) : undefined}
                      deleteLabel={t.medicalRecordAllergyDelete}
                      reactionLabel={t.medicalRecordAllergyReaction}
                      severityLabel={severityLabels[a.severity] ?? a.severity}
                      typeLabel={typeLabels[a.allergenType] ?? a.allergenType}
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
                {canWrite && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 rounded-xl text-xs"
                    onClick={() => setModal({ mode: "addVisit" })}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t.medicalRecordVisitAdd}
                  </Button>
                )}
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
                    <VisitTimeline
                      visits={visits}
                      language={language}
                      isFirstPage={visitPage === 1}
                      onEdit={canWrite ? (v) => setModal({ mode: "editVisit", visit: v }) : undefined}
                      onDelete={canWrite ? (v) => setModal({ mode: "deleteVisit", visit: v }) : undefined}
                    />
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
              <p className="font-medium text-foreground">{formatVisitDate(modal.visit.visitDate, language)}</p>
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

// ── Visit Timeline ────────────────────────────────────────────────────────────
// Newest first, grouped by month, on a vertical rail with one dot per visit.

interface VisitTimelineProps {
  visits: MedicalVisit[];
  language: string;
  isFirstPage: boolean;
  onEdit?: (v: MedicalVisit) => void;
  onDelete?: (v: MedicalVisit) => void;
}

function VisitTimeline({ visits, language, isFirstPage, onEdit, onDelete }: VisitTimelineProps): JSX.Element {
  const { t } = useLanguage();
  const sorted = [...visits].sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

  const groups: { label: string; items: MedicalVisit[] }[] = [];
  for (const v of sorted) {
    const label = formatMonthYear(v.visitDate, language);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(v);
    else groups.push({ label, items: [v] });
  }

  return (
    <ol className="relative space-y-5">
      {groups.map((group, gi) => (
        <li key={group.label}>
          <p className="mb-2 pl-7 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {group.label}
          </p>
          <ol className="relative">
            {/* the rail */}
            <span className="absolute bottom-2 left-[7px] top-2 w-px bg-border" aria-hidden />
            {group.items.map((visit, vi) => {
              const isLatest = isFirstPage && gi === 0 && vi === 0;
              return (
                <li key={visit.uuid} className="relative pb-3 pl-7 last:pb-0">
                  <span
                    className={cn(
                      "absolute left-0 top-3 h-[15px] w-[15px] rounded-full border-2 bg-card",
                      isLatest ? "border-primary" : "border-muted-foreground/40"
                    )}
                    aria-hidden
                  >
                    {isLatest && <span className="absolute inset-[3px] rounded-full bg-primary" />}
                  </span>
                  <VisitCard
                    visit={visit}
                    language={language}
                    isLatest={isLatest}
                    latestLabel={t.medicalRecordVisitLatest}
                    relativeLabel={relativeDayLabel(visit.visitDate, t)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </li>
              );
            })}
          </ol>
        </li>
      ))}
    </ol>
  );
}

interface VisitCardProps {
  visit: MedicalVisit;
  language: string;
  isLatest: boolean;
  latestLabel: string;
  relativeLabel: string | null;
  onEdit?: (v: MedicalVisit) => void;
  onDelete?: (v: MedicalVisit) => void;
}

function VisitCard({ visit, language, isLatest, latestLabel, relativeLabel, onEdit, onDelete }: VisitCardProps): JSX.Element {
  const { t } = useLanguage();
  const vitals = [
    visit.bloodPressure ? `${visit.bloodPressure} mmHg` : null,
    visit.temperatureCelsius != null ? `${visit.temperatureCelsius}°C` : null,
    visit.pulsePerMinute != null ? `${visit.pulsePerMinute} bpm` : null,
    visit.weightKg != null ? `${visit.weightKg} kg` : null,
    visit.heightCm != null ? `${visit.heightCm} cm` : null,
  ].filter(Boolean) as string[];

  return (
    <div className={cn("group rounded-xl border bg-card p-3", isLatest ? "border-primary/30" : "border-border")}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-sm font-semibold text-foreground">{formatVisitDate(visit.visitDate, language)}</span>
            {relativeLabel && <span className="text-xs text-muted-foreground">· {relativeLabel}</span>}
            {isLatest && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                {latestLabel}
              </span>
            )}
          </div>
          {visit.doctor && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Stethoscope className="h-3 w-3" aria-hidden />
              {t.medicalRecordVisitDoctor}: {visit.doctor.name}
            </p>
          )}
        </div>
        {(onEdit || onDelete) && (
          <div className="flex flex-shrink-0 gap-0.5 opacity-70 transition-opacity group-hover:opacity-100">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(visit)}
              >
                <Pencil className="h-3.5 w-3.5" />
                <span className="sr-only">{t.medicalRecordVisitEdit}</span>
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(visit)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="sr-only">{t.medicalRecordVisitDelete}</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {(visit.chiefComplaint || visit.diagnosis) && (
        <dl className="mt-2 space-y-1 text-xs">
          {visit.chiefComplaint && (
            <div className="flex gap-2">
              <dt className="w-20 flex-shrink-0 text-muted-foreground">{t.medicalRecordVisitChiefComplaint}</dt>
              <dd className="min-w-0 text-foreground">{visit.chiefComplaint}</dd>
            </div>
          )}
          {visit.diagnosis && (
            <div className="flex gap-2">
              <dt className="w-20 flex-shrink-0 text-muted-foreground">{t.medicalRecordVisitDiagnosis}</dt>
              <dd className="min-w-0 text-foreground">{visit.diagnosis}</dd>
            </div>
          )}
        </dl>
      )}

      {visit.notes && <p className="mt-1.5 text-xs text-muted-foreground">{visit.notes}</p>}

      {vitals.length > 0 && (
        <p className="mt-2 border-t border-border pt-2 font-mono text-[11px] text-muted-foreground">
          {vitals.join("  ·  ")}
        </p>
      )}
    </div>
  );
}
