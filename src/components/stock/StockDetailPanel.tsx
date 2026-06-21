import { useState, Fragment, type JSX } from "react";
import {
  Package,
  Tag,
  Truck,
  PencilRuler,
  AlertTriangle,
  Pencil,
  Trash2,
  Undo2,
} from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import type { Translations } from "@/configs/i18n";
import type { Stock, StockDetail } from "@/types/stock";
import {
  getInitials,
  getAvatarColor,
  formatDate,
  formatRupiah,
  getStockStatusClass,
  getStockStatusKey,
  daysUntilExpiry,
} from "./stockUtils";
import { DetailModal, InfoPair, DetailDatesCard } from "@/components/shared/DetailModal";

// ── Batch table ───────────────────────────────────────────────────────────────

interface BatchTableProps {
  details: StockDetail[];
  unit: string;
  t: Translations;
  onAdjust: (detail: StockDetail) => void;
  onDispose: (detail: StockDetail) => void;
  onReturn: (detail: StockDetail) => void;
}

function BatchTable({
  details,
  unit,
  t,
  onAdjust,
  onDispose,
  onReturn,
}: BatchTableProps): JSX.Element {
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

  const toggle = (uuid: string): void =>
    setSelectedUuid((prev) => (prev === uuid ? null : uuid));

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Truck className="h-4 w-4 text-muted-foreground" />
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t.stockBatchSection}
        </p>
      </div>

      {/* Empty state */}
      {details.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-muted-foreground">
          <Truck className="h-8 w-8 opacity-30" />
          <p className="text-sm">—</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <table className="w-full table-fixed text-sm">
            <thead className="sticky top-0 z-10 bg-muted/60 backdrop-blur">
              <tr className="border-b border-border">
                <th className="w-[38%] px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t.stockBatchNumber}
                </th>
                <th className="w-[18%] px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Qty
                </th>
                <th className="w-[22%] px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t.stockExpiryDate}
                </th>
                <th className="w-[22%] px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t.stockDistributor}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {details.map((detail) => {
                const days = daysUntilExpiry(detail.expiryDate);
                const isExpiringSoon = days <= 90;
                const isExpired = days < 0;
                const isSelected = selectedUuid === detail.uuid;

                return (
                  <Fragment key={detail.uuid}>
                    <tr
                      onClick={() => toggle(detail.uuid)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isSelected ? "bg-primary/5" : "hover:bg-muted/40"
                      )}
                    >
                      {/* Batch No */}
                      <td className="overflow-hidden px-5 py-3">
                        <p className="truncate font-mono text-xs font-medium uppercase text-foreground">
                          {detail.batchNumber}
                        </p>
                      </td>

                      {/* Qty */}
                      <td className="px-3 py-3 text-right tabular-nums text-foreground">
                        {detail.quantityPieces.toLocaleString("id-ID")}{" "}
                        <span className="text-muted-foreground">{unit}</span>
                      </td>

                      {/* Expires */}
                      <td className="overflow-hidden px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              isExpired
                                ? "text-destructive"
                                : isExpiringSoon
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-foreground"
                            )}
                          >
                            {formatDate(detail.expiryDate)}
                          </span>
                          {(isExpiringSoon || isExpired) && (
                            <AlertTriangle
                              className={cn(
                                "h-3 w-3 flex-shrink-0",
                                isExpired ? "text-destructive" : "text-amber-500"
                              )}
                            />
                          )}
                        </div>
                      </td>

                      {/* Distributor */}
                      <td className="overflow-hidden px-5 py-3">
                        <p className="truncate uppercase text-muted-foreground" title={detail.distributor.name}>
                          {detail.distributor.name}
                        </p>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isSelected && (
                      <tr className="bg-primary/5">
                        <td colSpan={4} className="px-5 pb-3 pt-0">
                          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/20 bg-background px-4 py-3">
                            <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs">
                              <div>
                                <span className="text-muted-foreground">
                                  {t.stockQtyBox}:{" "}
                                </span>
                                <span className="font-medium text-foreground">
                                  {detail.quantityBox} Box × {detail.quantityPerBox} {unit}/Box
                                </span>
                              </div>
                              {detail.barcode && (
                                <div>
                                  <span className="text-muted-foreground">
                                    {t.stockBarcode}:{" "}
                                  </span>
                                  <span className="font-mono font-medium text-foreground">
                                    {detail.barcode}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAdjust(detail);
                                }}
                              >
                                <PencilRuler className="h-3.5 w-3.5" />
                                {t.stockAdjust}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-destructive hover:border-destructive/60 hover:bg-destructive/10 hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDispose(detail);
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                {t.stockDispose}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onReturn(detail);
                                }}
                              >
                                <Undo2 className="h-3.5 w-3.5" />
                                {t.stockReturn}
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────────

