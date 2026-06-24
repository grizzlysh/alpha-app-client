import type { JSX } from "react";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { useTablePageState } from "@/hooks/useTablePageState";
import { SearchInput } from "@/components/shared/SearchInput";
import { StorageBreadcrumb } from "@/components/storage/StorageBreadcrumb";
import { CabinetTable } from "@/components/storage/CabinetTable";
import { CabinetFormModal } from "@/components/storage/CabinetFormModal";
import { CabinetDeleteModal } from "@/components/storage/CabinetDeleteModal";
import { ShelfTable } from "@/components/storage/ShelfTable";
import { ShelfFormModal } from "@/components/storage/ShelfFormModal";
import { ShelfDeleteModal } from "@/components/storage/ShelfDeleteModal";
import { BinTable } from "@/components/storage/BinTable";
import { BinFormModal } from "@/components/storage/BinFormModal";
import { BinDeleteModal } from "@/components/storage/BinDeleteModal";
import { getCabinets, getShelves, getBins } from "@/service/storageService";
import type { StorageCabinet, StorageShelf, StorageBin, StorageCrumb } from "@/types/storage";
import type { RootState } from "@/store";

// ── Types ─────────────────────────────────────────────────────────────────────

type DrillView = "cabinets" | "shelves" | "bins";

type CabinetModal =
  | { mode: "create" }
  | { mode: "edit"; cabinet: StorageCabinet }
  | { mode: "delete"; cabinet: StorageCabinet }
  | null;

type ShelfModal =
  | { mode: "create" }
  | { mode: "edit"; shelf: StorageShelf }
  | { mode: "delete"; shelf: StorageShelf }
  | null;

