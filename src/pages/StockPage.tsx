import type { JSX } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import type { RootState } from "@/store";
import { useLanguage } from "@/hooks/useLanguage";
import { useCan } from "@/hooks/usePermission";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { useTablePageState } from "@/hooks/useTablePageState";
import { SearchInput } from "@/components/shared/SearchInput";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { getStocks } from "@/service/stockService";
import { StockTable } from "@/components/stock/StockTable";
import { StockDetailPanel } from "@/components/stock/StockDetailPanel";
import { BarcodePrintModal } from "@/components/stock/BarcodePrintModal";
import { StockAdjustModal } from "@/components/stock/StockAdjustModal";
import { StockUpdatePriceModal } from "@/components/stock/StockUpdatePriceModal";
import { StockUpdateReorderModal } from "@/components/stock/StockUpdateReorderModal";
import { StockDisposalFormModal } from "@/components/stock-disposals/StockDisposalFormModal";
import { StockReturnFormModal } from "@/components/stock-returns/StockReturnFormModal";
import type { Stock, StockDetail } from "@/types/stock";
import { DataTransferButtons } from "@/components/data-transfer/DataTransferButtons";
import { OpeningStockImportModal } from "@/components/data-transfer/ImportModals";

// ── Types ─────────────────────────────────────────────────────────────────────

type ModalState =
  | { mode: "detail"; stock: Stock }
  | { mode: "opening" }
  | { mode: "adjust"; stock: Stock; stockDetail: StockDetail }
  | { mode: "price"; stock: Stock }
  | { mode: "reorder"; stock: Stock }
  | { mode: "dispose"; stock: Stock; stockDetail: StockDetail }
  | { mode: "return"; stock: Stock; stockDetail: StockDetail }
  | null;

