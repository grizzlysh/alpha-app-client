import type { JSX } from "react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RootState } from "@/store";
import { toast } from "sonner";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";

import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { getApiErrorMessage } from "@/utils/apiError";
import type { StockDetailSearchResult } from "@/types/stock";
import { getCustomersDropdown } from "@/service/customerService";
import { getStockDetails } from "@/service/stockService";
import type { Sale, SaleType, CreateSalePayload, UpdateSalePayload, PaymentMethod } from "@/types/sale";
import { createSale, updateSale, completeSale, cancelSale } from "@/service/saleService";
import { getBusinessParameters } from "@/service/businessParameterService";
import { BarcodeScannerModal } from "@/components/sales/BarcodeScannerModal";
import { PosProductGrid } from "@/components/sales/PosProductGrid";
import { PosCartPanel, type CartItem } from "@/components/sales/PosCartPanel";
import { PosPaymentModal, type PaymentConfirmation } from "@/components/sales/PosPaymentModal";
import { PosHeldSalesModal } from "@/components/sales/PosHeldSalesModal";
import { SaleSuccessModal } from "@/components/sales/SaleSuccessModal";

const PPN_PARAMETER_KEY = "PPN_PERCENTAGE_SELL";

class CheckoutError extends Error {}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PosPage(): JSX.Element {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const pageTitleRef = useScrollAwareTitle();
  const pharmacyUuid = useSelector((state: RootState) => state.auth.currentPharmacy?.uuid);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerUuid, setCustomerUuid] = useState("");

  const [scannerOpen, setScannerOpen] = useState(false);

  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [heldModalOpen, setHeldModalOpen] = useState(false);
  const [resumedSaleUuid, setResumedSaleUuid] = useState<string | null>(null);
  const [resumedSaleNumber, setResumedSaleNumber] = useState<string | null>(null);
  const [cancellingUuid, setCancellingUuid] = useState<string | null>(null);

  // ── Remote data ────────────────────────────────────────────────────────────
  const { data: customersData } = useQuery({
    queryKey: ["customers-dropdown"],
    queryFn: () => getCustomersDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: ppnParametersData } = useQuery({
    queryKey: ["business-parameters", PPN_PARAMETER_KEY, pharmacyUuid],
    queryFn: () => getBusinessParameters({ search: PPN_PARAMETER_KEY, pharmacyUuid }),
    staleTime: 5 * 60 * 1000,
  });

  const customerOptions = useMemo(
    () => [
      { value: "", label: t.posWalkInCustomer },
      ...(customersData?.data ?? [])
        .filter((c) => !c.isWalkIn)
        .map((c) => ({ value: c.uuid, label: c.name.toUpperCase() })),
    ],
    [customersData?.data, t.posWalkInCustomer]
  );

  const ppnPercentage = useMemo(() => {
    const param = ppnParametersData?.data?.find((p) => p.key === PPN_PARAMETER_KEY);
    return param ? parseFloat(param.value) : 0;
  }, [ppnParametersData]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantityPieces * (1 - item.discount / 100),
    0
  );
  const ppnAmount = subtotal * (ppnPercentage / 100);
  const total = subtotal + ppnAmount;

  // ── Cart handlers ──────────────────────────────────────────────────────────

  function handleAddToCart(detail: StockDetailSearchResult): void {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.stockDetailUuid === detail.uuid);
      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        if (existing.quantityPieces >= existing.availablePieces) return prev;
        return prev.map((item, i) =>
          i === existingIndex ? { ...item, quantityPieces: item.quantityPieces + 1 } : item
        );
      }
      const newItem: CartItem = {
        stockDetailUuid: detail.uuid,
        quantityPieces: 1,
        discount: 0,
        medicineName: detail.medicine.name,
        unit: detail.medicine.unit,
        batchNumber: detail.batchNumber,
        expiryDate: detail.expiryDate,
        unitPrice: detail.stock.effectiveSellingPrice,
        originalPrice: detail.stock.effectiveSellingPrice,
        availablePieces: detail.quantityPieces,
      };
      return [...prev, newItem];
    });
  }

  function handleIncrement(index: number): void {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index && item.quantityPieces < item.availablePieces
          ? { ...item, quantityPieces: item.quantityPieces + 1 }
          : item
      )
    );
  }

  function handleDecrement(index: number): void {
    setCart((prev) =>
      prev
        .map((item, i) => (i === index ? { ...item, quantityPieces: item.quantityPieces - 1 } : item))
        .filter((item) => item.quantityPieces > 0)
    );
  }

  function handleRemoveItem(index: number): void {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }

  function handlePriceChange(index: number, newPrice: number): void {
    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, unitPrice: newPrice } : item))
    );
  }

  function resetSale(): void {
    setCart([]);
    setCustomerUuid("");
    setCompletedSale(null);
    setPaidAmount(0);
    setResumedSaleUuid(null);
    setResumedSaleNumber(null);
  }

  // Scanning is a precise single-item lookup, so it goes through the
  // unpaginated /stock/details endpoint (exact match by barcode) and adds
  // straight to the cart — unlike the catalog grid, which is for browsing.
  const scanLookupMutation = useMutation({
    mutationFn: (barcode: string) => getStockDetails({ search: barcode }),
    onSuccess: (res, barcode) => {
      const match = res.data?.find((item) => item.barcode === barcode);
      if (match) {
        handleAddToCart(match);
      } else {
        toast.error(<LiveToastMessage getMessage={(t) => t.posScanNotFound} />);
      }
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, language, t.unexpectedError));
    },
  });

  function handleScannerScan(code: string): void {
    setScannerOpen(false);
    scanLookupMutation.mutate(code);
  }

  // ── Mutations ──────────────────────────────────────────────────────────────
  // The backend requires `payment` to be sent inside the createSale body
  // itself for CASH sales (it auto-records the full payment atomically) —
  // there's no longer a separate "add payment" call at checkout time. The
  // standalone payment endpoint is reserved for later installments on
  // CREDIT sales.
  function buildPayload(
    isPending: boolean,
    options?: { saleType?: SaleType; description?: string; paymentMethod?: PaymentMethod; discountAmount?: number }
  ): CreateSalePayload {
    const discountAmount = options?.discountAmount ?? 0;
    const grandTotal = Math.max(total - discountAmount, 0.01);
    return {
      ...(customerUuid ? { customerUuid } : {}),
      ...(options?.saleType ? { saleType: options.saleType } : {}),
      ...(options?.description ? { description: options.description } : {}),
      ...(options?.paymentMethod
        ? {
            payment: {
              paymentMethod: options.paymentMethod,
              ...(options.description ? { description: options.description } : {}),
            },
          }
        : {}),
      discountPercentage: 0,
      discountAmount,
      ppnPercentage,
      ppnAmount,
      totalAmount: subtotal,
      grandTotal,
      isPending,
      details: cart.map((item) => ({
        stockDetailUuid: item.stockDetailUuid,
        quantityPieces: item.quantityPieces,
        sellingPrice: item.unitPrice,
        originalPrice: item.originalPrice,
        discountPercentage: item.discount,
      })),
    };
  }

  // Scenario 2 — re-hold a resumed pending sale (PATCH /sales/:uuid)
  // No isPending, no payment, no paidAmount — backend updateSaleSchema
  function buildUpdatePayload(): UpdateSalePayload {
    return {
      ...(customerUuid ? { customerUuid } : {}),
      discountPercentage: 0,
      discountAmount: 0,
      ppnPercentage,
      ppnAmount,
      totalAmount: subtotal,
      grandTotal: Math.max(total, 0.01),
      details: cart.map((item) => ({
        stockDetailUuid: item.stockDetailUuid,
        quantityPieces: item.quantityPieces,
        sellingPrice: item.unitPrice,
        originalPrice: item.originalPrice,
        discountPercentage: item.discount,
      })),
    };
  }

  const checkoutMutation = useMutation({
    mutationFn: async (input: PaymentConfirmation) => {
      const payload = buildPayload(false, {
        saleType: input.saleType,
        description: input.description,
        paymentMethod: input.paymentMethod ?? undefined,
        discountAmount: input.discount,
      });

      // Scenario 3 — complete a previously held (PENDING) sale
      // Single call: backend releases reservations, deducts stock, records payment
      if (resumedSaleUuid) {
        const res = await completeSale(resumedSaleUuid, payload);
        if (!res.success || !res.data) throw new CheckoutError(res.message[language]);
        return { sale: res.data, amountReceived: input.amountReceived };
      }

      // Scenario 4 — fresh checkout: create a new completed sale
      const res = await createSale(payload);
      if (!res.success || !res.data) throw new CheckoutError(res.message[language]);
      return { sale: res.data, amountReceived: input.amountReceived };
    },
    onSuccess: ({ sale, amountReceived }) => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["stock-catalog"] });
      queryClient.invalidateQueries({ queryKey: ["stock-details-search"] });
      setCompletedSale(sale);
      setPaidAmount(amountReceived);
      setPaymentModalOpen(false);
      setResumedSaleUuid(null);
    },
    onError: (error: unknown) => {
      const message = error instanceof CheckoutError ? error.message : getApiErrorMessage(error, language, t.unexpectedError);
      toast.error(message);
    },
  });

  const holdMutation = useMutation({
    mutationFn: (existingUuid: string | null) =>
      // Scenario 2 — re-hold a resumed pending sale (update, no payment fields)
      // Scenario 1 — hold a fresh cart (create as pending, saleType CREDIT avoids payment requirement)
      existingUuid
        ? updateSale(existingUuid, buildUpdatePayload())
        : createSale(buildPayload(true, { saleType: "CREDIT" })),
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.invalidateQueries({ queryKey: ["sales"] });
        queryClient.invalidateQueries({ queryKey: ["stock-catalog"] });
        queryClient.invalidateQueries({ queryKey: ["stock-details-search"] });
        toast.success(<LiveToastMessage getMessage={(t) => t.posHoldSuccess} />);
        resetSale();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, language, t.unexpectedError));
    },
  });

  const cancelHeldMutation = useMutation({
    mutationFn: (uuid: string) => cancelSale(uuid, { description: "Cancelled from POS" }),
    onSuccess: (_, uuid) => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["stock-catalog"] });
      queryClient.invalidateQueries({ queryKey: ["stock-details-search"] });
      if (uuid === resumedSaleUuid) {
        resetSale();
      }
      setCancellingUuid(null);
      toast.success(<LiveToastMessage getMessage={(t) => t.posHeldSalesCancelSuccess} />);
    },
    onError: (error: unknown) => {
      setCancellingUuid(null);
      toast.error(getApiErrorMessage(error, language, t.unexpectedError));
    },
  });

  function handleContinue(sale: Sale): void {
    const items: CartItem[] = sale.details.map((d) => ({
      stockDetailUuid: d.stockDetail.uuid,
      quantityPieces: d.quantityPieces,
      discount: d.discountPercentage,
      medicineName: d.medicine.name,
      unit: d.medicine.unit,
      batchNumber: d.stockDetail.batchNumber,
      expiryDate: d.stockDetail.expiryDate,
      unitPrice: d.sellingPrice,
      originalPrice: d.originalPrice,
      availablePieces: d.quantityPieces,
    }));
    setCart(items);
    setCustomerUuid(sale.customer?.isWalkIn ? "" : (sale.customer?.uuid ?? ""));
    setResumedSaleUuid(sale.uuid);
    setResumedSaleNumber(sale.saleNumber);
    setHeldModalOpen(false);
    toast.success(<LiveToastMessage getMessage={(t) => t.posHeldSalesResumeSuccess} />);
  }

  function handleCancelHeld(sale: Sale): void {
    setCancellingUuid(sale.uuid);
    cancelHeldMutation.mutate(sale.uuid);
  }

  function openPaymentModal(): void {
    if (cart.length === 0) return;
    setPaymentModalOpen(true);
  }

  function handlePaymentConfirm(result: PaymentConfirmation): void {
    checkoutMutation.mutate(result);
  }

  function handleHold(): void {
    if (cart.length === 0) return;
    holdMutation.mutate(resumedSaleUuid);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col gap-4">
      <div>
        <h2
          ref={pageTitleRef}
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          {t.navPOS}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.posSubtitle}</p>
      </div>

      <Card className="grid min-h-0 flex-1 grid-cols-[1fr,440px] overflow-hidden">
        <div className="h-full min-h-0 overflow-hidden border-r border-border">
          <PosProductGrid
            t={t}
            onScanClick={() => setScannerOpen(true)}
            onAddToCart={handleAddToCart}
          />
        </div>

        <PosCartPanel
          t={t}
          cart={cart}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onRemove={handleRemoveItem}
          onPriceChange={handlePriceChange}
          customerUuid={customerUuid}
          onCustomerChange={setCustomerUuid}
          customerOptions={customerOptions}
          subtotal={subtotal}
          ppnPercentage={ppnPercentage}
          ppnAmount={ppnAmount}
          total={total}
          resumedSaleNumber={resumedSaleNumber}
          onHold={handleHold}
          onCheckout={openPaymentModal}
          isHolding={holdMutation.isPending}
          isCheckingOut={checkoutMutation.isPending}
          onReset={resetSale}
          onOpenHeldSales={() => setHeldModalOpen(true)}
        />
      </Card>

      {heldModalOpen && (
        <PosHeldSalesModal
          t={t}
          open={heldModalOpen}
          cartHasItems={cart.length > 0}
          cancellingUuid={cancellingUuid}
          onContinue={handleContinue}
          onCancelHeld={handleCancelHeld}
          onClose={() => setHeldModalOpen(false)}
        />
      )}

      {scannerOpen && (
        <BarcodeScannerModal t={t} onClose={() => setScannerOpen(false)} onScan={handleScannerScan} />
      )}

      {paymentModalOpen && (
        <PosPaymentModal
          t={t}
          items={cart}
          subtotal={subtotal}
          ppnPercentage={ppnPercentage}
          ppnAmount={ppnAmount}
          total={total}
          customerUuid={customerUuid}
          customerLabel={customerOptions.find((c) => c.value === customerUuid)?.label ?? t.posWalkInCustomer}
          isSubmitting={checkoutMutation.isPending}
          onCancel={() => setPaymentModalOpen(false)}
          onConfirm={handlePaymentConfirm}
        />
      )}

      {completedSale && (
        <SaleSuccessModal sale={completedSale} amountReceived={paidAmount} t={t} onNewSale={resetSale} />
      )}
    </div>
  );
}
