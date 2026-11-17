import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RootState } from "@/store";
import { toast } from "sonner";
import { ScanBarcode } from "lucide-react";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";

import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { useLanguage } from "@/hooks/useLanguage";
import { useCan } from "@/hooks/usePermission";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { getApiErrorMessage } from "@/utils/apiError";
import { toDoctorName } from "@/utils/stringHelpers";
import { computeTotals } from "@/utils/saleMath";
import type { StockDetailSearchResult } from "@/types/stock";
import { getCustomersDropdown } from "@/service/customerService";
import { getStockDetails } from "@/service/stockService";
import type { Sale, SaleType, CreateSalePayload, UpdateSalePayload, PaymentMethod } from "@/types/sale";
import { createSale, updateSale, completeSale, cancelSale } from "@/service/saleService";
import { getPrescriptionsQueue } from "@/service/prescriptionService";
import { getBusinessParameters } from "@/service/businessParameterService";
import { BarcodeScannerModal } from "@/components/sales/BarcodeScannerModal";
import { PosProductGrid } from "@/components/sales/PosProductGrid";
import { PosCartPanel, type CartItem } from "@/components/sales/PosCartPanel";
import { PosPaymentModal, type PaymentConfirmation } from "@/components/sales/PosPaymentModal";
import { PosHeldSalesModal } from "@/components/sales/PosHeldSalesModal";
import { PosPrescriptionModal } from "@/components/sales/PosPrescriptionModal";
import { SaleSuccessModal } from "@/components/sales/SaleSuccessModal";
import { PurchaseHistory } from "@/components/customers/PurchaseHistory";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { PurchaseMedicine } from "@/types/customer";

const PPN_PARAMETER_KEY = "PPN_PERCENTAGE_SELL";
const MAX_DISCOUNT_PARAMETER_KEY = "MAX_DISCOUNT_PERCENTAGE";

class CheckoutError extends Error {}

// ── Draft persistence ─────────────────────────────────────────────────────────
// The cart survives a page refresh or an accidental tab close (per pharmacy,
// per browser tab). sessionStorage is used so a draft never outlives the tab.

interface PosDraft {
  cart: CartItem[];
  customerUuid: string;
  prescriptionUuid: string;
  resumedSaleUuid: string | null;
  resumedSaleNumber: string | null;
}

const draftKey = (pharmacyUuid: string | undefined) => `pos-draft:${pharmacyUuid ?? "none"}`;

function loadDraft(pharmacyUuid: string | undefined): PosDraft | null {
  try {
    const raw = sessionStorage.getItem(draftKey(pharmacyUuid));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PosDraft;
    return Array.isArray(parsed.cart) ? parsed : null;
  } catch {
    return null;
  }
}

function saveDraft(pharmacyUuid: string | undefined, draft: PosDraft): void {
  try {
    if (draft.cart.length === 0 && !draft.resumedSaleUuid) sessionStorage.removeItem(draftKey(pharmacyUuid));
    else sessionStorage.setItem(draftKey(pharmacyUuid), JSON.stringify(draft));
  } catch {
    // Storage full or blocked — the draft is a convenience only.
  }
}

