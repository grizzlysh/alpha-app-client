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
import type { Invoice, PaymentStatus } from "@/types/invoice";
import { getInvoices } from "@/service/invoiceService";
import { getDistributorsDropdown } from "@/service/distributorService";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { InvoiceDetailPanel } from "@/components/invoices/InvoiceDetailPanel";
import { InvoiceFormModal } from "@/components/invoices/InvoiceFormModal";
import { InvoiceDeleteModal } from "@/components/invoices/InvoiceDeleteModal";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";

// ── Modal state ───────────────────────────────────────────────────────────────

type ModalState =
  | { mode: "create" }
  | { mode: "detail"; invoice: Invoice }
  | { mode: "delete"; invoice: Invoice }
  | null;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InvoicesPage(): JSX.Element {
  const { t } = useLanguage();
  const pageTitleRef = useScrollAwareTitle();

  const { searchInput, debouncedSearch, page, setPage, limit, handleLimitChange, handleSearchChange } =
    useTablePageState();
  const [modal, setModal] = useState<ModalState>(null);

  // ── Filter state ──────────────────────────────────────────────────────────────
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | "all">("all");
  const [filterDistributor, setFilterDistributor] = useState("all");

  // ── Distributor dropdown for filter ──────────────────────────────────────────
  const { data: distributorsData } = useQuery({
    queryKey: ["distributors-dropdown"],
    queryFn: () => getDistributorsDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const distributorFilterOptions = [
    { value: "all", label: `${t.invoiceFilterDistributor}: ${t.filterAll}` },
    ...(distributorsData?.data ?? []).map((d) => ({
      value: d.uuid,
      label: d.name.toUpperCase(),
    })),
  ];

  // ── Main query ────────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "invoices",
      page,
      limit,
      debouncedSearch,
      filterStatus,
      filterDistributor,
    ],
    queryFn: () =>
      getInvoices({
        page,
        limit,
        search: debouncedSearch || undefined,
        paymentStatus: filterStatus !== "all" ? filterStatus : undefined,
        distributorUuid: filterDistributor !== "all" ? filterDistributor : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const invoices = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  // ── Helpers ───────────────────────────────────────────────────────────────────

  function handleFilterStatus(value: string): void {
    setFilterStatus(value as PaymentStatus | "all");
    setPage(1);
  }

  function handleFilterDistributor(value: string): void {
    setFilterDistributor(value);
    setPage(1);
  }

  function closeModal(): void {
    setModal(null);
  }

  function handleCreateSuccess(invoice: Invoice): void {
    toast.success(
      <LiveToastMessage getMessage={(t) => t.invoiceCreateSuccess} />
    );
    setModal({ mode: "detail", invoice });
  }

  function handleDeleteSuccess(): void {
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
          {t.navInvoices}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {t.invoicesSubtitle}
        </p>
      </div>

      {/* Main card */}
      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="overflow-x-auto border-b border-border">
          <div className="flex w-max min-w-full items-center gap-2 px-5 py-3">
            {/* Payment status filter */}
            <Combobox
              value={filterStatus}
              onValueChange={handleFilterStatus}
              options={[
                { value: "all", label: `${t.invoiceFilterStatus}: ${t.filterAll}` },
                { value: "UNPAID", label: t.invoicePaymentStatusUnpaid },
                { value: "PARTIAL", label: t.invoicePaymentStatusPartial },
                { value: "PAID", label: t.invoicePaymentStatusPaid },
              ]}
              placeholder={t.invoiceFilterStatus}
              className="h-10 w-[11rem] shrink-0 rounded-xl text-sm"
            />

            {/* Distributor filter */}
            <Combobox
              value={filterDistributor}
              onValueChange={handleFilterDistributor}
              options={distributorFilterOptions}
              placeholder={t.invoiceFilterDistributor}
              className="h-10 w-[13rem] shrink-0 rounded-xl text-sm"
            />

            {/* Search */}
            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t.invoiceSearchPlaceholder}
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
                {t.invoiceAdd}
              </span>
            </Button>
          </div>
        </div>

        {/* Table */}
        <InvoiceTable
          invoices={invoices}
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
          onDetails={(invoice) => setModal({ mode: "detail", invoice })}
          onDelete={(invoice) => setModal({ mode: "delete", invoice })}
        />
      </Card>

      {/* Detail panel */}
      {modal?.mode === "detail" && (
        <InvoiceDetailPanel
          invoice={modal.invoice}
          t={t}
          onClose={closeModal}
          onDelete={() => setModal({ mode: "delete", invoice: modal.invoice })}
        />
      )}

      {/* Create modal */}
      {modal?.mode === "create" && (
        <InvoiceFormModal
          onClose={closeModal}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Delete modal */}
      {modal?.mode === "delete" && (
        <InvoiceDeleteModal
          invoice={modal.invoice}
          onClose={closeModal}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
