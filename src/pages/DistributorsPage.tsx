import type { JSX } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { RootState } from "@/store";
import { useLanguage } from "@/hooks/useLanguage";
import { useCan } from "@/hooks/usePermission";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { useTablePageState } from "@/hooks/useTablePageState";
import { SearchInput } from "@/components/shared/SearchInput";
import { DistributorTable } from "@/components/distributor/DistributorTable";
import { DistributorDetailPanel } from "@/components/distributor/DistributorDetailPanel";
import { DistributorFormModal } from "@/components/distributor/DistributorFormModal";
import { DeleteConfirmModal } from "@/components/distributor/DeleteConfirmModal";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import type { Distributor } from "@/types/distributor";
import { getDistributors } from "@/service/distributorService";
import { ToolbarMoreMenu } from "@/components/shared/ToolbarMoreMenu";
import { DistributorImportModal } from "@/components/data-transfer/ImportModals";
import { downloadDistributors } from "@/components/data-transfer/columns";

type ModalState =
  | { mode: "create" }
  | { mode: "import" }
  | { mode: "edit"; distributor: Distributor }
  | { mode: "delete"; distributor: Distributor }
  | { mode: "detail"; distributor: Distributor }
  | null;

export default function DistributorsPage(): JSX.Element {
  const { t } = useLanguage();
  const can = useCan();
  const pharmacyName = useSelector((state: RootState) => state.auth.currentPharmacy?.name ?? "");
  const pharmacyUuid = useSelector((state: RootState) => state.auth.currentPharmacy?.uuid);
  const pageTitleRef = useScrollAwareTitle();
  const { searchInput, debouncedSearch, page, setPage, limit, handleLimitChange, handleSearchChange } = useTablePageState();
  const [modal, setModal] = useState<ModalState>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["distributors", pharmacyUuid, page, limit, debouncedSearch],
    queryFn: () => getDistributors({ page, limit, search: debouncedSearch || undefined }),
    placeholderData: keepPreviousData,
  });

  const distributors = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  function closeModal(): void {
    setModal(null);
  }

  function handleSuccess(): void {
    const mode = modal?.mode;
    toast.success(
      <LiveToastMessage
        getMessage={(t) =>
          mode === "create" ? t.distributorCreateSuccess :
          mode === "edit"   ? t.distributorUpdateSuccess :
          t.distributorDeleteSuccess
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
          {t.navDistributors}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t.distributorsSubtitle}
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border md:overflow-x-auto">
          <div className="table-toolbar">
            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t.distributorSearchPlaceholder}
              isFetching={isFetching && !isLoading}
            />
            <ToolbarMoreMenu
              actions={[
                can("distributors.read") && { key: "export", icon: Download, label: t.toolbarExportExcel, description: t.importDistributorsExportHint, onSelect: () => downloadDistributors(pharmacyName) },
                can("distributors.create") && { key: "import", icon: Upload, label: t.toolbarImportExcel, description: t.toolbarImportDistributorsDesc, onSelect: () => setModal({ mode: "import" }) },
              ]}
            />
            {can("distributors.create") && (
            <Button
              onClick={() => setModal({ mode: "create" })}
              variant="success"
              className="shrink-0 gap-2 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-block sm:w-16 sm:text-center">
                {t.distributorAdd}
              </span>
            </Button>
            )}
          </div>
        </div>

        <DistributorTable
          distributors={distributors}
          isLoading={isLoading}
          search={debouncedSearch}
          t={t}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          onAdd={can("distributors.create") ? () => setModal({ mode: "create" }) : undefined}
          onDetails={(dist) => setModal({ mode: "detail", distributor: dist })}
          onEdit={can("distributors.update") ? (dist) => setModal({ mode: "edit", distributor: dist }) : undefined}
          onDelete={can("distributors.delete") ? (dist) => setModal({ mode: "delete", distributor: dist }) : undefined}
        />
      </Card>

      {modal?.mode === "detail" && (
        <DistributorDetailPanel
          distributor={modal.distributor}
          t={t}
          onClose={closeModal}
          onEdit={can("distributors.update") ? () => setModal({ mode: "edit", distributor: modal.distributor }) : undefined}
          onDelete={can("distributors.delete") ? () => setModal({ mode: "delete", distributor: modal.distributor }) : undefined}
        />
      )}

      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <DistributorFormModal
          mode={modal.mode}
          distributor={modal.mode === "edit" ? modal.distributor : undefined}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}

      {modal?.mode === "import" && <DistributorImportModal onClose={() => setModal(null)} />}

      {modal?.mode === "delete" && (
        <DeleteConfirmModal
          distributor={modal.distributor}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
