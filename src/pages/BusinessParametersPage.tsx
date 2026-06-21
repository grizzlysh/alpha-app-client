import type { JSX } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import type { RootState } from "@/store";

import { BriefcaseBusiness } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { useTablePageState } from "@/hooks/useTablePageState";
import { SearchInput } from "@/components/shared/SearchInput";
import type { Parameter } from "@/types/parameters";
import {
  getBusinessParameters,
  updateBusinessParameter,
} from "@/service/businessParameterService";
import { ParameterTable } from "@/components/parameters/ParameterTable";
import { ParameterDetailPanel } from "@/components/parameters/ParameterDetailPanel";
import { ParameterEditModal } from "@/components/parameters/ParameterEditModal";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";

// ── Types ─────────────────────────────────────────────────────────────────────

type ModalState =
  | { mode: "edit"; parameter: Parameter }
  | { mode: "detail"; parameter: Parameter }
  | null;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BusinessParametersPage(): JSX.Element {
  const { t } = useLanguage();
  const pageTitleRef = useScrollAwareTitle();
  const pharmacyUuid = useSelector((state: RootState) => state.auth.currentPharmacy?.uuid);

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

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["business-parameters", page, limit, debouncedSearch, pharmacyUuid],
    queryFn: () =>
      getBusinessParameters({
        page,
        limit,
        search: debouncedSearch || undefined,
        pharmacyUuid,
      }),
    placeholderData: keepPreviousData,
  });

  const parameters = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  function closeModal(): void {
    setModal(null);
  }

  function handleSuccess(): void {
    toast.success(
      <LiveToastMessage getMessage={(tr) => tr.paramUpdateSuccess} />
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
          {t.navBusinessParameters}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t.businessParamSubtitle}
        </p>
      </div>

      {/* Main card */}
      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="overflow-x-auto border-b border-border">
          <div className="flex w-max min-w-full items-center gap-2 px-5 py-3">
            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t.paramSearchPlaceholder}
              isFetching={isFetching && !isLoading}
            />
          </div>
        </div>

        {/* Data table */}
        <ParameterTable
          parameters={parameters}
          isLoading={isLoading}
          search={debouncedSearch}
          t={t}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          onDetails={(p) => setModal({ mode: "detail", parameter: p })}
          onEdit={(p) => setModal({ mode: "edit", parameter: p })}
        />
      </Card>

      {/* Detail panel */}
      {modal?.mode === "detail" && (
        <ParameterDetailPanel
          parameter={modal.parameter}
          t={t}
          icon={BriefcaseBusiness}
          onClose={closeModal}
          onEdit={() =>
            setModal({ mode: "edit", parameter: modal.parameter })
          }
        />
      )}

      {/* Edit modal */}
      {modal?.mode === "edit" && (
        <ParameterEditModal
          parameter={modal.parameter}
          queryKey="business-parameters"
          icon={BriefcaseBusiness}
          updateFn={updateBusinessParameter}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
