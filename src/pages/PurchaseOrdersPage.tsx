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
import type { PurchaseOrder, PurchaseOrderStatus } from "@/types/purchaseOrder";
import { getPurchaseOrders } from "@/service/purchaseOrderService";
import { getDistributorsDropdown } from "@/service/distributorService";
import { PurchaseOrderTable } from "@/components/purchase-orders/PurchaseOrderTable";
import { PurchaseOrderDetailPanel } from "@/components/purchase-orders/PurchaseOrderDetailPanel";
import { PurchaseOrderFormModal } from "@/components/purchase-orders/PurchaseOrderFormModal";
import { PurchaseOrderCancelModal } from "@/components/purchase-orders/PurchaseOrderCancelModal";
import { PurchaseOrderDeleteModal } from "@/components/purchase-orders/PurchaseOrderDeleteModal";
import { PurchaseOrderPrintModal } from "@/components/purchase-orders/PurchaseOrderPrintModal";
import { PurchaseOrderCompleteModal } from "@/components/purchase-orders/PurchaseOrderCompleteModal";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";

// ── Modal state ───────────────────────────────────────────────────────────────

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; order: PurchaseOrder }
  | { mode: "repurchase"; order: PurchaseOrder }
  | { mode: "detail"; order: PurchaseOrder }
  | { mode: "cancel"; order: PurchaseOrder }
  | { mode: "delete"; order: PurchaseOrder }
  | { mode: "print"; order: PurchaseOrder }
  | { mode: "complete"; order: PurchaseOrder }
  | null;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PurchaseOrdersPage(): JSX.Element {
  const { t } = useLanguage();
  const pageTitleRef = useScrollAwareTitle();

  const { searchInput, debouncedSearch, page, setPage, limit, handleLimitChange, handleSearchChange } = useTablePageState();
  const [modal, setModal] = useState<ModalState>(null);

  // ── Filter state ──────────────────────────────────────────────────────────────
  const [filterStatus, setFilterStatus] = useState<PurchaseOrderStatus | "all">("all");
  const [filterDistributor, setFilterDistributor] = useState("all");

  // ── Distributor dropdown for filter ──────────────────────────────────────────
  const { data: distributorsData } = useQuery({
    queryKey: ["distributors-dropdown"],
    queryFn: () => getDistributorsDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const distributorFilterOptions = [
    { value: "all", label: `${t.poFilterDistributor}: ${t.filterAll}` },
    ...(distributorsData?.data ?? []).map((d) => ({
      value: d.uuid,
      label: d.name,
    })),
  ];

  // ── Main query ────────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "purchase-orders",
      page,
      limit,
      debouncedSearch,
      filterStatus,
      filterDistributor,
    ],
    queryFn: () =>
      getPurchaseOrders({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        distributorUuid:
          filterDistributor !== "all" ? filterDistributor : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const orders = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  // ── Helpers ───────────────────────────────────────────────────────────────────

  function handleFilterStatus(value: string): void {
    setFilterStatus(value as PurchaseOrderStatus | "all");
    setPage(1);
  }

  function handleFilterDistributor(value: string): void {
    setFilterDistributor(value);
    setPage(1);
  }

  function closeModal(): void {
    setModal(null);
  }

  function handleCreateSuccess(order: PurchaseOrder): void {
    toast.success(
      <LiveToastMessage getMessage={(t) => t.poCreateSuccess} />
    );
    setModal({ mode: "detail", order });
  }

  function handleEditSuccess(order: PurchaseOrder): void {
    toast.success(
      <LiveToastMessage getMessage={(t) => t.poUpdateSuccess} />
    );
    setModal({ mode: "detail", order });
  }

  function handleDeleteSuccess(): void {
    closeModal();
  }

  function handleCancelSuccess(order: PurchaseOrder): void {
    setModal({ mode: "detail", order });
  }

  function handlePrintSuccess(order: PurchaseOrder): void {
    setModal({ mode: "detail", order });
  }

  function handleCompleteSuccess(order: PurchaseOrder): void {
    setModal({ mode: "detail", order });
  }

  function handleRepurchaseSuccess(order: PurchaseOrder): void {
    toast.success(
      <LiveToastMessage getMessage={(t) => t.poCreateSuccess} />
    );
    setModal({ mode: "detail", order });
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2
          ref={pageTitleRef}
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          {t.navPurchaseOrders}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t.poSubtitle}
        </p>
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
                {
                  value: "all",
                  label: `${t.poFilterStatus}: ${t.filterAll}`,
                },
                { value: "DRAFT", label: t.poStatusDraft },
                { value: "SENT", label: t.poStatusSent },
                { value: "COMPLETED", label: t.poStatusCompleted },
                { value: "CANCELLED", label: t.poStatusCancelled },
              ]}
              placeholder={t.poFilterStatus}
              className="h-10 w-[11rem] shrink-0 rounded-xl text-sm"
            />

            {/* Distributor filter */}
            <Combobox
              value={filterDistributor}
              onValueChange={handleFilterDistributor}
              options={distributorFilterOptions}
              placeholder={t.poFilterDistributor}
              className="h-10 w-[13rem] shrink-0 rounded-xl text-sm"
            />

            {/* Search */}
            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t.poSearchPlaceholder}
              isFetching={isFetching && !isLoading}
            />

            {/* Add button */}
            <Button
              onClick={() => setModal({ mode: "create" })}
              variant="success"
              className="shrink-0 gap-2 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-block sm:w-16 sm:text-center">
                {t.poAdd}
              </span>
            </Button>
          </div>
        </div>

        {/* Table */}
        <PurchaseOrderTable
          orders={orders}
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
          onDetails={(o) => setModal({ mode: "detail", order: o })}
          onEdit={(o) => setModal({ mode: "edit", order: o })}
          onPrint={(o) => setModal({ mode: "print", order: o })}
          onMarkReceived={(o) => setModal({ mode: "complete", order: o })}
          onRepurchase={(o) => setModal({ mode: "repurchase", order: o })}
          onCancel={(o) => setModal({ mode: "cancel", order: o })}
          onDelete={(o) => setModal({ mode: "delete", order: o })}
        />
      </Card>

      {/* Detail panel */}
      {modal?.mode === "detail" && (
        <PurchaseOrderDetailPanel
          order={modal.order}
          t={t}
          onClose={closeModal}
          onEdit={() => setModal({ mode: "edit", order: modal.order })}
          onPrint={() => setModal({ mode: "print", order: modal.order })}
          onRepurchase={() => setModal({ mode: "repurchase", order: modal.order })}
          onCancel={() => setModal({ mode: "cancel", order: modal.order })}
          onDelete={() => setModal({ mode: "delete", order: modal.order })}
        />
      )}

      {/* Create / edit / repurchase modal */}
      {(modal?.mode === "create" || modal?.mode === "edit" || modal?.mode === "repurchase") && (
        <PurchaseOrderFormModal
          mode={modal.mode === "edit" ? "edit" : "create"}
          order={modal.mode === "edit" ? modal.order : undefined}
          repurchaseFrom={modal.mode === "repurchase" ? modal.order : undefined}
          onClose={closeModal}
          onSuccess={
            modal.mode === "edit" ? handleEditSuccess :
            modal.mode === "repurchase" ? handleRepurchaseSuccess :
            handleCreateSuccess
          }
        />
      )}

      {/* Print modal */}
      {modal?.mode === "print" && (
        <PurchaseOrderPrintModal
          order={modal.order}
          onClose={closeModal}
          onSuccess={handlePrintSuccess}
        />
      )}

      {/* Mark as Received modal */}
      {modal?.mode === "complete" && (
        <PurchaseOrderCompleteModal
          order={modal.order}
          onClose={closeModal}
          onSuccess={handleCompleteSuccess}
        />
      )}

      {/* Cancel modal */}
      {modal?.mode === "cancel" && (
        <PurchaseOrderCancelModal
          order={modal.order}
          onClose={closeModal}
          onSuccess={handleCancelSuccess}
        />
      )}

      {/* Delete modal */}
      {modal?.mode === "delete" && (
        <PurchaseOrderDeleteModal
          order={modal.order}
          onClose={closeModal}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
