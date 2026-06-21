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
import { CustomerTable } from "@/components/customers/CustomerTable";
import { CustomerDetailPanel } from "@/components/customers/CustomerDetailPanel";
import { CustomerFormModal } from "@/components/customers/CustomerFormModal";
import { CustomerDeleteModal } from "@/components/customers/CustomerDeleteModal";
import type { Customer } from "@/types/customer";
import { getCustomers } from "@/service/customerService";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; customer: Customer }
  | { mode: "delete"; customer: Customer }
  | { mode: "detail"; customer: Customer }
  | null;

export default function CustomersPage(): JSX.Element {
  const { t } = useLanguage();
  const pageTitleRef = useScrollAwareTitle();
  const { searchInput, debouncedSearch, page, setPage, limit, handleLimitChange, handleSearchChange } =
    useTablePageState();
  const [modal, setModal] = useState<ModalState>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "ACTIVE" | "INACTIVE">("all");
  const [filterIsWalkIn, setFilterIsWalkIn] = useState<"all" | "true" | "false">("all");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["customers", page, limit, debouncedSearch, filterStatus, filterIsWalkIn],
    queryFn: () =>
      getCustomers({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        isWalkIn: filterIsWalkIn !== "all" ? filterIsWalkIn === "true" : undefined,
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
                { value: "ACTIVE", label: t.customerStatusActive },
                { value: "INACTIVE", label: t.customerStatusInactive },
              ]}
              placeholder={t.customerFilterStatus}
              className="h-10 w-[10rem] shrink-0 rounded-xl text-sm"
            />

            {/* Walk-in filter */}
            <Combobox
              value={filterIsWalkIn}
              onValueChange={handleFilterIsWalkIn}
              options={[
                { value: "all", label: `${t.customerFilterIsWalkIn}: ${t.filterAll}` },
                { value: "true", label: t.customerWalkInBadge },
                { value: "false", label: t.customerWalkInRegular },
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
          onAdd={() => setModal({ mode: "create" })}
          onDetails={(customer) => setModal({ mode: "detail", customer })}
          onEdit={(customer) => setModal({ mode: "edit", customer })}
          onDelete={(customer) => setModal({ mode: "delete", customer })}
        />
      </Card>

      {modal?.mode === "detail" && (
        <CustomerDetailPanel
          customer={modal.customer}
          t={t}
          onClose={closeModal}
          onEdit={() => setModal({ mode: "edit", customer: modal.customer })}
          onDelete={() => setModal({ mode: "delete", customer: modal.customer })}
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
