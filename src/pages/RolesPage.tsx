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
import type { Role } from "@/types/role";
import { getRoles } from "@/service/roleService";
import { RoleTable } from "@/components/roles/RoleTable";
import { RoleDetailPanel } from "@/components/roles/RoleDetailPanel";
import { RoleFormModal } from "@/components/roles/RoleFormModal";
import { RoleDeleteModal } from "@/components/roles/RoleDeleteModal";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";

// ── Types ─────────────────────────────────────────────────────────────────────

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; role: Role }
  | { mode: "delete"; role: Role }
  | { mode: "detail"; role: Role }
  | null;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RolesPage(): JSX.Element {
  const { t } = useLanguage();
  const pageTitleRef = useScrollAwareTitle();

  const { searchInput, debouncedSearch, page, setPage, limit, handleLimitChange, handleSearchChange } = useTablePageState();
  const [modal, setModal] = useState<ModalState>(null);

  // ── Filter state ─────────────────────────────────────────────────────────────
  const [filterStatus, setFilterStatus] = useState<"ACTIVE" | "INACTIVE" | "DELETED" | "all">("all");
  const [filterType, setFilterType] = useState("all");
  const [filterScope, setFilterScope] = useState<"true" | "false" | "all">("all");

  // ── Main query ────────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "roles",
      page,
      limit,
      debouncedSearch,
      filterStatus,
      filterType,
      filterScope,
    ],
    queryFn: () =>
      getRoles({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        isGlobal: filterScope !== "all" ? filterScope : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const roles = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  // ── Helpers ───────────────────────────────────────────────────────────────────

  function handleFilterStatus(value: string): void {
    setFilterStatus(value as "ACTIVE" | "INACTIVE" | "DELETED" | "all");
    setPage(1);
  }

  function handleFilterType(value: string): void {
    setFilterType(value);
    setPage(1);
  }

  function handleFilterScope(value: string): void {
    setFilterScope(value as "true" | "false" | "all");
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
            ? t.roleCreateSuccess
            : mode === "edit"
              ? t.roleUpdateSuccess
              : t.roleDeleteSuccess
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
          {t.navRoles}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t.rolesSubtitle}
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
                { value: "all", label: `${t.roleStatus}: ${t.filterAll}` },
                { value: "ACTIVE", label: t.roleStatusActive },
                { value: "INACTIVE", label: t.roleStatusInactive },
                { value: "DELETED", label: t.roleStatusDeleted },
              ]}
              placeholder={t.roleStatus}
              className="h-10 w-[10rem] shrink-0 rounded-xl text-sm"
            />

            {/* Type filter */}
            <Combobox
              value={filterType}
              onValueChange={handleFilterType}
              options={[
                { value: "all", label: `${t.roleType}: ${t.filterAll}` },
                { value: "OWNER", label: t.roleTypeOwner },
                { value: "ADMIN", label: t.roleTypeAdmin },
                { value: "PHARMACIST", label: t.roleTypePharmacist },
                { value: "HEAD_PHARMACIST", label: t.roleTypeHeadPharmacist },
                { value: "CASHIER", label: t.roleTypeCashier },
              ]}
              placeholder={t.roleType}
              className="h-10 w-[12rem] shrink-0 rounded-xl text-sm"
            />

            {/* Scope filter */}
            <Combobox
              value={filterScope}
              onValueChange={handleFilterScope}
              options={[
                { value: "all", label: `${t.roleIsGlobal}: ${t.filterAll}` },
                { value: "true", label: t.roleScopeGlobal },
                { value: "false", label: t.roleScopePharmacy },
              ]}
              placeholder={t.roleIsGlobal}
              className="h-10 w-[11rem] shrink-0 rounded-xl text-sm"
            />

            {/* Search */}
            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t.roleSearchPlaceholder}
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
                {t.roleAdd}
              </span>
            </Button>
          </div>
        </div>

        {/* Table */}
        <RoleTable
          roles={roles}
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
          onDetails={(r) => setModal({ mode: "detail", role: r })}
          onEdit={(r) => setModal({ mode: "edit", role: r })}
          onDelete={(r) => setModal({ mode: "delete", role: r })}
        />
      </Card>

      {/* Detail panel */}
      {modal?.mode === "detail" && (
        <RoleDetailPanel
          role={modal.role}
          t={t}
          onClose={closeModal}
          onEdit={() => setModal({ mode: "edit", role: modal.role })}
          onDelete={() => setModal({ mode: "delete", role: modal.role })}
        />
      )}

      {/* Form modal */}
      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <RoleFormModal
          mode={modal.mode}
          role={modal.mode === "edit" ? modal.role : undefined}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}

      {/* Delete confirm */}
      {modal?.mode === "delete" && (
        <RoleDeleteModal
          role={modal.role}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
