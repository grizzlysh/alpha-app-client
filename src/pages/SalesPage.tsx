import type { JSX } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { useTablePageState } from "@/hooks/useTablePageState";
import { SearchInput } from "@/components/shared/SearchInput";
import type { Sale, SaleStatus, SaleType, PaymentStatus } from "@/types/sale";
import { getSales } from "@/service/saleService";
import { getCustomersDropdown } from "@/service/customerService";
import { SaleTable } from "@/components/sales/SaleTable";
import { SaleDetailPanel } from "@/components/sales/SaleDetailPanel";
import { SaleCancelModal } from "@/components/sales/SaleCancelModal";
import { SaleRefundModal } from "@/components/sales/SaleRefundModal";
import { SalePaymentAddModal } from "@/components/sales/SalePaymentAddModal";
import { SaleCompleteModal } from "@/components/sales/SaleCompleteModal";

// ── Modal state ───────────────────────────────────────────────────────────────

type ModalState =
  | { mode: "detail"; sale: Sale }
  | { mode: "cancel"; sale: Sale }
  | { mode: "refund"; sale: Sale }
  | { mode: "payment"; sale: Sale }
  | { mode: "complete"; sale: Sale }
  | null;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SalesPage(): JSX.Element {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const pageTitleRef = useScrollAwareTitle();

  const { searchInput, debouncedSearch, page, setPage, limit, handleLimitChange, handleSearchChange } =
    useTablePageState();
  const [modal, setModal] = useState<ModalState>(null);

  const [filterStatus, setFilterStatus] = useState<SaleStatus | "all">("all");
  const [filterSaleType, setFilterSaleType] = useState<SaleType | "all">("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<PaymentStatus | "all">("all");
  const [filterCustomer, setFilterCustomer] = useState("all");

  const { data: customersData } = useQuery({
    queryKey: ["customers-dropdown"],
    queryFn: () => getCustomersDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const customerFilterOptions = [
    { value: "all", label: `${t.saleFilterCustomer}: ${t.filterAll}` },
    ...(customersData?.data ?? []).map((c) => ({ value: c.uuid, label: c.name.toUpperCase() })),
  ];

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "sales",
      page,
      limit,
      debouncedSearch,
      filterStatus,
      filterSaleType,
      filterPaymentStatus,
      filterCustomer,
    ],
    queryFn: () =>
      getSales({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        saleType: filterSaleType !== "all" ? filterSaleType : undefined,
        paymentStatus: filterPaymentStatus !== "all" ? filterPaymentStatus : undefined,
        customerUuid: filterCustomer !== "all" ? filterCustomer : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const sales = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  function handleFilterStatus(value: string): void {
    setFilterStatus(value as SaleStatus | "all");
    setPage(1);
  }

  function handleFilterSaleType(value: string): void {
    setFilterSaleType(value as SaleType | "all");
    setPage(1);
  }

  function handleFilterPaymentStatus(value: string): void {
    setFilterPaymentStatus(value as PaymentStatus | "all");
    setPage(1);
  }

  function handleFilterCustomer(value: string): void {
    setFilterCustomer(value);
    setPage(1);
  }

  function closeModal(): void {
    setModal(null);
  }

  function handleCancelSuccess(sale: Sale): void {
    setModal({ mode: "detail", sale });
  }

  function handleRefundSuccess(sale: Sale): void {
    setModal({ mode: "detail", sale });
  }

  function handlePaymentSuccess(): void {
    if (modal?.mode === "payment") setModal({ mode: "detail", sale: modal.sale });
  }

  function handleCompleteSuccess(sale: Sale): void {
    setModal({ mode: "detail", sale });
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2
          ref={pageTitleRef}
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          {t.navSales}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.salesSubtitle}</p>
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
                { value: "all", label: `${t.saleFilterStatus}: ${t.filterAll}` },
                { value: "PENDING", label: t.saleStatusPending },
                { value: "COMPLETED", label: t.saleStatusCompleted },
                { value: "CANCELLED", label: t.saleStatusCancelled },
                { value: "REFUNDED", label: t.saleStatusRefunded },
              ]}
              placeholder={t.saleFilterStatus}
              className="h-10 w-[11rem] shrink-0 rounded-xl text-sm"
            />

            {/* Sale type filter */}
            <Combobox
              value={filterSaleType}
              onValueChange={handleFilterSaleType}
              options={[
                { value: "all", label: `${t.saleFilterType}: ${t.filterAll}` },
                { value: "CASH", label: t.saleTypeCash },
                { value: "CREDIT", label: t.saleTypeCredit },
              ]}
              placeholder={t.saleFilterType}
              className="h-10 w-[10rem] shrink-0 rounded-xl text-sm"
            />

            {/* Payment status filter */}
            <Combobox
              value={filterPaymentStatus}
              onValueChange={handleFilterPaymentStatus}
              options={[
                { value: "all", label: `${t.saleFilterPaymentStatus}: ${t.filterAll}` },
                { value: "UNPAID", label: t.salePaymentStatusUnpaid },
                { value: "PARTIAL", label: t.salePaymentStatusPartial },
                { value: "PAID", label: t.salePaymentStatusPaid },
              ]}
              placeholder={t.saleFilterPaymentStatus}
              className="h-10 w-[12rem] shrink-0 rounded-xl text-sm"
            />

            {/* Customer filter */}
            <Combobox
              value={filterCustomer}
              onValueChange={handleFilterCustomer}
              options={customerFilterOptions}
              placeholder={t.saleFilterCustomer}
              className="h-10 w-[12rem] shrink-0 rounded-xl text-sm"
            />

            {/* Search */}
            <SearchInput
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={t.saleSearchPlaceholder}
              isFetching={isFetching && !isLoading}
            />

            {/* New sale button */}
            <Button
              onClick={() => navigate("/pos")}
              variant="success"
              className="shrink-0 gap-2 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-block sm:w-20 sm:text-center">
                {t.saleNewSale}
              </span>
            </Button>
          </div>
        </div>

        {/* Table */}
        <SaleTable
          sales={sales}
          isLoading={isLoading}
          search={debouncedSearch}
          t={t}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          onDetails={(s) => setModal({ mode: "detail", sale: s })}
          onCancel={(s) => setModal({ mode: "cancel", sale: s })}
          onRefund={(s) => setModal({ mode: "refund", sale: s })}
          onAddPayment={(s) => setModal({ mode: "payment", sale: s })}
          onComplete={(s) => setModal({ mode: "complete", sale: s })}
        />
      </Card>

      {/* Detail panel */}
      {modal?.mode === "detail" && (
        <SaleDetailPanel
          sale={modal.sale}
          t={t}
          onClose={closeModal}
          onCancel={() => setModal({ mode: "cancel", sale: modal.sale })}
          onRefund={() => setModal({ mode: "refund", sale: modal.sale })}
          onAddPayment={() => setModal({ mode: "payment", sale: modal.sale })}
          onComplete={() => setModal({ mode: "complete", sale: modal.sale })}
        />
      )}

      {/* Cancel modal */}
      {modal?.mode === "cancel" && (
        <SaleCancelModal
          sale={modal.sale}
          onClose={closeModal}
          onSuccess={handleCancelSuccess}
        />
      )}

      {/* Refund modal */}
      {modal?.mode === "refund" && (
        <SaleRefundModal
          sale={modal.sale}
          onClose={closeModal}
          onSuccess={handleRefundSuccess}
        />
      )}

      {/* Add payment modal */}
      {modal?.mode === "payment" && (
        <SalePaymentAddModal
          sale={modal.sale}
          onClose={closeModal}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Complete modal */}
      {modal?.mode === "complete" && (
        <SaleCompleteModal
          sale={modal.sale}
          onClose={closeModal}
          onSuccess={handleCompleteSuccess}
        />
      )}
    </div>
  );
}
