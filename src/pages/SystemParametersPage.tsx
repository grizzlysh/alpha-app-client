import type { JSX } from "react";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";

import { MonitorCog } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { useTablePageState } from "@/hooks/useTablePageState";
import { SearchInput } from "@/components/shared/SearchInput";
import type { Parameter } from "@/types/parameters";
import {
  getSystemParameters,
  updateSystemParameter,
} from "@/service/systemParameterService";
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

export default function SystemParametersPage(): JSX.Element {
  const { t } = useLanguage();
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

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["system-parameters", page, limit, debouncedSearch],
    queryFn: () =>
      getSystemParameters({
        page,
        limit,
        search: debouncedSearch || undefined,
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
          {t.navSystemParameters}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t.systemParamSubtitle}
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
          icon={MonitorCog}
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
          queryKey="system-parameters"
          icon={MonitorCog}
          updateFn={updateSystemParameter}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
