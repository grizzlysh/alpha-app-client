import type { JSX } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, FileText, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/utils/cn";
import type { RootState } from "@/store";
import { useLanguage } from "@/hooks/useLanguage";
import { useCan } from "@/hooks/usePermission";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { useTablePageState } from "@/hooks/useTablePageState";
import { SearchInput } from "@/components/shared/SearchInput";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { PrescriptionTable } from "@/components/prescriptions/PrescriptionTable";
import { PrescriptionStatusBadge } from "@/components/prescriptions/PrescriptionTable";
import { PrescriptionDetailsPanel } from "@/components/prescriptions/PrescriptionDetailsPanel";
import { PrescriptionFormModal } from "@/components/prescriptions/PrescriptionFormModal";
import { PrescriptionDeleteModal } from "@/components/prescriptions/PrescriptionDeleteModal";
import type { PrescriptionListItem, Prescription } from "@/types/prescription";
import { getPrescriptions, getPrescriptionsQueue, getPrescription } from "@/service/prescriptionService";
import { formatDate } from "@/utils/dateHelpers";
import { useNameFormat } from "@/hooks/useNameFormat";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; prescription: PrescriptionListItem }
  | { mode: "delete"; prescription: PrescriptionListItem }
  | { mode: "detail"; prescription: PrescriptionListItem }
  | null;

type ActiveTab = "all" | "queue";

