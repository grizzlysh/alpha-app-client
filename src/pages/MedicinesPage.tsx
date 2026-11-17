import type { JSX } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, Loader2, Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import type { RootState } from "@/store";
import { useLanguage } from "@/hooks/useLanguage";
import { useCan } from "@/hooks/usePermission";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { useTablePageState } from "@/hooks/useTablePageState";
import { SearchInput } from "@/components/shared/SearchInput";
import { getMedicines } from "@/service/medicineService";
import { getMedicineShapesDropdown } from "@/service/medicineShapeService";
import { getMedicineTypesDropdown } from "@/service/medicineTypeService";
import { getMedicineClassesDropdown } from "@/service/medicineClassService";
import { MedicineTable } from "@/components/medicine/MedicineTable";
import { MedicineDetailPanel } from "@/components/medicine/MedicineDetailPanel";
import { MedicineFormModal } from "@/components/medicine/MedicineFormModal";
import { MedicineDeleteModal } from "@/components/medicine/MedicineDeleteModal";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import type { Medicine } from "@/types/medicine";
import { exportCatalog } from "@/service/catalogService";
import { getApiErrorMessage } from "@/utils/apiError";
import { CatalogImportModal } from "@/components/medicine/CatalogImportModal";
import { downloadCatalog } from "@/components/medicine/catalogFile";
import { useNameFormat } from "@/hooks/useNameFormat";

