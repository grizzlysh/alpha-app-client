import type { JSX } from "react";
import { MoreVertical, Eye, Tag, ListOrdered } from "lucide-react";

import { cn } from "@/utils/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Translations } from "@/configs/i18n";
import type { Stock } from "@/types/stock";
import {
  getInitials,
  getAvatarColor,
  formatDate,
  formatRupiah,
  getStockStatusClass,
  getStockStatusKey,
} from "./stockUtils";

export interface StockRowProps {
  stock: Stock;
  t: Translations;
  onDetails: () => void;
  onSetPrice: () => void;
  onSetReorder: () => void;
}

export function StockRow({
  stock,
  t,
  onDetails,
  onSetPrice,
  onSetReorder,
}: StockRowProps): JSX.Element {
  const statusClass = getStockStatusClass(stock);
  const statusLabel = t[getStockStatusKey(stock)];

  return (
    <tr className="group transition-colors hover:bg-accent/40">
      {/* Sticky left: avatar + medicine name */}
      <td className="md:sticky md:left-0 z-[1] min-w-[240px] border-r border-border/40 bg-card px-5 py-4 transition-colors group-hover:bg-accent">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold",
              getAvatarColor(stock.medicine.name)
            )}
          >
            {getInitials(stock.medicine.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium uppercase text-foreground">
              {stock.medicine.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {stock.medicine.shape.name} · {stock.medicine.medicineClass.name}
            </p>
          </div>
        </div>
      </td>

      {/* Total pieces + status badge — always visible */}
      <td className="min-w-[130px] px-5 py-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">
            {stock.totalPieces.toLocaleString("id-ID")} {stock.medicine.unit}
          </span>
          <span
            className={cn(
              "inline-block w-fit rounded-full px-2 py-0.5 text-xs font-semibold",
              statusClass
            )}
          >
            {statusLabel}
          </span>
        </div>
      </td>

      {/* Type — md+ */}
      <td className="hidden min-w-[120px] px-5 py-4 md:table-cell">
        <span className="text-sm text-foreground">{stock.medicine.type.name}</span>
      </td>

      {/* Reorder level — sm+ */}
      <td className="hidden min-w-[110px] px-5 py-4 sm:table-cell">
        <span className="text-sm text-foreground">
          {stock.reorderLevel.toLocaleString("id-ID")} {stock.medicine.unit}
        </span>
      </td>

      {/* Effective price — lg+ */}
      <td className="hidden min-w-[140px] px-5 py-4 lg:table-cell">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">
            {formatRupiah(stock.effectiveSellingPrice)}
          </span>
          {stock.isManualPrice && (
            <span className="text-xs text-muted-foreground">{t.stockManualPriceNote}</span>
          )}
        </div>
      </td>

      {/* Updated — xl+ */}
      <td className="hidden min-w-[140px] px-5 py-4 xl:table-cell">
        <span className="text-sm text-muted-foreground">
          {formatDate(stock.updatedAt)}
        </span>
      </td>

      {/* Sticky right: action menu */}
      <td className="md:sticky md:right-0 z-[1] w-14 border-l border-border/40 bg-card px-3 py-4 transition-colors group-hover:bg-accent">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-xl">
            <DropdownMenuItem onClick={onDetails} className="gap-2.5 rounded-lg">
              <Eye className="h-4 w-4 text-muted-foreground" />
              {t.stockDetails}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSetPrice} className="gap-2.5 rounded-lg">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {t.stockUpdatePrice}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSetReorder} className="gap-2.5 rounded-lg">
              <ListOrdered className="h-4 w-4 text-muted-foreground" />
              {t.stockUpdateReorder}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
