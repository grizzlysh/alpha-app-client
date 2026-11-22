import type { JSX } from "react";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Boxes, ClipboardList, Loader2, ScanBarcode, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/shared/SearchInput";
import { boxCount } from "@/components/stock/barcodeLabels";
import { useLanguage } from "@/hooks/useLanguage";
import { getStocks } from "@/service/stockService";
import type { Stock, StockDetail } from "@/types/stock";
import type { NewQueueItem } from "./labelQueue";

const RESULT_LIMIT = 8;

export interface LabelSearchPanelProps {
  onAdd: (item: NewQueueItem) => void;
  /** Enter in the search box: look the text up as a barcode. */
  onScan: (code: string) => void;
  isScanning: boolean;
  onOpenStockCard: (stock: Stock) => void;
}

const monthYear = (iso: string): string => {
  const d = new Date(iso);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

/** Find medicines in stock and add their batch, item or medicine labels to the queue. */
export function LabelSearchPanel({ onAdd, onScan, isScanning, onOpenStockCard }: LabelSearchPanelProps): JSX.Element {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [debounced] = useDebounce(search.trim(), 300);

  const { data, isFetching } = useQuery({
    queryKey: ["stock-label-search", debounced],
    queryFn: () => getStocks({ search: debounced, limit: RESULT_LIMIT, sortBy: "name" }),
    enabled: debounced.length > 0,
    placeholderData: keepPreviousData,
  });
  const results = debounced ? (data?.data ?? []) : [];

  const base = (stock: Stock, detail: StockDetail): Omit<NewQueueItem, "kind" | "copies"> => ({
    stockDetailUuid: detail.uuid,
    medicineUuid: stock.medicine.uuid,
    medicineName: stock.medicine.name,
    batchNumber: detail.batchNumber,
  });

  return (
    <Card className="flex min-w-0 flex-col gap-4 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (search.trim()) onScan(search.trim());
        }}
        className="flex items-center gap-2"
      >
        <SearchInput value={search} onChange={setSearch} placeholder={t.stockLabelsSearch} isFetching={isFetching || isScanning} />
      </form>

      {!debounced ? (
        <p className="py-10 text-center text-sm text-muted-foreground">{t.stockLabelsSearchHint}</p>
      ) : isFetching && results.length === 0 ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : results.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">{t.stockLabelsNoResults}</p>
      ) : (
        <ul className="space-y-3">
          {results.map((stock) => {
            const batches = stock.details.filter((d) => d.quantityPieces > 0);
            const unit = stock.medicine.unit.toLowerCase();
            return (
              <li key={stock.uuid} className="rounded-xl border border-border">
                <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2.5">
                  <div className="w-full min-w-0 sm:w-auto sm:flex-1">
                    <p className="truncate text-sm font-semibold name-case text-foreground">{stock.medicine.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.labelTotalStock} {stock.totalPieces.toLocaleString("id-ID")} {unit}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    disabled={batches.length === 0}
                    onClick={() =>
                      batches[0] && onAdd({ ...base(stock, batches[0]), kind: "medicine-label", batchNumber: null, copies: 1 })
                    }
                  >
                    <Tag className="h-3.5 w-3.5" />
                    {t.printMedicineLabel}
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => onOpenStockCard(stock)}>
                    <ClipboardList className="h-3.5 w-3.5" />
                    {t.printStockCard}
                  </Button>
                </div>
                {batches.length === 0 ? (
                  <p className="px-3 py-2.5 text-xs text-muted-foreground">{t.stockLabelsNoBatches}</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {batches.map((d) => (
                      <li key={d.uuid} className="flex flex-wrap items-center gap-2 px-3 py-2">
                        <div className="w-full min-w-0 text-xs sm:w-auto sm:flex-1">
                          <span className="font-mono font-medium text-foreground">{d.batchNumber.toUpperCase()}</span>
                          <span className="text-muted-foreground">
                            {" "}· {t.labelExpiry} {monthYear(d.expiryDate)} · {d.quantityPieces.toLocaleString("id-ID")} {unit}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1.5 px-2.5"
                          onClick={() => onAdd({ ...base(stock, d), kind: "batch-label", copies: 1 })}
                        >
                          <ScanBarcode className="h-3.5 w-3.5" />
                          {t.printBatchLabel}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1.5 px-2.5"
                          onClick={() =>
                            onAdd({ ...base(stock, d), kind: "item-label", copies: boxCount(d.quantityPieces, d.quantityPerBox) })
                          }
                        >
                          <Boxes className="h-3.5 w-3.5" />
                          {t.printItemLabel}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