type StockFilter = "all" | "lowStock" | "expiringSoon";

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StockPage(): JSX.Element {
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

  const [modal, setModal] = useState<ModalState>(null);
  const [printDetailUuid, setPrintDetailUuid] = useState<string | null>(null);
  const [filter, setFilter] = useState<StockFilter>("all");

  // ── Main query ────────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["stocks", pharmacyUuid, page, limit, debouncedSearch, filter],
    queryFn: () =>
      getStocks({
        page,
        limit,
        search: debouncedSearch || undefined,
        isLowStock: filter === "lowStock" ? true : undefined,
        isExpiringSoon: filter === "expiringSoon" ? true : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const stocks = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  // ── Helpers ───────────────────────────────────────────────────────────────────

  function handleFilterChange(value: string): void {
    setFilter(value as StockFilter);
    setPage(1);
  }

  function closeModal(): void {
    setModal(null);
  }

  function handleAdjustSuccess(): void {
    toast.success(
      <LiveToastMessage getMessage={(t) => t.stockAdjustSuccess} />
    );
    closeModal();
  }

  function handlePriceSuccess(): void {
    toast.success(
      <LiveToastMessage getMessage={(t) => t.stockUpdatePriceSuccess} />
    );
    closeModal();
  }

  function handleReorderSuccess(): void {
    toast.success(
      <LiveToastMessage getMessage={(t) => t.stockUpdateReorderSuccess} />
    );
    closeModal();
  }

  function handleDisposeSuccess(): void {
    toast.success(
      <LiveToastMessage getMessage={(t) => t.sdCreateSuccess} />
    );
    if (modal?.mode === "dispose") {
      setModal({ mode: "detail", stock: modal.stock });
    } else {
      closeModal();
    }
  }

  function handleReturnSuccess(): void {
    toast.success(
      <LiveToastMessage getMessage={(t) => t.srCreateSuccess} />
    );
    if (modal?.mode === "return") {
      setModal({ mode: "detail", stock: modal.stock });
    } else {
      closeModal();
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2
          ref={pageTitleRef}
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          {t.navStock}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t.stockSubtitle}
        </p>
      </div>

      {/* Main card */}
      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-border md:overflow-x-auto">
          <div className="table-toolbar">
            {/* Status filter */}
            <Combobox
              value={filter}
              onValueChange={handleFilterChange}
              options={[
                { value: "all", label: `${t.stockFilterStatus}: ${t.filterAll}` },
                { value: "lowStock", label: t.stockFilterLowStock },
                { value: "expiringSoon", label: t.stockFilterExpiringSoon },
              ]}
              placeholder={t.stockFilterStatus}
              className="h-10 w-[13rem] shrink-0 rounded-xl text-sm"
            />

            {/* Search */}
            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t.stockSearchPlaceholder}
              isFetching={isFetching && !isLoading}
            />
            {/* Day-one stock count for a pharmacy that is new to the system */}
            {can("invoices.create") && (
              <DataTransferButtons
                onImport={() => setModal({ mode: "opening" })}
                importLabel={t.importOpeningStockBtn}
                importHint={t.importOpeningStockDesc}
              />
            )}
          </div>
        </div>

        {/* Table */}
        <StockTable
          stocks={stocks}
          isLoading={isLoading}
          search={debouncedSearch}
          t={t}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          onDetails={(s) => setModal({ mode: "detail", stock: s })}
          onSetPrice={can("stock.adjust") ? (s) => setModal({ mode: "price", stock: s }) : undefined}
          onSetReorder={can("stock.adjust") ? (s) => setModal({ mode: "reorder", stock: s }) : undefined}
        />
      </Card>

      {/* Detail panel */}
      {modal?.mode === "opening" && <OpeningStockImportModal onClose={() => setModal(null)} />}

      {/* Opens on top of the stock detail, which stays open behind it. */}
      {printDetailUuid && (
        <BarcodePrintModal stockDetailUuid={printDetailUuid} onClose={() => setPrintDetailUuid(null)} />
      )}

      {modal?.mode === "detail" && (
        <StockDetailPanel
          stock={modal.stock}
          t={t}
          onClose={closeModal}
          onSetPrice={can("stock.adjust") ? () => setModal({ mode: "price", stock: modal.stock }) : undefined}
          onSetReorder={can("stock.adjust") ? () => setModal({ mode: "reorder", stock: modal.stock }) : undefined}
          onAdjust={can("stock.adjust") ? (detail) =>
            setModal({ mode: "adjust", stock: modal.stock, stockDetail: detail }) : undefined}
          onDispose={can("stock_disposal.create") ? (detail) =>
            setModal({ mode: "dispose", stock: modal.stock, stockDetail: detail }) : undefined}
          onReturn={can("stock_return.create") ? (detail) =>
            setModal({ mode: "return", stock: modal.stock, stockDetail: detail }) : undefined}
          onPrint={(detail) => setPrintDetailUuid(detail.uuid)}
        />
      )}

      {/* Adjust modal */}
      {modal?.mode === "adjust" && (
        <StockAdjustModal
          stock={modal.stock}
          stockDetail={modal.stockDetail}
          onClose={closeModal}
          onSuccess={handleAdjustSuccess}
        />
      )}

      {/* Update price modal */}
      {modal?.mode === "price" && (
        <StockUpdatePriceModal
          stock={modal.stock}
          onClose={closeModal}
          onSuccess={handlePriceSuccess}
        />
      )}

      {/* Update reorder level modal */}
      {modal?.mode === "reorder" && (
        <StockUpdateReorderModal
          stock={modal.stock}
          onClose={closeModal}
          onSuccess={handleReorderSuccess}
        />
      )}

      {/* Dispose modal — pre-filled from batch */}
      {modal?.mode === "dispose" && (
        <StockDisposalFormModal
          mode="create"
          prefillDetail={{
            stockDetailUuid: modal.stockDetail.uuid,
            quantityPieces: modal.stockDetail.quantityPieces,
          }}
          onClose={() => setModal({ mode: "detail", stock: modal.stock })}
          onSuccess={handleDisposeSuccess}
        />
      )}

      {/* Return modal — pre-filled from batch */}
      {modal?.mode === "return" && (
        <StockReturnFormModal
          mode="create"
          prefillDetail={{
            stockDetailUuid: modal.stockDetail.uuid,
            quantityPieces: modal.stockDetail.quantityPieces,
            distributorUuid: modal.stockDetail.distributor.uuid,
          }}
          onClose={() => setModal({ mode: "detail", stock: modal.stock })}
          onSuccess={handleReturnSuccess}
        />
      )}
    </div>
  );
}
