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
import { PatientTable } from "@/components/patients/PatientTable";
import { PatientDetailPanel } from "@/components/patients/PatientDetailPanel";
import { PatientFormModal } from "@/components/patients/PatientFormModal";
import { PatientDeleteModal } from "@/components/patients/PatientDeleteModal";
import type { Patient, PartyType } from "@/types/patient";
import { getPatients } from "@/service/patientService";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; patient: Patient }
  | { mode: "delete"; patient: Patient }
  | { mode: "detail"; patient: Patient }
  | null;

export default function PatientsPage(): JSX.Element {
  const { t } = useLanguage();
  const can = useCan();
  const pharmacyUuid = useSelector((state: RootState) => state.auth.currentPharmacy?.uuid);
  const pageTitleRef = useScrollAwareTitle();
  const { searchInput, debouncedSearch, page, setPage, limit, handleLimitChange, handleSearchChange } =
    useTablePageState();
  const [modal, setModal] = useState<ModalState>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "ACTIVE" | "INACTIVE">("all");
  const [filterIsWalkIn, setFilterIsWalkIn] = useState<"all" | "true" | "false">("all");
  const [filterPartyType, setFilterPartyType] = useState<"all" | PartyType>("all");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["patients", pharmacyUuid, page, limit, debouncedSearch, filterStatus, filterIsWalkIn, filterPartyType],
    queryFn: () =>
      getPatients({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        isWalkIn: filterIsWalkIn !== "all" ? filterIsWalkIn === "true" : undefined,
        partyType: filterPartyType !== "all" ? filterPartyType : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const patients = data?.data ?? [];
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

  function handleFilterPartyType(value: string): void {
    setFilterPartyType(value as "all" | PartyType);
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
            ? t.patientCreateSuccess
            : mode === "edit"
              ? t.patientUpdateSuccess
              : t.patientDeleteSuccess
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
          {t.navPatients}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.patientsSubtitle}</p>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border md:overflow-x-auto">
          <div className="table-toolbar">
            {/* Status filter */}
            <Combobox
              value={filterStatus}
              onValueChange={handleFilterStatus}
              options={[
                { value: "all", label: `${t.patientFilterStatus}: ${t.filterAll}` },
                { value: "ACTIVE", label: t.patientStatusActive },
                { value: "INACTIVE", label: t.patientStatusInactive },
              ]}
              placeholder={t.patientFilterStatus}
              className="h-10 w-[10rem] shrink-0 rounded-xl text-sm"
            />

            {/* Party type filter */}
            <Combobox
              value={filterPartyType}
              onValueChange={handleFilterPartyType}
              options={[
                { value: "all", label: `${t.patientFilterPartyType}: ${t.filterAll}` },
                { value: "PATIENT", label: t.patientPartyTypePatient },
                { value: "PROFESSIONAL", label: t.patientPartyTypeProfessional },
              ]}
              placeholder={t.patientFilterPartyType}
              className="h-10 w-[11rem] shrink-0 rounded-xl text-sm"
            />

            {/* Walk-in filter */}
            <Combobox
              value={filterIsWalkIn}
              onValueChange={handleFilterIsWalkIn}
              options={[
                { value: "all", label: `${t.patientFilterIsWalkIn}: ${t.filterAll}` },
                { value: "true", label: t.patientWalkInBadge },
                { value: "false", label: t.patientWalkInRegular },
              ]}
              placeholder={t.patientFilterIsWalkIn}
              className="h-10 w-[10rem] shrink-0 rounded-xl text-sm"
            />

            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t.patientSearchPlaceholder}
              isFetching={isFetching && !isLoading}
            />

            {can("customers.create") && (
            <Button
              onClick={() => setModal({ mode: "create" })}
              variant="success"
              className="shrink-0 gap-2 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-block sm:w-16 sm:text-center">
                {t.patientAdd}
              </span>
            </Button>
            )}
          </div>
        </div>

        <PatientTable
          patients={patients}
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
          onDetails={(patient) => setModal({ mode: "detail", patient })}
          onEdit={can("customers.update") ? (patient) => setModal({ mode: "edit", patient }) : undefined}
          onDelete={can("customers.delete") ? (patient) => setModal({ mode: "delete", patient }) : undefined}
        />
      </Card>

      {modal?.mode === "detail" && (
        <PatientDetailPanel
          patient={modal.patient}
          t={t}
          onClose={closeModal}
          onEdit={can("customers.update") ? () => setModal({ mode: "edit", patient: modal.patient }) : undefined}
          onDelete={can("customers.delete") ? () => setModal({ mode: "delete", patient: modal.patient }) : undefined}
        />
      )}

      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <PatientFormModal
          mode={modal.mode}
          patient={modal.mode === "edit" ? modal.patient : undefined}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}

      {modal?.mode === "delete" && (
        <PatientDeleteModal
          patient={modal.patient}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
