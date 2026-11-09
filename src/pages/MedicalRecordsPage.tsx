import type { JSX } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ClipboardPlus, UserRound, Stethoscope } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/shared/SearchInput";
import type { RootState } from "@/store";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { useDebounce } from "use-debounce";
import { getCustomers } from "@/service/customerService";
import { cn } from "@/utils/cn";
import type { Customer } from "@/types/customer";
import { MedicalRecordPanel } from "@/components/medical-records/MedicalRecordPanel";

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function MedicalRecordsPage(): JSX.Element {
  const { t } = useLanguage();
  const pharmacyUuid = useSelector((state: RootState) => state.auth.currentPharmacy?.uuid);
  const pageTitleRef = useScrollAwareTitle();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 400);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["customers-patients", pharmacyUuid, debouncedSearch],
    queryFn: () =>
      getCustomers({
        customerType: "PATIENT",
        search: debouncedSearch || undefined,
        limit: 50,
      }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  const patients = data?.data ?? [];

  function handleSelect(customer: Customer): void {
    setSelectedCustomer(customer);
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col space-y-4 overflow-hidden">
      {/* Page header */}
      <div>
        <h2
          ref={pageTitleRef}
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          {t.navMedicalRecords}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.medicalRecordsSubtitle}</p>
      </div>

      {/* Split layout */}
      <div className="flex min-h-0 flex-1 gap-4">
        {/* Patient list */}
        <Card className="flex w-72 flex-shrink-0 flex-col overflow-hidden">
          {/* Search */}
          <div className="border-b border-border p-3">
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              placeholder={t.medicalRecordPatientSearchPlaceholder}
              isFetching={isFetching && !isLoading}
              className="w-full"
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-1 p-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-muted/50" />
                ))}
              </div>
            ) : patients.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                <UserRound className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">{t.customerNoResults}</p>
              </div>
            ) : (
              <div className="space-y-0.5 p-2">
                {patients.map((patient) => (
                  <PatientListItem
                    key={patient.uuid}
                    patient={patient}
                    isSelected={selectedCustomer?.uuid === patient.uuid}
                    onClick={handleSelect}
                    medicalRecordLabel={t.customerMedicalRecordNumber}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Medical record panel */}
        <Card className="flex flex-1 flex-col overflow-hidden">
          {selectedCustomer ? (
            <MedicalRecordPanel customer={selectedCustomer} />
          ) : (
            <EmptyState
              title={t.medicalRecordNoPatientSelected}
              desc={t.medicalRecordNoPatientSelectedDesc}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

// ── Patient list item ─────────────────────────────────────────────────────────

interface PatientListItemProps {
  patient: Customer;
  isSelected: boolean;
  onClick: (p: Customer) => void;
  medicalRecordLabel: string;
}

function PatientListItem({
  patient,
  isSelected,
  onClick,
  medicalRecordLabel,
}: PatientListItemProps): JSX.Element {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
        isSelected
          ? "bg-primary/10 text-primary"
          : "hover:bg-muted/60 text-foreground"
      )}
      onClick={() => onClick(patient)}
    >
      <div
        className={cn(
          "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold",
          isSelected
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        {getInitials(patient.name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm font-semibold", isSelected ? "text-primary" : "text-foreground")}>
          {patient.name.toUpperCase()}
        </p>
        <p className="truncate font-mono text-xs text-muted-foreground">
          {patient.medicalRecord?.number
            ? patient.medicalRecord.number
            : patient.phone ?? "—"}
        </p>
      </div>
    </button>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ title, desc }: { title: string; desc: string }): JSX.Element {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/40">
        <ClipboardPlus className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <div>
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
