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
import { CustomerTable } from "@/components/customers/CustomerTable";
import { CustomerDetailPanel } from "@/components/customers/CustomerDetailPanel";
import { CustomerFormModal } from "@/components/customers/CustomerFormModal";
import { CustomerDeleteModal } from "@/components/customers/CustomerDeleteModal";
import type { Customer, CustomerType } from "@/types/customer";
import { getCustomers } from "@/service/customerService";
import { DataTransferButtons } from "@/components/data-transfer/DataTransferButtons";
import { CustomerImportModal } from "@/components/data-transfer/ImportModals";
import { downloadCustomers } from "@/components/data-transfer/columns";

type ModalState =
  | { mode: "create" }
  | { mode: "import" }
  | { mode: "edit"; customer: Customer }
  | { mode: "delete"; customer: Customer }
  | { mode: "detail"; customer: Customer }
  | null;

export default function CustomersPage(): JSX.Element {
  const { t } = useLanguage();
  const can = useCan();
  const pharmacyName = useSelector((state: RootState) => state.auth.currentPharmacy?.name ?? "");
  const pharmacyUuid = useSelector((state: RootState) => state.auth.currentPharmacy?.uuid);
  const pageTitleRef = useScrollAwareTitle();
  const { searchInput, debouncedSearch, page, setPage, limit, handleLimitChange, handleSearchChange } =
    useTablePageState();
  const [modal, setModal] = useState<ModalState>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "ACTIVE" | "INACTIVE">("all");
  const [filterIsWalkIn, setFilterIsWalkIn] = useState<"all" | "true" | "false">("all");
  const [filterType, setFilterType] = useState<"all" | CustomerType>("all");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["customers", pharmacyUuid, page, limit, debouncedSearch, filterStatus, filterIsWalkIn, filterType],
    queryFn: () =>
      getCustomers({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        isWalkIn: filterIsWalkIn !== "all" ? filterIsWalkIn === "true" : undefined,
        customerType: filterType !== "all" ? filterType : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const customers = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  function handleFilterStatus(value: string): void {
    setFilterStatus(value as "all" | "ACTIVE" | "INACTIVE");
    setPage(1);
  }

  function handleFilterIsWalkIn(value: string): void {
    setFilterIsWalkIn(value as "all" | "true" | "false");
    setPage(1);
  }

  function handleFilterType(value: string): void {
    setFilterType(value as "all" | CustomerType);
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
            ? t.customerCreateSuccess
            : mode === "edit"
              ? t.customerUpdateSuccess
              : t.customerDeleteSuccess
        }
      />
    );
    closeModal();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2
          ref={pageTitleRef}
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          {t.navCustomers}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.customersSubtitle}</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto border-b border-border">
          <div className="flex w-max min-w-full items-center gap-2 px-5 py-3">
            {/* Status filter */}
            <Combobox
              value={filterStatus}
              onValueChange={handleFilterStatus}
              options={[
                { value: "all", label: `${t.customerFilterStatus}: ${t.filterAll}` },
                { value: "ACTIVE", label: t.patientStatusActive },
                { value: "INACTIVE", label: t.patientStatusInactive },
              ]}
              placeholder={t.customerFilterStatus}
              className="h-10 w-[10rem] shrink-0 rounded-xl text-sm"
            />

            {/* Customer type filter */}
            <Combobox
              value={filterType}
              onValueChange={handleFilterType}
              options={[
                { value: "all", label: `${t.customerFilterType}: ${t.filterAll}` },
                { value: "PATIENT", label: t.customerTypePatient },
                { value: "PROFESSIONAL", label: t.customerTypeProfessional },
              ]}
              placeholder={t.customerFilterType}
              className="h-10 w-[11rem] shrink-0 rounded-xl text-sm"
            />

            {/* Walk-in filter */}
            <Combobox
              value={filterIsWalkIn}
              onValueChange={handleFilterIsWalkIn}
              options={[
                { value: "all", label: `${t.customerFilterIsWalkIn}: ${t.filterAll}` },
                { value: "true", label: t.patientWalkInBadge },
                { value: "false", label: t.patientWalkInRegular },
              ]}
              placeholder={t.customerFilterIsWalkIn}
              className="h-10 w-[10rem] shrink-0 rounded-xl text-sm"
            />

            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t.customerSearchPlaceholder}
              isFetching={isFetching && !isLoading}
            />

            <DataTransferButtons
              onExport={can("customers.read") ? () => downloadCustomers(pharmacyName) : undefined}
              onImport={can("customers.create") ? () => setModal({ mode: "import" }) : undefined}
              exportHint={t.importPatientsExportHint}
            />
            {can("customers.create") && (
            <Button
              onClick={() => setModal({ mode: "create" })}
              variant="success"
              className="shrink-0 gap-2 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-block sm:w-16 sm:text-center">
                {t.customerAdd}
              </span>
            </Button>
            )}
          </div>
        </div>

        <CustomerTable
          customers={customers}
          isLoading={isLoading}
          search={debouncedSearch}
          t={t}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          onAdd={can("customers.create") ? () => setModal({ mode: "create" }) : undefined}
          onDetails={(customer) => setModal({ mode: "detail", customer })}
          onEdit={can("customers.update") ? (customer) => setModal({ mode: "edit", customer }) : undefined}
          onDelete={can("customers.delete") ? (customer) => setModal({ mode: "delete", customer }) : undefined}
        />
      </Card>

      {modal?.mode === "detail" && (
        <CustomerDetailPanel
          customer={modal.customer}
          t={t}
          onClose={closeModal}
          onEdit={can("customers.update") ? () => setModal({ mode: "edit", customer: modal.customer }) : undefined}
          onDelete={can("customers.delete") ? () => setModal({ mode: "delete", customer: modal.customer }) : undefined}
        />
      )}

      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <CustomerFormModal
          mode={modal.mode}
          customer={modal.mode === "edit" ? modal.customer : undefined}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}

      {modal?.mode === "import" && <CustomerImportModal onClose={() => setModal(null)} />}

      {modal?.mode === "delete" && (
        <CustomerDeleteModal
          customer={modal.customer}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
