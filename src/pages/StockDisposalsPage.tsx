import type { JSX } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import type { RootState } from "@/store";
import { useLanguage } from "@/hooks/useLanguage";
import { useCan } from "@/hooks/usePermission";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { useTablePageState } from "@/hooks/useTablePageState";
import { SearchInput } from "@/components/shared/SearchInput";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import type { StockDisposal, StockDisposalStatus } from "@/types/stockDisposal";
import { getStockDisposals } from "@/service/stockDisposalService";
import { StockDisposalTable } from "@/components/stock-disposals/StockDisposalTable";
import { StockDisposalDetailPanel } from "@/components/stock-disposals/StockDisposalDetailPanel";
import { StockDisposalFormModal } from "@/components/stock-disposals/StockDisposalFormModal";
import { StockDisposalCompleteModal } from "@/components/stock-disposals/StockDisposalCompleteModal";
import { StockDisposalCancelModal } from "@/components/stock-disposals/StockDisposalCancelModal";
import { StockDisposalDeleteModal } from "@/components/stock-disposals/StockDisposalDeleteModal";

// ── Modal state ───────────────────────────────────────────────────────────────

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; disposal: StockDisposal }
  | { mode: "detail"; disposal: StockDisposal }
  | { mode: "complete"; disposal: StockDisposal }
  | { mode: "cancel"; disposal: StockDisposal }
  | { mode: "delete"; disposal: StockDisposal }
  | null;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StockDisposalsPage(): JSX.Element {
  const { t } = useLanguage();
  const can = useCan();
  const pharmacyUuid = useSelector((state: RootState) => state.auth.currentPharmacy?.uuid);
  const pageTitleRef = useScrollAwareTitle();

  const { searchInput, debouncedSearch, page, setPage, limit, handleLimitChange, handleSearchChange } =
    useTablePageState();
  const [modal, setModal] = useState<ModalState>(null);
  const [filterStatus, setFilterStatus] = useState<StockDisposalStatus | "all">("all");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["stock-disposals", pharmacyUuid, page, limit, debouncedSearch, filterStatus],
    queryFn: () =>
      getStockDisposals({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const disposals = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  function handleFilterStatus(value: string): void {
    setFilterStatus(value as StockDisposalStatus | "all");
    setPage(1);
  }

  function closeModal(): void {
    setModal(null);
  }

  function handleCreateSuccess(disposal: StockDisposal): void {
    toast.success(
      <LiveToastMessage getMessage={(t) => t.sdCreateSuccess} />
    );
    setModal({ mode: "detail", disposal });
  }

  function handleEditSuccess(disposal: StockDisposal): void {
    toast.success(
      <LiveToastMessage getMessage={(t) => t.sdUpdateSuccess} />
    );
    setModal({ mode: "detail", disposal });
  }

  function handleCompleteSuccess(disposal: StockDisposal): void {
    setModal({ mode: "detail", disposal });
  }

  function handleCancelSuccess(disposal: StockDisposal): void {
    setModal({ mode: "detail", disposal });
  }

  function handleDeleteSuccess(): void {
    closeModal();
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2
          ref={pageTitleRef}
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          {t.navStockDisposals}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.sdSubtitle}</p>
      </div>

      {/* Main card */}
      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="overflow-x-auto border-b border-border">
          <div className="flex w-max min-w-full items-center gap-2 px-5 py-3">
            {/* Status filter */}
            <Combobox
              value={filterStatus}
              onValueChange={handleFilterStatus}
              options={[
                { value: "all", label: `${t.sdFilterStatus}: ${t.filterAll}` },
                { value: "DRAFT", label: t.sdStatusDraft },
                { value: "COMPLETED", label: t.sdStatusCompleted },
                { value: "CANCELLED", label: t.sdStatusCancelled },
              ]}
              placeholder={t.sdFilterStatus}
              className="h-10 w-[11rem] shrink-0 rounded-xl text-sm"
            />

            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t.sdSearchPlaceholder}
              isFetching={isFetching && !isLoading}
            />

            {can("stock_disposal.create") && (
            <Button
              onClick={() => setModal({ mode: "create" })}
              variant="success"
              className="shrink-0 gap-2 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-block sm:w-16 sm:text-center">
                {t.sdAdd}
              </span>
            </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <StockDisposalTable
          disposals={disposals}
          isLoading={isLoading}
          search={debouncedSearch}
          t={t}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          onAdd={can("stock_disposal.create") ? () => setModal({ mode: "create" }) : undefined}
          onDetails={(d) => setModal({ mode: "detail", disposal: d })}
          onEdit={can("stock_disposal.update") ? (d) => setModal({ mode: "edit", disposal: d }) : undefined}
          onComplete={can("stock_disposal.update") ? (d) => setModal({ mode: "complete", disposal: d }) : undefined}
          onCancel={can("stock_disposal.update") ? (d) => setModal({ mode: "cancel", disposal: d }) : undefined}
          onDelete={can("stock_disposal.delete") ? (d) => setModal({ mode: "delete", disposal: d }) : undefined}
        />
      </Card>

      {/* Detail panel */}
      {modal?.mode === "detail" && (
        <StockDisposalDetailPanel
          disposal={modal.disposal}
          t={t}
          onClose={closeModal}
          onEdit={can("stock_disposal.update") ? () => setModal({ mode: "edit", disposal: modal.disposal }) : undefined}
          onComplete={can("stock_disposal.update") ? () => setModal({ mode: "complete", disposal: modal.disposal }) : undefined}
          onCancel={can("stock_disposal.update") ? () => setModal({ mode: "cancel", disposal: modal.disposal }) : undefined}
          onDelete={can("stock_disposal.delete") ? () => setModal({ mode: "delete", disposal: modal.disposal }) : undefined}
        />
      )}

      {/* Create / edit modal */}
      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <StockDisposalFormModal
          mode={modal.mode}
          disposal={modal.mode === "edit" ? modal.disposal : undefined}
          onClose={closeModal}
          onSuccess={modal.mode === "edit" ? handleEditSuccess : handleCreateSuccess}
        />
      )}

      {/* Complete modal */}
      {modal?.mode === "complete" && (
        <StockDisposalCompleteModal
          disposal={modal.disposal}
          onClose={closeModal}
          onSuccess={handleCompleteSuccess}
        />
      )}

      {/* Cancel modal */}
      {modal?.mode === "cancel" && (
        <StockDisposalCancelModal
          disposal={modal.disposal}
          onClose={closeModal}
          onSuccess={handleCancelSuccess}
        />
      )}

      {/* Delete modal */}
      {modal?.mode === "delete" && (
        <StockDisposalDeleteModal
          disposal={modal.disposal}
          onClose={closeModal}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
