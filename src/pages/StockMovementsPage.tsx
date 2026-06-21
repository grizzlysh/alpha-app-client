import type { JSX } from "react";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { useTablePageState } from "@/hooks/useTablePageState";
import { SearchInput } from "@/components/shared/SearchInput";
import { getStockMovements } from "@/service/stockMovementService";
import { StockMovementTable } from "@/components/stock-movements/StockMovementTable";
import { StockMovementDetailPanel } from "@/components/stock-movements/StockMovementDetailPanel";
import type { StockMovement, StockMovementType, StockMovementReason } from "@/types/stockMovement";

// ── Types ─────────────────────────────────────────────────────────────────────

type ModalState = { mode: "detail"; movement: StockMovement } | null;

type TypeFilter = StockMovementType | "all";
type ReasonFilter = StockMovementReason | "all";

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StockMovementsPage(): JSX.Element {
  const { t } = useLanguage();
  const pageTitleRef = useScrollAwareTitle();

  const { searchInput, debouncedSearch, page, setPage, limit, handleLimitChange, handleSearchChange } =
    useTablePageState();
  const [modal, setModal] = useState<ModalState>(null);
  const [filterType, setFilterType] = useState<TypeFilter>("all");
  const [filterReason, setFilterReason] = useState<ReasonFilter>("all");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["stock-movements", page, limit, debouncedSearch, filterType, filterReason],
    queryFn: () =>
      getStockMovements({
        page,
        limit,
        search: debouncedSearch || undefined,
        type: filterType !== "all" ? filterType : undefined,
        reason: filterReason !== "all" ? filterReason : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const movements = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  function handleFilterType(value: string): void {
    setFilterType(value as TypeFilter);
    setPage(1);
  }

  function handleFilterReason(value: string): void {
    setFilterReason(value as ReasonFilter);
    setPage(1);
  }

  function closeModal(): void {
    setModal(null);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2
          ref={pageTitleRef}
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          {t.navStockMovements}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.smSubtitle}</p>
      </div>

      {/* Main card */}
      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="overflow-x-auto border-b border-border">
          <div className="flex w-max min-w-full items-center gap-2 px-5 py-3">
            {/* Type filter */}
            <Combobox
              value={filterType}
              onValueChange={handleFilterType}
              options={[
                { value: "all", label: `${t.smFilterType}: ${t.filterAll}` },
                { value: "IN", label: t.smTypeIn },
                { value: "OUT", label: t.smTypeOut },
              ]}
              placeholder={t.smFilterType}
              className="h-10 w-[11rem] shrink-0 rounded-xl text-sm"
            />

            {/* Reason filter */}
            <Combobox
              value={filterReason}
              onValueChange={handleFilterReason}
              options={[
                { value: "all", label: `${t.smFilterReason}: ${t.filterAll}` },
                { value: "PURCHASE", label: t.smReasonPurchase },
                { value: "SALE", label: t.smReasonSale },
                { value: "RETURN", label: t.smReasonReturn },
                { value: "ADJUSTMENT", label: t.smReasonAdjustment },
                { value: "DISPOSAL", label: t.smReasonDisposal },
                { value: "DAMAGED", label: t.smReasonDamaged },
                { value: "TRANSFER", label: t.smReasonTransfer },
                { value: "DONATION", label: t.smReasonDonation },
              ]}
              placeholder={t.smFilterReason}
              className="h-10 w-[13rem] shrink-0 rounded-xl text-sm"
            />

            {/* Medicine name search */}
            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t.smSearchPlaceholder}
              isFetching={isFetching && !isLoading}
            />
          </div>
        </div>

        {/* Table */}
        <StockMovementTable
          movements={movements}
          isLoading={isLoading}
          search={debouncedSearch}
          t={t}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          onDetails={(m) => setModal({ mode: "detail", movement: m })}
        />
      </Card>

      {/* Detail panel */}
      {modal?.mode === "detail" && (
        <StockMovementDetailPanel
          movement={modal.movement}
          t={t}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