type BinModal =
  | { mode: "create" }
  | { mode: "edit"; bin: StorageBin }
  | { mode: "delete"; bin: StorageBin }
  | null;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StoragePage(): JSX.Element {
  const { t } = useLanguage();
  const pageTitleRef = useScrollAwareTitle();
  const pharmacyUuid = useSelector((state: RootState) => state.auth.currentPharmacy?.uuid);

  // ── Drill-down state ──────────────────────────────────────────────────────
  const [view, setView] = useState<DrillView>("cabinets");
  const [selectedCabinet, setSelectedCabinet] = useState<StorageCrumb | null>(null);
  const [selectedShelf, setSelectedShelf] = useState<StorageCrumb | null>(null);

  // ── Per-level table state ─────────────────────────────────────────────────
  const cabState = useTablePageState();
  const shelfState = useTablePageState();
  const binState = useTablePageState();

  const [filterStatus, setFilterStatus] = useState<"ACTIVE" | "INACTIVE" | "all">("all");

  // ── Modals ────────────────────────────────────────────────────────────────
  const [cabinetModal, setCabinetModal] = useState<CabinetModal>(null);
  const [shelfModal, setShelfModal] = useState<ShelfModal>(null);
  const [binModal, setBinModal] = useState<BinModal>(null);

  // ── Queries ───────────────────────────────────────────────────────────────
  const cabinetsQuery = useQuery({
    queryKey: [
      "storage-cabinets",
      pharmacyUuid,
      cabState.page,
      cabState.limit,
      cabState.debouncedSearch,
      filterStatus,
    ],
    queryFn: () =>
      getCabinets({
        page: cabState.page,
        limit: cabState.limit,
        search: cabState.debouncedSearch || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      }),
    placeholderData: keepPreviousData,
    enabled: view === "cabinets",
  });

  const shelvesQuery = useQuery({
    queryKey: [
      "storage-shelves",
      selectedCabinet?.uuid,
      shelfState.page,
      shelfState.limit,
      shelfState.debouncedSearch,
      filterStatus,
    ],
    queryFn: () =>
      getShelves(selectedCabinet!.uuid, {
        page: shelfState.page,
        limit: shelfState.limit,
        search: shelfState.debouncedSearch || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      }),
    placeholderData: keepPreviousData,
    enabled: view === "shelves" && !!selectedCabinet,
  });

  const binsQuery = useQuery({
    queryKey: [
      "storage-bins",
      selectedShelf?.uuid,
      binState.page,
      binState.limit,
      binState.debouncedSearch,
      filterStatus,
    ],
    queryFn: () =>
      getBins(selectedCabinet!.uuid, selectedShelf!.uuid, {
        page: binState.page,
        limit: binState.limit,
        search: binState.debouncedSearch || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      }),
    placeholderData: keepPreviousData,
    enabled: view === "bins" && !!selectedCabinet && !!selectedShelf,
  });

  // ── Derived data ──────────────────────────────────────────────────────────
  const cabinets = cabinetsQuery.data?.data ?? [];
  const cabTotal = cabinetsQuery.data?.meta?.total ?? 0;
  const cabTotalPages = cabinetsQuery.data?.meta?.totalPages ?? 1;

  const shelves = shelvesQuery.data?.data ?? [];
  const shelfTotal = shelvesQuery.data?.meta?.total ?? 0;
  const shelfTotalPages = shelvesQuery.data?.meta?.totalPages ?? 1;

  const bins = binsQuery.data?.data ?? [];
  const binTotal = binsQuery.data?.meta?.total ?? 0;
  const binTotalPages = binsQuery.data?.meta?.totalPages ?? 1;

  // ── Navigation helpers ────────────────────────────────────────────────────
  function drillToShelves(cabinet: StorageCabinet): void {
    setSelectedCabinet({ uuid: cabinet.uuid, name: cabinet.name, code: cabinet.code });
    setSelectedShelf(null);
    shelfState.setPage(1);
    setView("shelves");
  }

  function drillToBins(shelf: StorageShelf): void {
    setSelectedShelf({ uuid: shelf.uuid, name: shelf.name, code: shelf.code });
    binState.setPage(1);
    setView("bins");
  }

  function goToCabinets(): void {
    setSelectedCabinet(null);
    setSelectedShelf(null);
    setView("cabinets");
  }

  function goToShelves(): void {
    if (!selectedCabinet) return;
    setSelectedShelf(null);
    setView("shelves");
  }

  // ── Toolbar helpers ───────────────────────────────────────────────────────
  function handleFilterStatus(value: string): void {
    setFilterStatus(value as "ACTIVE" | "INACTIVE" | "all");
    if (view === "cabinets") cabState.setPage(1);
    else if (view === "shelves") shelfState.setPage(1);
    else binState.setPage(1);
  }

  // ── Current table state by view ───────────────────────────────────────────
  const activeState =
    view === "cabinets" ? cabState : view === "shelves" ? shelfState : binState;

  const isFetching =
    view === "cabinets"
      ? cabinetsQuery.isFetching
      : view === "shelves"
        ? shelvesQuery.isFetching
        : binsQuery.isFetching;

  const isLoading =
    view === "cabinets"
      ? cabinetsQuery.isLoading
      : view === "shelves"
        ? shelvesQuery.isLoading
        : binsQuery.isLoading;

  // ── Add button label ──────────────────────────────────────────────────────
  const addLabel =
    view === "cabinets" ? t.cabinetAdd : view === "shelves" ? t.shelfAdd : t.binAdd;

  function handleAdd(): void {
    if (view === "cabinets") setCabinetModal({ mode: "create" });
    else if (view === "shelves") setShelfModal({ mode: "create" });
    else setBinModal({ mode: "create" });
  }

  // ── Success handlers (modals close themselves via onSuccess prop) ──────────
  function handleCabinetSuccess(): void {
    setCabinetModal(null);
  }

  function handleShelfSuccess(): void {
    setShelfModal(null);
  }

  function handleBinSuccess(): void {
    setBinModal(null);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2
          ref={pageTitleRef}
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          {t.navStorage}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.storageSubtitle}</p>
      </div>

      {/* Main card */}
      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="overflow-x-auto border-b border-border">
          <div className="flex w-max min-w-full items-center gap-2 px-5 py-3">
            {/* Breadcrumb */}
            <StorageBreadcrumb
              cabinet={selectedCabinet}
              shelf={selectedShelf}
              onGoToCabinets={goToCabinets}
              onGoToShelves={goToShelves}
            />

            <div className="flex-1" />

            {/* Status filter */}
            <Combobox
              value={filterStatus}
              onValueChange={handleFilterStatus}
              options={[
                { value: "all", label: `${t.storageFilterStatus}: ${t.filterAll}` },
                { value: "ACTIVE", label: t.storageStatusActive },
                { value: "INACTIVE", label: t.storageStatusInactive },
              ]}
              placeholder={t.storageFilterStatus}
              className="h-10 w-[10rem] shrink-0 rounded-xl text-sm"
            />

            {/* Search */}
            <SearchInput
              value={activeState.searchInput}
              onChange={activeState.handleSearchChange}
              placeholder={
                view === "cabinets"
                  ? t.cabinetSearchPlaceholder
                  : view === "shelves"
                    ? t.shelfSearchPlaceholder
                    : t.binSearchPlaceholder
              }
              isFetching={isFetching && !isLoading}
            />

            {/* Add button */}
            <Button
              onClick={handleAdd}
              variant="success"
              className="shrink-0 gap-2 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-block sm:w-16 sm:text-center">
                {addLabel}
              </span>
            </Button>
          </div>
        </div>

        {/* Table */}
        {view === "cabinets" && (
          <CabinetTable
            cabinets={cabinets}
            isLoading={cabinetsQuery.isLoading}
            search={cabState.debouncedSearch}
            t={t}
            page={cabState.page}
            limit={cabState.limit}
            total={cabTotal}
            totalPages={cabTotalPages}
            onPageChange={cabState.setPage}
            onLimitChange={cabState.handleLimitChange}
            onAdd={() => setCabinetModal({ mode: "create" })}
            onEdit={(c) => setCabinetModal({ mode: "edit", cabinet: c })}
            onDelete={(c) => setCabinetModal({ mode: "delete", cabinet: c })}
            onViewShelves={drillToShelves}
          />
        )}

        {view === "shelves" && selectedCabinet && (
          <ShelfTable
            shelves={shelves}
            isLoading={shelvesQuery.isLoading}
            search={shelfState.debouncedSearch}
            t={t}
            page={shelfState.page}
            limit={shelfState.limit}
            total={shelfTotal}
            totalPages={shelfTotalPages}
            onPageChange={shelfState.setPage}
            onLimitChange={shelfState.handleLimitChange}
            onAdd={() => setShelfModal({ mode: "create" })}
            onEdit={(s) => setShelfModal({ mode: "edit", shelf: s })}
            onDelete={(s) => setShelfModal({ mode: "delete", shelf: s })}
            onViewBins={drillToBins}
          />
        )}

        {view === "bins" && selectedCabinet && selectedShelf && (
          <BinTable
            bins={bins}
            isLoading={binsQuery.isLoading}
            search={binState.debouncedSearch}
            t={t}
            page={binState.page}
            limit={binState.limit}
            total={binTotal}
            totalPages={binTotalPages}
            onPageChange={binState.setPage}
            onLimitChange={binState.handleLimitChange}
            onAdd={() => setBinModal({ mode: "create" })}
            onEdit={(b) => setBinModal({ mode: "edit", bin: b })}
            onDelete={(b) => setBinModal({ mode: "delete", bin: b })}
          />
        )}
      </Card>

      {/* Cabinet modals */}
      {cabinetModal?.mode === "create" && (
        <CabinetFormModal
          mode="create"
          onClose={() => setCabinetModal(null)}
          onSuccess={handleCabinetSuccess}
        />
      )}
      {cabinetModal?.mode === "edit" && (
        <CabinetFormModal
          mode="edit"
          cabinet={cabinetModal.cabinet}
          onClose={() => setCabinetModal(null)}
          onSuccess={handleCabinetSuccess}
        />
      )}
      {cabinetModal?.mode === "delete" && (
        <CabinetDeleteModal
          cabinet={cabinetModal.cabinet}
          onClose={() => setCabinetModal(null)}
          onSuccess={handleCabinetSuccess}
        />
      )}

      {/* Shelf modals */}
      {selectedCabinet && shelfModal?.mode === "create" && (
        <ShelfFormModal
          mode="create"
          cabinetUuid={selectedCabinet.uuid}
          onClose={() => setShelfModal(null)}
          onSuccess={handleShelfSuccess}
        />
      )}
      {selectedCabinet && shelfModal?.mode === "edit" && (
        <ShelfFormModal
          mode="edit"
          cabinetUuid={selectedCabinet.uuid}
          shelf={shelfModal.shelf}
          onClose={() => setShelfModal(null)}
          onSuccess={handleShelfSuccess}
        />
      )}
      {selectedCabinet && shelfModal?.mode === "delete" && (
        <ShelfDeleteModal
          shelf={shelfModal.shelf}
          cabinetUuid={selectedCabinet.uuid}
          onClose={() => setShelfModal(null)}
          onSuccess={handleShelfSuccess}
        />
      )}

      {/* Bin modals */}
      {selectedCabinet && selectedShelf && binModal?.mode === "create" && (
        <BinFormModal
          mode="create"
          cabinetUuid={selectedCabinet.uuid}
          shelfUuid={selectedShelf.uuid}
          onClose={() => setBinModal(null)}
          onSuccess={handleBinSuccess}
        />
      )}
      {selectedCabinet && selectedShelf && binModal?.mode === "edit" && (
        <BinFormModal
          mode="edit"
          cabinetUuid={selectedCabinet.uuid}
          shelfUuid={selectedShelf.uuid}
          bin={binModal.bin}
          onClose={() => setBinModal(null)}
          onSuccess={handleBinSuccess}
        />
      )}
      {selectedCabinet && selectedShelf && binModal?.mode === "delete" && (
        <BinDeleteModal
          bin={binModal.bin}
          cabinetUuid={selectedCabinet.uuid}
          shelfUuid={selectedShelf.uuid}
          onClose={() => setBinModal(null)}
          onSuccess={handleBinSuccess}
        />
      )}
    </div>
  );
}