export interface StockDetailPanelProps {
  stock: Stock;
  t: Translations;
  onClose: () => void;
  onSetPrice: () => void;
  onSetReorder: () => void;
  onAdjust: (detail: StockDetail) => void;
  onDispose: (detail: StockDetail) => void;
  onReturn: (detail: StockDetail) => void;
}

export function StockDetailPanel({
  stock,
  t,
  onClose,
  onSetPrice,
  onSetReorder,
  onAdjust,
  onDispose,
  onReturn,
}: StockDetailPanelProps): JSX.Element {
  const statusClass = getStockStatusClass(stock);
  const statusLabel = t[getStockStatusKey(stock)];

  return (
    <DetailModal
      icon={<Package className="h-4 w-4 text-primary" />}
      title={t.stockDetailsTitle}
      onClose={onClose}
      className="max-w-5xl sm:max-w-5xl"
      bodyClassName="flex flex-1 flex-row overflow-hidden"
    >
      {/* Left: batch table */}
      <BatchTable
        details={stock.details}
        unit={stock.medicine.unit}
        t={t}
        onAdjust={onAdjust}
        onDispose={onDispose}
        onReturn={onReturn}
      />

      {/* Divider */}
      <div className="w-px flex-shrink-0 bg-border" />

      {/* Right: medicine info */}
      <div className="flex w-96 flex-shrink-0 flex-col">
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Hero */}
          <div className="flex items-center gap-4 px-5 py-6">
            <div
              className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${getAvatarColor(stock.medicine.name)}`}
            >
              {getInitials(stock.medicine.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold uppercase text-foreground">
                {stock.medicine.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {stock.medicine.shape.name} · {stock.medicine.type.name}
              </p>
              <span
                className={cn(
                  "mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold",
                  statusClass
                )}
              >
                {statusLabel}
              </span>
            </div>
          </div>

          <div className="mx-5 border-t border-border" />

          {/* Stock info */}
          <div className="divide-y divide-border px-5">
            <InfoPair
              label={t.stockTotalPieces}
              value={`${stock.totalPieces.toLocaleString("id-ID")} ${stock.medicine.unit}`}
            />
            <InfoPair
              label={t.stockReorderLevel}
              value={`${stock.reorderLevel.toLocaleString("id-ID")} ${stock.medicine.unit}`}
            />
          </div>

          {/* Pricing */}
          <div className="px-5 py-4">
            <p className="mb-2 text-sm text-muted-foreground">{t.stockEffectivePrice}</p>
            <p className="text-sm font-semibold text-foreground">
              {formatRupiah(stock.effectiveSellingPrice)}
            </p>
            {stock.isManualPrice && (
              <p className="mt-0.5 text-xs text-muted-foreground">{t.stockManualPriceNote}</p>
            )}
            <div className="mt-2 space-y-1 rounded-lg bg-muted/50 px-3 py-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t.stockBasePrice}</span>
                <span className="text-foreground">{formatRupiah(stock.basePrice)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t.stockCalculatedPrice}</span>
                <span className="text-foreground">{formatRupiah(stock.calculatedPrice)}</span>
              </div>
            </div>
          </div>

          {/* Last updated */}
          <DetailDatesCard
            className="mt-auto"
            rows={[
              { label: t.created, value: formatDate(stock.createdAt) },
              { label: t.lastUpdated, value: formatDate(stock.updatedAt) },
            ]}
          />
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-border p-5">
          <Button
            variant="outline"
            className="flex-1 gap-2 rounded-xl"
            onClick={onSetPrice}
          >
            <Tag className="h-4 w-4" />
            {t.stockUpdatePrice}
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2 rounded-xl"
            onClick={onSetReorder}
          >
            <Pencil className="h-4 w-4" />
            {t.stockUpdateReorder}
          </Button>
        </div>
      </div>
    </DetailModal>
  );
}