// ── Types ─────────────────────────────────────────────────────────────────────

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; medicine: Medicine }
  | { mode: "delete"; medicine: Medicine }
  | { mode: "detail"; medicine: Medicine }
  | { mode: "import" }
  | null;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MedicinesPage(): JSX.Element {
  const fmt = useNameFormat();
  const { t, language } = useLanguage();
  const can = useCan();
  const pharmacyUuid = useSelector((state: RootState) => state.auth.currentPharmacy?.uuid);
  const pageTitleRef = useScrollAwareTitle();

  const { searchInput, debouncedSearch, page, setPage, limit, handleLimitChange, handleSearchChange } = useTablePageState();
  const [modal, setModal] = useState<ModalState>(null);
  const [exporting, setExporting] = useState(false);

  async function handleExport(): Promise<void> {
    setExporting(true);
    try {
      const res = await exportCatalog();
      if (res.data) downloadCatalog(res.data);
    } catch (err) {
      toast.error(getApiErrorMessage(err, language, t.unexpectedError));
    } finally {
      setExporting(false);
    }
  }

  // ── Filter state ─────────────────────────────────────────────────────────────
  const [filterShape, setFilterShape] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"ACTIVE" | "INACTIVE" | "all">("all");

  // ── Dropdown data ─────────────────────────────────────────────────────────────
  const { data: shapesData } = useQuery({
    queryKey: ["medicine-shapes-dropdown"],
    queryFn: () => getMedicineShapesDropdown(),
    staleTime: 5 * 60 * 1000,
  });
  const { data: typesData } = useQuery({
    queryKey: ["medicine-types-dropdown"],
    queryFn: () => getMedicineTypesDropdown(),
    staleTime: 5 * 60 * 1000,
  });
  const { data: classesData } = useQuery({
    queryKey: ["medicine-classes-dropdown"],
    queryFn: () => getMedicineClassesDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const shapes = shapesData?.data ?? [];
  const types = typesData?.data ?? [];
  const classes = classesData?.data ?? [];

  // ── Main query ────────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "medicines",
      pharmacyUuid,
      page,
      limit,
      debouncedSearch,
      filterShape,
      filterType,
      filterClass,
      filterStatus,
    ],
    queryFn: () =>
      getMedicines({
        page,
        limit,
        search: debouncedSearch || undefined,
        medicineShapeUuid: filterShape !== "all" ? filterShape : undefined,
        medicineTypeUuid: filterType !== "all" ? filterType : undefined,
        medicineClassUuid: filterClass !== "all" ? filterClass : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const medicines = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  // ── Helpers ───────────────────────────────────────────────────────────────────

  function handleFilterShape(value: string): void {
    setFilterShape(value);
    setPage(1);
  }

  function handleFilterType(value: string): void {
    setFilterType(value);
    setPage(1);
  }

  function handleFilterClass(value: string): void {
    setFilterClass(value);
    setPage(1);
  }

  function handleFilterStatus(value: string): void {
    setFilterStatus(value as "ACTIVE" | "INACTIVE" | "all");
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
          mode === "create" ? t.medicineCreateSuccess :
          mode === "edit"   ? t.medicineUpdateSuccess :
          t.medicineDeleteSuccess
        }
      />
    );
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
          {t.navMedicines}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t.medicinesSubtitle}
        </p>
      </div>

      {/* Main card */}
      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-border md:overflow-x-auto">
          <div className="table-toolbar">
            {/* Shape filter */}
            <Combobox
              value={filterShape}
              onValueChange={handleFilterShape}
              options={[
                { value: "all", label: `${t.medicineShapeLabel}: ${t.filterAll}` },
                ...shapes.map((s) => ({ value: s.uuid, label: fmt(s.name) })),
              ]}
              placeholder={t.medicineShapeLabel}
              className="h-10 w-[11rem] shrink-0 rounded-xl text-sm"
            />

            {/* Type filter */}
            <Combobox
              value={filterType}
              onValueChange={handleFilterType}
              options={[
                { value: "all", label: `${t.medicineTypeLabel}: ${t.filterAll}` },
                ...types.map((tp) => ({ value: tp.uuid, label: fmt(tp.name) })),
              ]}
              placeholder={t.medicineTypeLabel}
              className="h-10 w-[10rem] shrink-0 rounded-xl text-sm"
            />

            {/* Class filter */}
            <Combobox
              value={filterClass}
              onValueChange={handleFilterClass}
              options={[
                { value: "all", label: `${t.medicineClassLabel}: ${t.filterAll}` },
                ...classes.map((cl) => ({ value: cl.uuid, label: fmt(cl.name) })),
              ]}
              placeholder={t.medicineClassLabel}
              className="h-10 w-[13rem] shrink-0 rounded-xl text-sm"
            />

            {/* Status filter */}
            <Combobox
              value={filterStatus}
              onValueChange={handleFilterStatus}
              options={[
                { value: "all", label: `${t.medicineStatusLabel}: ${t.filterAll}` },
                { value: "ACTIVE", label: t.medicineStatusActive },
                { value: "INACTIVE", label: t.medicineStatusInactive },
              ]}
              placeholder={t.medicineStatusLabel}
              className="h-10 w-[10rem] shrink-0 rounded-xl text-sm"
            />

            {/* Search */}
            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t.medicineSearchPlaceholder}
              isFetching={isFetching && !isLoading}
            />

            {/* Export / import the list, e.g. to set up another branch */}
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exporting}
              className="shrink-0 gap-2 rounded-xl"
              title={t.catalogExportHint}
            >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span className="hidden md:inline">{t.catalogExport}</span>
            </Button>
            {can("medicines.create") && (
              <Button
                variant="outline"
                onClick={() => setModal({ mode: "import" })}
                className="shrink-0 gap-2 rounded-xl"
                title={t.catalogImportDesc}
              >
                <Upload className="h-4 w-4" />
                <span className="hidden md:inline">{t.catalogImport}</span>
              </Button>
            )}

            {/* Add button */}
            {can("medicines.create") && (
            <Button
              onClick={() => setModal({ mode: "create" })}
              variant="success"
              className="shrink-0 gap-2 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-block sm:w-16 sm:text-center">
                {t.medicineAdd}
              </span>
            </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <MedicineTable
          medicines={medicines}
          isLoading={isLoading}
          search={debouncedSearch}
          t={t}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          onAdd={can("medicines.create") ? () => setModal({ mode: "create" }) : undefined}
          onDetails={(med) => setModal({ mode: "detail", medicine: med })}
          onEdit={can("medicines.update") ? (med) => setModal({ mode: "edit", medicine: med }) : undefined}
          onDelete={can("medicines.delete") ? (med) => setModal({ mode: "delete", medicine: med }) : undefined}
        />
      </Card>

      {/* Detail panel */}
      {modal?.mode === "detail" && (
        <MedicineDetailPanel
          medicine={modal.medicine}
          t={t}
          onClose={closeModal}
          onEdit={can("medicines.update") ? () => setModal({ mode: "edit", medicine: modal.medicine }) : undefined}
          onDelete={can("medicines.delete") ? () =>
            setModal({ mode: "delete", medicine: modal.medicine }) : undefined}
        />
      )}

      {/* Form modal */}
      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <MedicineFormModal
          mode={modal.mode}
          medicine={modal.mode === "edit" ? modal.medicine : undefined}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}

      {modal?.mode === "import" && <CatalogImportModal onClose={closeModal} />}

      {/* Delete confirm */}
      {modal?.mode === "delete" && (
        <MedicineDeleteModal
          medicine={modal.medicine}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
