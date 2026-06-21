import type { JSX } from "react";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { useTablePageState } from "@/hooks/useTablePageState";
import { SearchInput } from "@/components/shared/SearchInput";
import { PharmacyTable } from "@/components/pharmacies/PharmacyTable";
import { PharmacyDetailPanel } from "@/components/pharmacies/PharmacyDetailPanel";
import { PharmacyFormModal } from "@/components/pharmacies/PharmacyFormModal";
import { PharmacyWizardModal } from "@/components/pharmacies/PharmacyWizardModal";
import { PharmacyDeleteModal } from "@/components/pharmacies/PharmacyDeleteModal";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import type { Pharmacy } from "@/types/pharmacy";
import { getPharmacies } from "@/service/pharmacyService";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; pharmacy: Pharmacy }
  | { mode: "delete"; pharmacy: Pharmacy }
  | { mode: "detail"; pharmacy: Pharmacy }
  | null;

export default function PharmaciesPage(): JSX.Element {
  const { t } = useLanguage();
  const pageTitleRef = useScrollAwareTitle();
  const { searchInput, debouncedSearch, page, setPage, limit, handleLimitChange, handleSearchChange } = useTablePageState();
  const [modal, setModal] = useState<ModalState>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["pharmacies", page, limit, debouncedSearch],
    queryFn: () => getPharmacies({ page, limit, search: debouncedSearch || undefined }),
    placeholderData: keepPreviousData,
  });

  const pharmacies = data?.data ?? [];
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
          mode === "create" ? t.pharmaCreateSuccess :
          mode === "edit"   ? t.pharmaUpdateSuccess :
          t.pharmaDeleteSuccess
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
          {t.navPharmacies}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t.pharmaciesSubtitle}
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto border-b border-border">
          <div className="flex w-max min-w-full items-center gap-2 px-5 py-3">
            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t.pharmaSearchPlaceholder}
              isFetching={isFetching && !isLoading}
            />
            <Button
              onClick={() => setModal({ mode: "create" })}
              variant="success"
              className="shrink-0 gap-2 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-block sm:w-16 sm:text-center">
                {t.pharmaAdd}
              </span>
            </Button>
          </div>
        </div>

        <PharmacyTable
          pharmacies={pharmacies}
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
          onDetails={(p) => setModal({ mode: "detail", pharmacy: p })}
          onEdit={(p) => setModal({ mode: "edit", pharmacy: p })}
          onDelete={(p) => setModal({ mode: "delete", pharmacy: p })}
        />
      </Card>

      {modal?.mode === "detail" && (
        <PharmacyDetailPanel
          pharmacy={modal.pharmacy}
          t={t}
          onClose={closeModal}
          onEdit={() => setModal({ mode: "edit", pharmacy: modal.pharmacy })}
          onDelete={() => setModal({ mode: "delete", pharmacy: modal.pharmacy })}
        />
      )}

      {modal?.mode === "create" && (
        <PharmacyWizardModal onClose={closeModal} onSuccess={handleSuccess} />
      )}

      {modal?.mode === "edit" && (
        <PharmacyFormModal
          mode="edit"
          pharmacy={modal.pharmacy}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}

      {modal?.mode === "delete" && (
        <PharmacyDeleteModal
          pharmacy={modal.pharmacy}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