export default function PrescriptionsPage(): JSX.Element {
  const { t } = useLanguage();
  const can = useCan();
  const pharmacyUuid = useSelector((state: RootState) => state.auth.currentPharmacy?.uuid);
  const pageTitleRef = useScrollAwareTitle();
  const {
    searchInput,
    debouncedSearch,
    page,
    setPage,
    limit,
    handleLimitChange,
    handleSearchChange,
  } = useTablePageState();
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [modal, setModal] = useState<ModalState>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "PENDING" | "DISPENSED" | "PARTIAL" | "CANCELLED" | "EXPIRED">("all");
  const [searchParams, setSearchParams] = useSearchParams();

  // Deep link (e.g. from a medical visit): /prescriptions?open=<uuid>
  const openUuid = searchParams.get("open");
  useEffect(() => {
    if (!openUuid) return;
    let cancelled = false;
    getPrescription(openUuid)
      .then((res) => {
        if (!cancelled && res.success && res.data) setModal({ mode: "detail", prescription: res.data });
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setSearchParams((prev) => { prev.delete("open"); return prev; }, { replace: true });
      });
    return () => { cancelled = true; };
  }, [openUuid, setSearchParams]);

  // ── Data queries ────────────────────────────────────────────────────────────

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["prescriptions", pharmacyUuid, page, limit, debouncedSearch, filterStatus],
    queryFn: () =>
      getPrescriptions({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      }),
    placeholderData: keepPreviousData,
    enabled: activeTab === "all",
  });

  const { data: queueData, isLoading: queueLoading } = useQuery({
    queryKey: ["prescriptions-queue", pharmacyUuid],
    queryFn: getPrescriptionsQueue,
    refetchInterval: 60_000,
    enabled: activeTab === "queue",
  });

  const prescriptions = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;
  const queue = queueData?.data ?? [];

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleFilterStatus(value: string): void {
    setFilterStatus(value as typeof filterStatus);
    setPage(1);
  }

  function closeModal(): void {
    setModal(null);
  }

  function handleSuccess(): void {
    const mode = modal?.mode;
    toast.success(
      <LiveToastMessage
        getMessage={(t) =>
          mode === "create"
            ? t.prescriptionCreateSuccess
            : mode === "edit"
              ? t.prescriptionUpdateSuccess
              : t.prescriptionDeleteSuccess
        }
      />
    );
    closeModal();
  }

  async function handleOpenDetail(prescription: PrescriptionListItem): Promise<void> {
    setModal({ mode: "detail", prescription });
  }

  // For edit — we need full data
  const [editData, setEditData] = useState<Prescription | null>(null);

  async function handleOpenEdit(prescription: PrescriptionListItem): Promise<void> {
    try {
      const res = await getPrescription(prescription.uuid);
      if (res.success && res.data) {
        setEditData(res.data);
        setModal({ mode: "edit", prescription });
      }
    } catch {
      setModal({ mode: "edit", prescription });
    }
  }

  const statusOptions = [
    { value: "all", label: `${t.prescriptionFilterStatus}: ${t.filterAll}` },
    { value: "PENDING", label: t.prescriptionStatusPending },
    { value: "DISPENSED", label: t.prescriptionStatusDispensed },
    { value: "PARTIAL", label: t.prescriptionStatusPartial },
    { value: "CANCELLED", label: t.prescriptionStatusCancelled },
    { value: "EXPIRED", label: t.prescriptionStatusExpired },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2
          ref={pageTitleRef}
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          {t.navPrescriptions}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.prescriptionsSubtitle}</p>
      </div>

      <Card className="overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center gap-0 border-b border-border px-5">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === "all"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="h-4 w-4" />
            {t.prescriptionAllTab}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("queue")}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === "queue"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Clock className="h-4 w-4" />
            {t.prescriptionQueueTab}
            {queue.length > 0 && (
              <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-yellow-500 px-1.5 text-xs font-bold text-white">
                {queue.length}
              </span>
            )}
          </button>
        </div>

        {/* Toolbar — only on "all" tab */}
        {activeTab === "all" && (
          <div className="overflow-x-auto border-b border-border">
            <div className="flex w-max min-w-full items-center gap-2 px-5 py-3">
              <Combobox
                value={filterStatus}
                onValueChange={handleFilterStatus}
                options={statusOptions}
                placeholder={t.prescriptionFilterStatus}
                className="h-10 w-[12rem] shrink-0 rounded-xl text-sm"
              />
              <SearchInput
                value={searchInput}
                onChange={handleSearchChange}
                placeholder={t.prescriptionSearchPlaceholder}
                isFetching={isFetching && !isLoading}
              />
              {can("prescriptions.create") && (
              <Button
                onClick={() => setModal({ mode: "create" })}
                variant="success"
                className="shrink-0 gap-2 rounded-xl"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline-block sm:w-16 sm:text-center">
                  {t.prescriptionAdd}
                </span>
              </Button>
              )}
            </div>
          </div>
        )}

        {/* All tab — data table */}
        {activeTab === "all" && (
          <PrescriptionTable
            prescriptions={prescriptions}
            isLoading={isLoading}
            search={debouncedSearch}
            t={t}
            page={page}
            limit={limit}
            total={total}
            totalPages={totalPages}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
            onAdd={can("prescriptions.create") ? () => setModal({ mode: "create" }) : undefined}
            onDetails={(p) => handleOpenDetail(p)}
            onEdit={can("prescriptions.update") ? (p) => handleOpenEdit(p) : undefined}
            onDelete={can("prescriptions.delete") ? (p) => setModal({ mode: "delete", prescription: p }) : undefined}
          />
        )}

        {/* Queue tab */}
        {activeTab === "queue" && (
          <QueueView
            queue={queue}
            isLoading={queueLoading}
            t={t}
            onOpenDetail={(p) => handleOpenDetail(p)}
          />
        )}
      </Card>

      {/* Detail panel */}
      {modal?.mode === "detail" && (
        <PrescriptionDetailsPanel
          prescription={modal.prescription}
          t={t}
          onClose={closeModal}
          onEdit={can("prescriptions.update") ? () => handleOpenEdit(modal.prescription) : undefined}
          onDelete={can("prescriptions.delete") ? () => setModal({ mode: "delete", prescription: modal.prescription }) : undefined}
          showCancelDialog={showCancelDialog}
          onCancelRequest={() => setShowCancelDialog(true)}
          onCancelClose={() => setShowCancelDialog(false)}
        />
      )}

      {/* Form modal */}
      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <PrescriptionFormModal
          mode={modal.mode}
          initialData={modal.mode === "edit" ? (editData ?? undefined) : undefined}
          onClose={() => { closeModal(); setEditData(null); }}
          onSuccess={() => { handleSuccess(); setEditData(null); }}
        />
      )}

      {/* Delete modal */}
      {modal?.mode === "delete" && (
        <PrescriptionDeleteModal
          prescription={modal.prescription}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}

    </div>
  );
}

// ── Queue view ────────────────────────────────────────────────────────────────

interface QueueViewProps {
  queue: PrescriptionListItem[];
  isLoading: boolean;
  t: ReturnType<typeof useLanguage>["t"];
  onOpenDetail: (p: PrescriptionListItem) => void;
}

function QueueView({ queue, isLoading, t, onOpenDetail }: QueueViewProps): JSX.Element {
  const fmt = useNameFormat();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
          <Clock className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <p className="text-base font-semibold text-foreground">{t.prescriptionQueueEmpty}</p>
        <p className="text-sm text-muted-foreground">{t.prescriptionQueueEmptyDesc}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {queue.map((p, idx) => (
        <button
          key={p.uuid}
          type="button"
          onClick={() => onOpenDetail(p)}
          className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/40"
        >
          {/* Queue number */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-sm font-bold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
            {idx + 1}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium name-case text-foreground">{p.customer.name}</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {p.prescriptionNumber && <span>{p.prescriptionNumber}</span>}
              {p.doctor && <span>{fmt(p.doctor.name, { doctor: true })}</span>}
              <span>{formatDate(p.prescribedAt)}</span>
            </div>
          </div>

          {/* Status */}
          <PrescriptionStatusBadge status={p.status} t={t} />
        </button>
      ))}
    </div>
  );
}
