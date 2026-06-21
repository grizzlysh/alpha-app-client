import type { JSX } from "react";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { useTablePageState } from "@/hooks/useTablePageState";
import { SearchInput } from "@/components/shared/SearchInput";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import type { StockReturn, StockReturnStatus } from "@/types/stockReturn";
import { getStockReturns } from "@/service/stockReturnService";
import { getDistributorsDropdown } from "@/service/distributorService";
import { StockReturnTable } from "@/components/stock-returns/StockReturnTable";
import { StockReturnDetailPanel } from "@/components/stock-returns/StockReturnDetailPanel";
import { StockReturnFormModal } from "@/components/stock-returns/StockReturnFormModal";
import { StockReturnCompleteModal } from "@/components/stock-returns/StockReturnCompleteModal";
import { StockReturnRejectModal } from "@/components/stock-returns/StockReturnRejectModal";
import { StockReturnCancelModal } from "@/components/stock-returns/StockReturnCancelModal";
import { StockReturnDeleteModal } from "@/components/stock-returns/StockReturnDeleteModal";

// ── Modal state ───────────────────────────────────────────────────────────────

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; stockReturn: StockReturn }
  | { mode: "detail"; stockReturn: StockReturn }
  | { mode: "complete"; stockReturn: StockReturn }
  | { mode: "reject"; stockReturn: StockReturn }
  | { mode: "cancel"; stockReturn: StockReturn }
  | { mode: "delete"; stockReturn: StockReturn }
  | null;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StockReturnsPage(): JSX.Element {
  const { t } = useLanguage();
  const pageTitleRef = useScrollAwareTitle();

  const { searchInput, debouncedSearch, page, setPage, limit, handleLimitChange, handleSearchChange } =
    useTablePageState();
  const [modal, setModal] = useState<ModalState>(null);
  const [filterStatus, setFilterStatus] = useState<StockReturnStatus | "all">("all");
  const [filterDistributor, setFilterDistributor] = useState("all");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["stock-returns", page, limit, debouncedSearch, filterStatus, filterDistributor],
    queryFn: () =>
      getStockReturns({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        distributorUuid: filterDistributor !== "all" ? filterDistributor : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const { data: distributorsData } = useQuery({
    queryKey: ["distributors-dropdown"],
    queryFn: () => getDistributorsDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const stockReturns = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  function handleFilterStatus(value: string): void {
    setFilterStatus(value as StockReturnStatus | "all");
    setPage(1);
  }

  function handleFilterDistributor(value: string): void {
    setFilterDistributor(value);
    setPage(1);
  }

  function closeModal(): void {
    setModal(null);
  }

  function handleCreateSuccess(stockReturn: StockReturn): void {
    toast.success(
      <LiveToastMessage getMessage={(t) => t.srCreateSuccess} />
    );
    setModal({ mode: "detail", stockReturn });
  }

  function handleEditSuccess(stockReturn: StockReturn): void {
    toast.success(
      <LiveToastMessage getMessage={(t) => t.srUpdateSuccess} />
    );
    setModal({ mode: "detail", stockReturn });
  }

  function handleCompleteSuccess(stockReturn: StockReturn): void {
    setModal({ mode: "detail", stockReturn });
  }

  function handleRejectSuccess(stockReturn: StockReturn): void {
    setModal({ mode: "detail", stockReturn });
  }

  function handleCancelSuccess(stockReturn: StockReturn): void {
    setModal({ mode: "detail", stockReturn });
  }

  function handleDeleteSuccess(): void {
    closeModal();
  }

  const distributorFilterOptions = [
    { value: "all", label: `${t.srFilterDistributor}: ${t.filterAll}` },
    ...(distributorsData?.data ?? []).map((d) => ({ value: d.uuid, label: d.name.toUpperCase() })),
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2
          ref={pageTitleRef}
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          {t.navStockReturns}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.srSubtitle}</p>
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
                { value: "all", label: `${t.srFilterStatus}: ${t.filterAll}` },
                { value: "ON_PROCESS", label: t.srStatusOnProcess },
                { value: "COMPLETED", label: t.srStatusCompleted },
                { value: "CANCELLED", label: t.srStatusCancelled },
                { value: "REJECTED", label: t.srStatusRejected },
              ]}
              placeholder={t.srFilterStatus}
              className="h-10 w-[11rem] shrink-0 rounded-xl text-sm"
            />

            {/* Distributor filter */}
            <Combobox
              value={filterDistributor}
              onValueChange={handleFilterDistributor}
              options={distributorFilterOptions}
              placeholder={t.srFilterDistributor}
              className="h-10 w-[13rem] shrink-0 rounded-xl text-sm"
            />

            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t.srSearchPlaceholder}
              isFetching={isFetching && !isLoading}
            />

            <Button
              onClick={() => setModal({ mode: "create" })}
              variant="success"
              className="shrink-0 gap-2 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-block sm:w-16 sm:text-center">
                {t.srAdd}
              </span>
            </Button>
          </div>
        </div>

        {/* Table */}
        <StockReturnTable
          stockReturns={stockReturns}
          isLoading={isLoading}
          search={debouncedSearch}
          t={t}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          onAdd={() => setModal({ mode: "create" })}
          onDetails={(sr) => setModal({ mode: "detail", stockReturn: sr })}
          onEdit={(sr) => setModal({ mode: "edit", stockReturn: sr })}
          onComplete={(sr) => setModal({ mode: "complete", stockReturn: sr })}
          onReject={(sr) => setModal({ mode: "reject", stockReturn: sr })}
          onCancel={(sr) => setModal({ mode: "cancel", stockReturn: sr })}
          onDelete={(sr) => setModal({ mode: "delete", stockReturn: sr })}
        />
      </Card>

      {/* Detail panel */}
      {modal?.mode === "detail" && (
        <StockReturnDetailPanel
          stockReturn={modal.stockReturn}
          t={t}
          onClose={closeModal}
          onEdit={() => setModal({ mode: "edit", stockReturn: modal.stockReturn })}
          onComplete={() => setModal({ mode: "complete", stockReturn: modal.stockReturn })}
          onReject={() => setModal({ mode: "reject", stockReturn: modal.stockReturn })}
          onCancel={() => setModal({ mode: "cancel", stockReturn: modal.stockReturn })}
          onDelete={() => setModal({ mode: "delete", stockReturn: modal.stockReturn })}
        />
      )}

      {/* Create / edit modal */}
      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <StockReturnFormModal
          mode={modal.mode}
          stockReturn={modal.mode === "edit" ? modal.stockReturn : undefined}
          onClose={closeModal}
          onSuccess={modal.mode === "edit" ? handleEditSuccess : handleCreateSuccess}
        />
      )}

      {/* Complete modal */}
      {modal?.mode === "complete" && (
        <StockReturnCompleteModal
          stockReturn={modal.stockReturn}
          onClose={closeModal}
          onSuccess={handleCompleteSuccess}
        />
      )}

      {/* Reject modal */}
      {modal?.mode === "reject" && (
        <StockReturnRejectModal
          stockReturn={modal.stockReturn}
          onClose={closeModal}
          onSuccess={handleRejectSuccess}
        />
      )}

      {/* Cancel modal */}
      {modal?.mode === "cancel" && (
        <StockReturnCancelModal
          stockReturn={modal.stockReturn}
          onClose={closeModal}
          onSuccess={handleCancelSuccess}
        />
      )}

      {/* Delete modal */}
      {modal?.mode === "delete" && (
        <StockReturnDeleteModal
          stockReturn={modal.stockReturn}
          onClose={closeModal}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
