import type { JSX } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";
import { useNameFormat } from "@/hooks/useNameFormat";
import { importCustomers, importDistributors, importOpeningStock } from "@/service/dataTransferService";
import { getSigners } from "@/service/userService";
import { getDistributorsDropdown } from "@/service/distributorService";
import { SpreadsheetImportModal } from "./SpreadsheetImportModal";
import { CUSTOMER_COLUMNS, DISTRIBUTOR_COLUMNS, OPENING_STOCK_COLUMNS } from "./columns";

export function DistributorImportModal({ onClose }: { onClose: () => void }): JSX.Element {
  const { t } = useLanguage();
  return (
    <SpreadsheetImportModal
      title={t.importDistributorsTitle}
      description={t.importSkipExistingDesc}
      columns={DISTRIBUTOR_COLUMNS}
      template={{
        filename: "template-distributor.xlsx",
        sheet: "Distributor",
        rows: [["PT Contoh Farma", "021-5551234", "order@contoh.co.id", "Jl. Contoh No. 1, Jakarta", "Budi", "PBF-123/2024"]],
      }}
      run={importDistributors}
      willAdd={t.importWillAddDistributors}
      added={t.importAddedDistributors}
      onClose={onClose}
    />
  );
}

export function CustomerImportModal({ onClose }: { onClose: () => void }): JSX.Element {
  const { t } = useLanguage();
  return (
    <SpreadsheetImportModal
      title={t.importPatientsTitle}
      description={t.importPatientsDesc}
      columns={CUSTOMER_COLUMNS}
      template={{
        filename: "template-pasien.xlsx",
        sheet: "Pasien",
        rows: [["Siti Aminah", "081234567890", "Jl. Melati No. 2", "P", "1985-04-21", "3174xxxxxxxxxxxx", ""]],
      }}
      run={importCustomers}
      willAdd={t.importWillAddPatients}
      added={t.importAddedPatients}
      onClose={onClose}
    />
  );
}

/**
 * The stock counted on day one. Booked as a paid receipt per distributor, so
 * batches, prices and stock movements work as for any delivery.
 */
export function OpeningStockImportModal({ onClose }: { onClose: () => void }): JSX.Element {
  const { t } = useLanguage();
  const fmt = useNameFormat();
  const [signedByUuid, setSignedByUuid] = useState("");
  const [defaultDistributorUuid, setDefaultDistributorUuid] = useState("");

  const { data: signers } = useQuery({
    queryKey: ["users-signers", "PHARMACIST"],
    queryFn: () => getSigners("PHARMACIST"),
    staleTime: 5 * 60 * 1000,
  });
  const { data: distributors } = useQuery({
    queryKey: ["distributors-dropdown"],
    queryFn: getDistributorsDropdown,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <SpreadsheetImportModal
      title={t.importOpeningStockTitle}
      description={t.importOpeningStockDesc}
      columns={OPENING_STOCK_COLUMNS}
      template={{
        filename: "template-saldo-stok-awal.xlsx",
        sheet: "Saldo Awal",
        rows: [["Paracetamol 500mg", "B12345", "2027-12-31", 100, 350, 500, "PT Contoh Farma"]],
      }}
      run={(rows, dryRun) =>
        importOpeningStock(rows, dryRun, { signedByUuid, defaultDistributorUuid: defaultDistributorUuid || undefined })
      }
      ready={!!signedByUuid}
      willAdd={t.importWillAddBatches}
      added={t.importAddedBatches}
      onClose={onClose}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>
            {t.importStockSigner}
            <span className="ml-0.5 text-destructive">*</span>
          </Label>
          <Combobox
            value={signedByUuid}
            onValueChange={setSignedByUuid}
            options={(signers?.data ?? []).map((u) => ({
              value: u.uuid,
              label: u.isHeadPharmacist ? `${u.name} · ${t.roleTypeHeadPharmacist}` : u.name,
            }))}
            placeholder={t.poSelectSignedBy}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label>{t.importStockDefaultDistributor}</Label>
          <Combobox
            value={defaultDistributorUuid}
            onValueChange={setDefaultDistributorUuid}
            options={[
              { value: "", label: "—" },
              ...(distributors?.data ?? []).map((d) => ({ value: d.uuid, label: fmt(d.name) })),
            ]}
            placeholder={t.importStockDefaultDistributor}
            className="rounded-xl"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{t.importOpeningStockNote}</p>
    </SpreadsheetImportModal>
  );
}
