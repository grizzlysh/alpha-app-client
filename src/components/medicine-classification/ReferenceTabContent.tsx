import type { JSX } from "react";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { SearchInput } from "@/components/shared/SearchInput";
import { useTablePageState } from "@/hooks/useTablePageState";
import type { ApiResponse } from "@/types/api";
import type { ReferenceListParams, ReferencePayload } from "@/types/medicine";
import { ReferenceTable } from "./ReferenceTable";
import { ReferenceFormModal } from "./ReferenceFormModal";
import { ReferenceDetailPanel } from "./ReferenceDetailPanel";
import { ReferenceDeleteModal } from "./ReferenceDeleteModal";
import type { ReferenceItem, ReferenceLabels } from "./referenceTypes";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";

// ── Types ─────────────────────────────────────────────────────────────────────

type StatusFilter = "all" | "ACTIVE" | "INACTIVE";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; item: ReferenceItem }
  | { mode: "delete"; item: ReferenceItem }
  | { mode: "detail"; item: ReferenceItem }
  | null;

export interface ReferenceTabContentProps {
  queryKey: string;
  queryFn: (params?: ReferenceListParams) => Promise<ApiResponse<ReferenceItem[]>>;
  labels: ReferenceLabels;
  icon: JSX.Element;
  createFn: (payload: ReferencePayload) => Promise<ApiResponse<ReferenceItem>>;
  updateFn: (uuid: string, payload: ReferencePayload) => Promise<ApiResponse<ReferenceItem>>;
  deleteFn: (uuid: string) => Promise<ApiResponse<null>>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ReferenceTabContent({
  queryKey,
  queryFn,
  labels,
  icon,
  createFn,
  updateFn,
  deleteFn,
}: ReferenceTabContentProps): JSX.Element {
  const {
    searchInput,
    debouncedSearch,
    page,
    setPage,
    limit,
    handleLimitChange,
    handleSearchChange,
  } = useTablePageState();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [modal, setModal] = useState<ModalState>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey, page, limit, debouncedSearch, statusFilter],
    queryFn: () =>
      queryFn({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
    placeholderData: keepPreviousData,
  });

  const items = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  function closeModal(): void {
    setModal(null);
  }

  function handleSuccess(): void {
    const mode = modal?.mode;
    const getMsg = mode === "create" ? labels.createSuccess :
                   mode === "edit"   ? labels.updateSuccess :
                   labels.deleteSuccess;
    toast.success(<LiveToastMessage getMessage={getMsg} />);
    closeModal();
  }

  return (
    <>
      {/* Toolbar */}
      <div className="overflow-x-auto border-b border-border">
      <div className="flex w-max min-w-full items-center gap-2 px-5 py-3">
        {/* Status filter — leftmost */}
        <Combobox
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as StatusFilter);
            setPage(1);
          }}
          options={[
            { value: "all", label: labels.statusAll },
            { value: "ACTIVE", label: labels.statusActive },
            { value: "INACTIVE", label: labels.statusInactive },
          ]}
          className="h-10 w-[10rem] shrink-0 rounded-xl text-sm"
        />

        {/* Search — fills remaining width */}
        <SearchInput
          value={searchInput}
          onChange={handleSearchChange}
          placeholder={labels.searchPlaceholder}
          isFetching={isFetching && !isLoading}
        />

        {/* Add button */}
        <Button
          onClick={() => setModal({ mode: "create" })}
          className="shrink-0 gap-2 rounded-xl"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline-block sm:w-16 sm:text-center">
            {labels.addBtn}
          </span>
        </Button>
      </div>
      </div>

      {/* Table */}
      <ReferenceTable
        items={items}
        isLoading={isLoading}
        search={debouncedSearch}
        labels={labels}
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onLimitChange={handleLimitChange}
        onAdd={() => setModal({ mode: "create" })}
        onDetails={(item) => setModal({ mode: "detail", item })}
        onEdit={(item) => setModal({ mode: "edit", item })}
        onDelete={(item) => setModal({ mode: "delete", item })}
      />

      {/* Detail panel */}
      {modal?.mode === "detail" && (
        <ReferenceDetailPanel
          item={modal.item}
          labels={labels}
          icon={icon}
          onClose={closeModal}
          onEdit={() => setModal({ mode: "edit", item: modal.item })}
          onDelete={() => setModal({ mode: "delete", item: modal.item })}
        />
      )}

      {/* Form modal */}
      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <ReferenceFormModal
          mode={modal.mode}
          item={modal.mode === "edit" ? modal.item : undefined}
          labels={labels}
          icon={icon}
          queryKey={queryKey}
          onClose={closeModal}
          onSuccess={handleSuccess}
          createFn={createFn}
          updateFn={updateFn}
        />
      )}

      {/* Delete modal */}
      {modal?.mode === "delete" && (
        <ReferenceDeleteModal
          item={modal.item}
          labels={labels}
          queryKey={queryKey}
          onClose={closeModal}
          onSuccess={handleSuccess}
          deleteFn={deleteFn}
        />
      )}
    </>
  );
}
