import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Search, ScanBarcode, Loader2, PackageSearch } from "lucide-react";

import { cn } from "@/utils/cn";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/store";
import type { Translations } from "@/configs/i18n";
import type { StockDetailSearchResult } from "@/types/stock";
import { getStockCatalog, getStockDetails } from "@/service/stockService";
import { getMedicineTypesDropdown } from "@/service/medicineTypeService";
import { formatCurrency } from "./salesUtils";

const LOW_STOCK_THRESHOLD = 10;
const PAGE_LIMIT = 20;

export interface PosProductGridProps {
  t: Translations;
  onScanClick: () => void;
  onAddToCart: (detail: StockDetailSearchResult) => void;
}

export function PosProductGrid({
  t,
  onScanClick,
  onAddToCart,
}: PosProductGridProps): JSX.Element {
  const sidebarCollapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const isSearching = debouncedSearch.trim().length > 0;
  const [categoryUuid, setCategoryUuid] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [catalogResults, setCatalogResults] = useState<StockDetailSearchResult[]>([]);

  useEffect(() => {
    setPage(1);
  }, [categoryUuid]);

  const { data: typesData } = useQuery({
    queryKey: ["medicine-types-dropdown"],
    queryFn: () => getMedicineTypesDropdown(),
    staleTime: 5 * 60 * 1000,
  });

  const medicineTypes = useMemo(() => typesData?.data ?? [], [typesData]);

  // Default browsing view (no search term): paginated catalog, filterable
  // by category, server-curated (top sellers per the backend's ordering).
  const catalogQuery = useQuery({
    queryKey: ["stock-catalog", categoryUuid, page],
    queryFn: () =>
      getStockCatalog({
        medicineTypeUuid: categoryUuid !== "all" ? categoryUuid : undefined,
        page,
        limit: PAGE_LIMIT,
      }),
    enabled: !isSearching,
  });

  useEffect(() => {
    if (isSearching || !catalogQuery.data?.data) return;
    const pageData = catalogQuery.data.data;
    if (page === 1) {
      setCatalogResults(pageData);
      return;
    }
    // Merge instead of blindly appending — a stock-changing event (e.g. a
    // completed sale) invalidates this query and refetches the same page,
    // which should refresh already-loaded cards in place, not duplicate them.
    setCatalogResults((prev) => {
      const merged = [...prev];
      for (const item of pageData) {
        const existingIndex = merged.findIndex((p) => p.uuid === item.uuid);
        if (existingIndex >= 0) {
          merged[existingIndex] = item;
        } else {
          merged.push(item);
        }
      }
      return merged;
    });
  }, [catalogQuery.data, page, isSearching]);

  // Search view: full unpaginated lookup across all stock, regardless of
  // category, so search results are as complete as possible.
  const detailsQuery = useQuery({
    queryKey: ["stock-details-search", debouncedSearch],
    queryFn: () => getStockDetails({ search: debouncedSearch }),
    enabled: isSearching,
  });

  const results = isSearching ? detailsQuery.data?.data ?? [] : catalogResults;
  const isLoading = isSearching ? detailsQuery.isLoading : catalogQuery.isLoading;
  const isFetching = isSearching ? detailsQuery.isFetching : catalogQuery.isFetching;
  const totalPages = catalogQuery.data?.meta?.totalPages ?? 1;
  const total = isSearching ? results.length : catalogQuery.data?.meta?.total ?? catalogResults.length;
  const hasMore = !isSearching && page < totalPages;

  const requiredPrescriptionByType = useMemo(
    () => new Map(medicineTypes.map((mt) => [mt.name, mt.requiredPrescription])),
    [medicineTypes]
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Search */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-6 py-4">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.posSearchPlaceholder}
            className="rounded-xl pl-9"
            autoComplete="off"
          />
          {isFetching && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onScanClick}
          title={t.posScanBarcode}
          className="shrink-0 rounded-xl"
        >
          <ScanBarcode className="h-4 w-4" />
        </Button>
      </div>

      {/* Category tabs — not applicable while searching across all stock */}
      {!isSearching && (
        <div className="shrink-0 overflow-x-auto border-b border-border px-6 py-3">
          <div className="flex w-max gap-2">
            <button
              type="button"
              onClick={() => setCategoryUuid("all")}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                categoryUuid === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {t.posCategoryAll}
            </button>
            {medicineTypes.map((type) => (
              <button
                key={type.uuid}
                type="button"
                onClick={() => setCategoryUuid(type.uuid)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  categoryUuid === type.uuid
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {total} {t.posProductsCountLabel}
        </p>

        {isLoading ? (
          <div className={cn("grid grid-cols-2 gap-3", sidebarCollapsed ? "sm:grid-cols-4" : "sm:grid-cols-3")}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-muted/50" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-14 text-center">
            <PackageSearch className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{t.posNoProductsTitle}</p>
            <p className="text-xs text-muted-foreground/60">{t.posNoProductsDesc}</p>
          </div>
        ) : (
          <>
            <div className={cn("grid grid-cols-2 gap-3", sidebarCollapsed ? "sm:grid-cols-4" : "sm:grid-cols-3")}>
              {results.map((detail) => {
                const isOutOfStock = detail.quantityPieces <= 0;
                const isLowStock = detail.quantityPieces > 0 && detail.quantityPieces <= LOW_STOCK_THRESHOLD;
                const requiresPrescription = requiredPrescriptionByType.get(detail.medicine.type.name) ?? false;

                return (
                  <button
                    key={detail.uuid}
                    type="button"
                    onClick={() => onAddToCart(detail)}
                    disabled={isOutOfStock}
                    className="flex flex-col items-start gap-1.5 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="flex w-full items-start justify-between gap-1">
                      <p className="line-clamp-2 text-sm font-medium uppercase text-foreground">
                        {detail.medicine.name}
                      </p>
                      {requiresPrescription && (
                        <span className="shrink-0 rounded-md bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
                          Rx
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t.posBatchLabel}: <span className="uppercase">{detail.batchNumber}</span>
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(detail.stock.effectiveSellingPrice)}
                    </p>
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-xs font-medium",
                        isOutOfStock
                          ? "bg-destructive/10 text-destructive"
                          : isLowStock
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                            : "bg-success/10 text-success"
                      )}
                    >
                      {isOutOfStock
                        ? t.posOutOfStock
                        : `${isLowStock ? t.posStockRemainingLabel : t.posStockLabel} ${detail.quantityPieces}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {hasMore && (
              <div className="mt-4 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isFetching}
                  onClick={() => setPage((p) => p + 1)}
                  className="gap-2 rounded-xl"
                >
                  {isFetching && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {t.posLoadMore}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
