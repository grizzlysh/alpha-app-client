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
import { DoctorTable } from "@/components/doctors/DoctorTable";
import { DoctorDetailsPanel } from "@/components/doctors/DoctorDetailsPanel";
import { DoctorFormModal } from "@/components/doctors/DoctorFormModal";
import { DoctorDeleteModal } from "@/components/doctors/DoctorDeleteModal";
import type { Doctor } from "@/types/doctor";
import { getDoctors } from "@/service/doctorService";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; doctor: Doctor }
  | { mode: "delete"; doctor: Doctor }
  | { mode: "detail"; doctor: Doctor }
  | null;

export default function DoctorsPage(): JSX.Element {
  const { t } = useLanguage();
  const can = useCan();
  const pharmacyUuid = useSelector((state: RootState) => state.auth.currentPharmacy?.uuid);
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
  const [filterStatus, setFilterStatus] = useState<"all" | "ACTIVE" | "INACTIVE">("all");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["doctors", pharmacyUuid, page, limit, debouncedSearch, filterStatus],
    queryFn: () =>
      getDoctors({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const doctors = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  function handleFilterStatus(value: string): void {
    setFilterStatus(value as "all" | "ACTIVE" | "INACTIVE");
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
            ? t.doctorCreateSuccess
            : mode === "edit"
              ? t.doctorUpdateSuccess
              : t.doctorDeleteSuccess
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
          {t.navDoctors}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.doctorsSubtitle}</p>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border md:overflow-x-auto">
          <div className="table-toolbar">
            {/* Status filter */}
            <Combobox
              value={filterStatus}
              onValueChange={handleFilterStatus}
              options={[
                { value: "all", label: `${t.doctorFilterStatus}: ${t.filterAll}` },
                { value: "ACTIVE", label: t.doctorStatusActive },
                { value: "INACTIVE", label: t.doctorStatusInactive },
              ]}
              placeholder={t.doctorFilterStatus}
              className="h-10 w-[10rem] shrink-0 rounded-xl text-sm"
            />

            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t.doctorSearchPlaceholder}
              isFetching={isFetching && !isLoading}
            />

            {can("doctors.create") && (
            <Button
              onClick={() => setModal({ mode: "create" })}
              variant="success"
              className="shrink-0 gap-2 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-block sm:w-16 sm:text-center">
                {t.doctorAdd}
              </span>
            </Button>
            )}
          </div>
        </div>

        <DoctorTable
          doctors={doctors}
          isLoading={isLoading}
          search={debouncedSearch}
          t={t}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          onAdd={can("doctors.create") ? () => setModal({ mode: "create" }) : undefined}
          onDetails={(doctor) => setModal({ mode: "detail", doctor })}
          onEdit={can("doctors.update") ? (doctor) => setModal({ mode: "edit", doctor }) : undefined}
          onDelete={can("doctors.delete") ? (doctor) => setModal({ mode: "delete", doctor }) : undefined}
        />
      </Card>

      {modal?.mode === "detail" && (
        <DoctorDetailsPanel
          doctor={modal.doctor}
          t={t}
          onClose={closeModal}
          onEdit={can("doctors.update") ? () => setModal({ mode: "edit", doctor: modal.doctor }) : undefined}
          onDelete={can("doctors.delete") ? () => setModal({ mode: "delete", doctor: modal.doctor }) : undefined}
        />
      )}

      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <DoctorFormModal
          mode={modal.mode}
          doctor={modal.mode === "edit" ? modal.doctor : undefined}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}

      {modal?.mode === "delete" && (
        <DoctorDeleteModal
          doctor={modal.doctor}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