function newIdempotencyKey(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PosPage(): JSX.Element {
  const { t, language } = useLanguage();
  const can = useCan();
  const canOverridePrice = can("sales.override_price");
  const queryClient = useQueryClient();
  const pageTitleRef = useScrollAwareTitle();
  const pharmacyUuid = useSelector((state: RootState) => state.auth.currentPharmacy?.uuid);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [initialDraft] = useState(() => loadDraft(pharmacyUuid));
  const [cart, setCart] = useState<CartItem[]>(initialDraft?.cart ?? []);
  const [customerUuid, setCustomerUuid] = useState(initialDraft?.customerUuid ?? "");
  const [prescriptionUuid, setPrescriptionUuid] = useState(initialDraft?.prescriptionUuid ?? "");
  const [resumedSaleUuid, setResumedSaleUuid] = useState<string | null>(initialDraft?.resumedSaleUuid ?? null);
  const [resumedSaleNumber, setResumedSaleNumber] = useState<string | null>(initialDraft?.resumedSaleNumber ?? null);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [heldModalOpen, setHeldModalOpen] = useState(false);
  const [cancellingUuid, setCancellingUuid] = useState<string | null>(null);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  // Below the lg breakpoint products and cart are two tabs instead of two columns.
  const [mobileTab, setMobileTab] = useState<"products" | "cart">("products");

  // One key per payment attempt: retries of the same checkout reuse it, so a lost
  // response can never turn into a duplicate sale.
  const idempotencyKeyRef = useRef<string>(newIdempotencyKey());

  useEffect(() => {
    if (initialDraft && initialDraft.cart.length > 0) {
      toast.info(<LiveToastMessage getMessage={(t) => t.posDraftRestored} />);
    }
    // Only on first mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    saveDraft(pharmacyUuid, { cart, customerUuid, prescriptionUuid, resumedSaleUuid, resumedSaleNumber });
  }, [pharmacyUuid, cart, customerUuid, prescriptionUuid, resumedSaleUuid, resumedSaleNumber]);

  // ── Remote data ────────────────────────────────────────────────────────────
  const { data: customersData } = useQuery({
    queryKey: ["customers-dropdown", pharmacyUuid],
    queryFn: () => getCustomersDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: parametersData } = useQuery({
    queryKey: ["business-parameters", "pos", pharmacyUuid],
    queryFn: () => getBusinessParameters({ pharmacyUuid, limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: prescriptionsQueueData } = useQuery({
    queryKey: ["prescriptions-queue", pharmacyUuid],
    queryFn: () => getPrescriptionsQueue(),
    staleTime: 2 * 60 * 1000,
  });

  const customerOptions = useMemo(
    () => [
      { value: "", label: t.posWalkInPatient },
      ...(customersData?.data ?? [])
        .filter((c) => !c.isWalkIn)
        .map((c) => ({ value: c.uuid, label: c.name.toUpperCase() })),
    ],
    [customersData?.data, t.posWalkInPatient]
  );

  const prescriptionOptions = useMemo(
    () => [
      { value: "", label: "—" },
      ...(prescriptionsQueueData?.data ?? []).map((p) => ({
        value: p.uuid,
        label: [
          p.prescriptionNumber ?? "No #",
          "·",
          p.customer.name.toUpperCase(),
          p.doctor ? `(${toDoctorName(p.doctor.name)})` : "",
        ]
          .filter(Boolean)
          .join(" "),
      })),
    ],
    [prescriptionsQueueData?.data]
  );

  const numericParam = useCallback(
    (key: string): number => {
      const param = parametersData?.data?.find((p) => p.key === key);
      const n = param ? parseFloat(param.value) : 0;
      return Number.isFinite(n) ? n : 0;
    },
    [parametersData]
  );
  const ppnPercentage = numericParam(PPN_PARAMETER_KEY);
  const maxDiscountPercentage = numericParam(MAX_DISCOUNT_PARAMETER_KEY);

  // Cart totals before any checkout discount — the same formula the server uses.
  const { subtotal, ppnAmount, grandTotal: total } = computeTotals(cart, 0, ppnPercentage);

  // ── Cart handlers ──────────────────────────────────────────────────────────

  const handleAddToCart = useCallback(
    (detail: StockDetailSearchResult): boolean => {
      const available = detail.availablePieces ?? detail.quantityPieces;
      if (available <= 0) {
        toast.error(`${detail.medicine.name.toUpperCase()} — ${t.posOutOfStock}`);
        return false;
      }
      let added = true;
      setCart((prev) => {
        const existingIndex = prev.findIndex((item) => item.stockDetailUuid === detail.uuid);
        if (existingIndex >= 0) {
          const existing = prev[existingIndex];
          if (existing.quantityPieces >= existing.availablePieces) {
            added = false;
            return prev;
          }
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
          availablePieces: available,
          quantityPerBox: detail.quantityPerBox ?? 0,
          requiresPrescription: detail.medicine.type.requiredPrescription ?? false,
        };
        return [...prev, newItem];
      });
      if (!added) {
        toast.error(`${t.posStockInsufficient} — ${detail.medicine.name.toUpperCase()}`);
      }
      return added;
    },
    [t]
  );

  // "Buy again" from the purchase history: the earliest-expiring sellable batch
  // that still has room (FEFO), same rules as picking it from the grid.
  const handleBuyAgain = useCallback(
    async (medicine: PurchaseMedicine): Promise<void> => {
      try {
        const res = await getStockDetails({ medicineUuid: medicine.uuid });
        const batches = res.data ?? [];
        const batch = batches.find((d) => {
          const available = d.availablePieces ?? d.quantityPieces;
          const inCart = cart.find((c) => c.stockDetailUuid === d.uuid)?.quantityPieces ?? 0;
          return available > inCart;
        });
        if (!batch) {
          toast.error(`${medicine.name.toUpperCase()} — ${t.posOutOfStock}`);
          return;
        }
        if (handleAddToCart(batch)) {
          toast.success(t.posScanAdded.replace("{name}", medicine.name.toUpperCase()), { duration: 1500 });
        }
      } catch (error) {
        toast.error(getApiErrorMessage(error, language, t.unexpectedError));
      }
    },
    [cart, handleAddToCart, language, t]
  );

  function handleQuantityChange(index: number, quantity: number): void {
    setCart((prev) => {
      const item = prev[index];
      if (!item) return prev;
      if (quantity <= 0) return prev.filter((_, i) => i !== index);
      if (quantity > item.availablePieces) {
        toast.error(`${t.posStockInsufficient} — ${t.posAvailableShort.replace("{n}", String(item.availablePieces))}`);
        quantity = item.availablePieces;
      }
      return prev.map((it, i) => (i === index ? { ...it, quantityPieces: quantity } : it));
    });
  }

  function handleRemoveItem(index: number): void {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }

  function handlePriceChange(index: number, newPrice: number): void {
    if (!canOverridePrice) return;
    setCart((prev) => prev.map((item, i) => (i === index ? { ...item, unitPrice: newPrice } : item)));
  }

  function resetSale(): void {
    setCart([]);
    setCustomerUuid("");
    setPrescriptionUuid("");
    setCompletedSale(null);
    setPaidAmount(0);
    setResumedSaleUuid(null);
    setResumedSaleNumber(null);
    setMobileTab("products");
    idempotencyKeyRef.current = newIdempotencyKey();
    setTimeout(() => searchInputRef.current?.focus(), 0);
  }

  // ── Barcode lookup (camera modal, USB scanner, Enter in search) ────────────
  // Exact barcode match through the unpaginated /stock/details endpoint.
  const addByBarcode = useCallback(
    async (code: string): Promise<boolean> => {
      try {
        const res = await getStockDetails({ search: code });
        const match = res.data?.find((item) => item.barcode === code);
        if (!match) return false;
        if (handleAddToCart(match)) {
          toast.success(t.posScanAdded.replace("{name}", match.medicine.name.toUpperCase()), { duration: 1500 });
        }
        return true;
      } catch (error) {
        toast.error(getApiErrorMessage(error, language, t.unexpectedError));
        return true;
      }
    },
    [handleAddToCart, language, t]
  );

  const anyModalOpen = paymentModalOpen || heldModalOpen || scannerOpen || prescriptionModalOpen || !!completedSale;

  useBarcodeScanner({
    enabled: !anyModalOpen,
    onScan: async (code) => {
      const found = await addByBarcode(code);
      if (!found) toast.error(<LiveToastMessage getMessage={(t) => t.posScanNotFound} />);
    },
  });

  async function handleSearchEnter(value: string, visible: StockDetailSearchResult[]): Promise<boolean> {
    const exact = visible.find((d) => d.barcode === value);
    if (exact) return handleAddToCart(exact) || true;
    if (await addByBarcode(value)) return true;
    // Not a barcode: if the search narrowed down to one product, Enter adds it.
    if (visible.length === 1) return handleAddToCart(visible[0]) || true;
    return false;
  }

  async function handleScannerScan(code: string): Promise<void> {
    setScannerOpen(false);
    const found = await addByBarcode(code);
    if (!found) toast.error(<LiveToastMessage getMessage={(t) => t.posScanNotFound} />);
  }

  // ── Mutations ──────────────────────────────────────────────────────────────
  // The server prices every line and computes all totals; we send quantities,
  // a unit price only when the user deliberately changed it, and the discount.
  function buildDetails() {
    return cart.map((item) => ({
      stockDetailUuid: item.stockDetailUuid,
      quantityPieces: item.quantityPieces,
      ...(item.unitPrice !== item.originalPrice ? { sellingPrice: item.unitPrice } : {}),
      discountPercentage: item.discount,
    })) as CreateSalePayload["details"];
  }

  function buildPayload(
    isPending: boolean,
    options?: { saleType?: SaleType; description?: string; paymentMethod?: PaymentMethod; discountAmount?: number }
  ): CreateSalePayload {
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
      ...(prescriptionUuid ? { prescriptionUuid } : {}),
      isPrescription: cart.some((item) => item.requiresPrescription) || !!prescriptionUuid,
      discountAmount: options?.discountAmount ?? 0,
      isPending,
      details: buildDetails(),
    };
  }

  function buildUpdatePayload(): UpdateSalePayload {
    return {
      ...(customerUuid ? { customerUuid } : {}),
      ...(prescriptionUuid ? { prescriptionUuid } : {}),
      isPrescription: cart.some((item) => item.requiresPrescription) || !!prescriptionUuid,
      details: buildDetails(),
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
      const options = { idempotencyKey: idempotencyKeyRef.current };

      // Complete a previously held (PENDING) sale, or create a fresh completed sale.
      const res = resumedSaleUuid
        ? await completeSale(resumedSaleUuid, payload, options)
        : await createSale(payload, options);
      if (!res.success || !res.data) throw new CheckoutError(res.message[language]);
      return { sale: res.data, amountReceived: input.amountReceived };
    },
    onSuccess: ({ sale, amountReceived }) => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["stock-catalog"] });
      queryClient.invalidateQueries({ queryKey: ["stock-details-search"] });
      queryClient.invalidateQueries({ queryKey: ["prescriptions-queue"] });
      setCompletedSale(sale);
      setPaidAmount(amountReceived);
      setPaymentModalOpen(false);
      setResumedSaleUuid(null);
      idempotencyKeyRef.current = newIdempotencyKey();
    },
    onError: (error: unknown) => {
      const message = error instanceof CheckoutError ? error.message : getApiErrorMessage(error, language, t.unexpectedError);
      toast.error(message);
    },
  });

  const holdMutation = useMutation({
    mutationFn: (existingUuid: string | null) =>
      // Re-hold a resumed pending sale, or hold a fresh cart (CREDIT avoids the payment requirement).
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
      if (uuid === resumedSaleUuid) resetSale();
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
      quantityPerBox: 0,
      requiresPrescription: d.requiresPrescription,
    }));
    setCart(items);
    setCustomerUuid(sale.customer?.isWalkIn ? "" : (sale.customer?.uuid ?? ""));
    setPrescriptionUuid(sale.prescription?.uuid ?? "");
    setResumedSaleUuid(sale.uuid);
    setResumedSaleNumber(sale.saleNumber);
    setHeldModalOpen(false);
    setMobileTab("cart");
    toast.success(<LiveToastMessage getMessage={(t) => t.posHeldSalesResumeSuccess} />);
  }

  function handleCancelHeld(sale: Sale): void {
    setCancellingUuid(sale.uuid);
    cancelHeldMutation.mutate(sale.uuid);
  }

  function openPaymentModal(): void {
    if (cart.length === 0) return;
    const overstock = cart.filter((item) => item.quantityPieces > item.availablePieces);
    if (overstock.length > 0) {
      toast.error(
        `${t.posStockExceededItems} ${overstock.map((i) => i.medicineName).join(", ")}`,
        { description: t.posStockInsufficient }
      );
      return;
    }
    const hasRxItems = cart.some((item) => item.requiresPrescription);
    if ((hasRxItems || !!prescriptionUuid) && !customerUuid) {
      setMobileTab("cart");
      toast.error(<LiveToastMessage getMessage={(t) => t.posRxNoPatientWarning} />);
      return;
    }
    if (hasRxItems && !prescriptionUuid) {
      setMobileTab("cart");
      toast.error(<LiveToastMessage getMessage={(t) => t.posRxNoPrescriptionWarning} />);
      return;
    }
    setPaymentModalOpen(true);
  }

  function handleHold(): void {
    if (cart.length === 0 || holdMutation.isPending) return;
    holdMutation.mutate(resumedSaleUuid);
  }

  function handlePrescriptionCreated(uuid: string): void {
    setPrescriptionUuid(uuid);
    queryClient.invalidateQueries({ queryKey: ["prescriptions-queue"] });
    setPrescriptionModalOpen(false);
  }

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  // F2 search · F8 hold · F9 pay. Disabled while any dialog is open.
  const shortcutsRef = useRef({ openPaymentModal, handleHold });
  shortcutsRef.current = { openPaymentModal, handleHold };
  useEffect(() => {
    if (anyModalOpen) return;
    function onKey(e: KeyboardEvent): void {
      if (e.key === "F2") {
        e.preventDefault();
        setMobileTab("products");
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === "F8") {
        e.preventDefault();
        shortcutsRef.current.handleHold();
      } else if (e.key === "F9") {
        e.preventDefault();
        shortcutsRef.current.openPaymentModal();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [anyModalOpen]);

  const rxCartItems = cart.filter((item) => item.requiresPrescription);
  const cartCount = cart.reduce((n, i) => n + i.quantityPieces, 0);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3 lg:h-[calc(100vh-7rem)] lg:gap-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 ref={pageTitleRef} className="text-2xl font-bold tracking-tight text-foreground">
            {t.navPOS}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{t.posSubtitle}</p>
        </div>
        <div className="hidden items-center gap-3 text-xs text-muted-foreground lg:flex" aria-label={t.posShortcutsTitle}>
          <span className="flex items-center gap-1">
            <ScanBarcode className="h-3.5 w-3.5" aria-hidden /> {t.posScannerReady}
          </span>
          <span><kbd className="rounded border border-border bg-muted px-1">F2</kbd> {t.posShortcutSearch}</span>
          <span><kbd className="rounded border border-border bg-muted px-1">F8</kbd> {t.posShortcutHold}</span>
          <span><kbd className="rounded border border-border bg-muted px-1">F9</kbd> {t.posShortcutPay}</span>
        </div>
      </div>

      {/* Mobile / tablet: tabs */}
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1 lg:hidden" role="tablist">
        {(["products", "cart"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={mobileTab === tab}
            onClick={() => setMobileTab(tab)}
            className={cn(
              "rounded-lg py-2 text-sm font-medium transition-colors",
              mobileTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            {tab === "products" ? t.posTabProducts : `${t.posTabCart} (${cartCount})`}
          </button>
        ))}
      </div>

      <Card className="flex min-h-[70vh] flex-1 overflow-hidden lg:grid lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,30rem)] xl:grid-cols-[minmax(0,1fr)_minmax(26rem,34rem)]">
        <div
          className={cn(
            "h-auto min-h-0 w-full overflow-hidden lg:h-full lg:border-r lg:border-border",
            mobileTab === "products" ? "flex flex-col" : "hidden lg:flex lg:flex-col"
          )}
        >
          <PosProductGrid
            t={t}
            onScanClick={() => setScannerOpen(true)}
            onAddToCart={(d) => {
              handleAddToCart(d);
            }}
            onSearchEnter={handleSearchEnter}
            searchInputRef={searchInputRef}
          />
        </div>

        <div className={cn("min-h-0 w-full", mobileTab === "cart" ? "flex flex-col" : "hidden lg:flex lg:flex-col")}>
          <PosCartPanel
            t={t}
            cart={cart}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItem}
            onPriceChange={handlePriceChange}
            canEditPrice={canOverridePrice}
            customerUuid={customerUuid}
            onCustomerChange={setCustomerUuid}
            customerOptions={customerOptions}
            onOpenHistory={can("sales.read") ? () => setHistoryOpen(true) : undefined}
            prescriptionUuid={prescriptionUuid}
            onPrescriptionChange={setPrescriptionUuid}
            prescriptionOptions={prescriptionOptions}
            onAddPrescription={() => {
              if (!customerUuid) {
                toast.error(<LiveToastMessage getMessage={(t) => t.posCreatePrescriptionRequiresPatient} />);
                return;
              }
              setPrescriptionModalOpen(true);
            }}
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
        </div>
      </Card>

      {heldModalOpen && (
        <PosHeldSalesModal
          t={t}
          open={heldModalOpen}
          cartHasItems={cart.length > 0}
          cancellingUuid={cancellingUuid}
          onContinue={handleContinue}
          onCancelHeld={can("sales.update") ? handleCancelHeld : undefined}
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
          ppnPercentage={ppnPercentage}
          maxDiscountPercentage={maxDiscountPercentage}
          canOverrideDiscount={canOverridePrice}
          customerUuid={customerUuid}
          customerLabel={customerOptions.find((c) => c.value === customerUuid)?.label ?? t.posWalkInPatient}
          isSubmitting={checkoutMutation.isPending}
          onCancel={() => setPaymentModalOpen(false)}
          onConfirm={(result) => checkoutMutation.mutate(result)}
        />
      )}

      {prescriptionModalOpen && customerUuid && (
        <PosPrescriptionModal
          patientUuid={customerUuid}
          patientName={customerOptions.find((c) => c.value === customerUuid)?.label ?? ""}
          rxItems={rxCartItems}
          onClose={() => setPrescriptionModalOpen(false)}
          onSuccess={handlePrescriptionCreated}
        />
      )}

      <Sheet open={historyOpen && !!customerUuid} onOpenChange={setHistoryOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border px-5 py-4 text-left">
            <SheetTitle>{t.purchaseHistoryTitle}</SheetTitle>
            <p className="truncate text-sm text-muted-foreground">
              {customerOptions.find((c) => c.value === customerUuid)?.label}
            </p>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            {customerUuid && <PurchaseHistory customerUuid={customerUuid} onBuyAgain={handleBuyAgain} />}
          </div>
        </SheetContent>
      </Sheet>

      {completedSale && (
        <SaleSuccessModal sale={completedSale} amountReceived={paidAmount} t={t} onNewSale={resetSale} />
      )}
    </div>
  );
}
