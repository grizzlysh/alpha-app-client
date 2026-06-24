import type { JSX, ReactNode } from "react";
import { ChevronRight, Warehouse, Layers, Box } from "lucide-react";
import { cn } from "@/utils/cn";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import type {
  InventoryCabinetNode,
  InventoryShelfNode,
  InventoryBinNode,
} from "@/types/inventory";

// ── Types ─────────────────────────────────────────────────────────────────────

type BreadcrumbLevel = "warehouse" | "cabinet" | "shelf";

interface ExplorerItemProps {
  name: string;
  code: string;
  badge: string;
  isSelected: boolean;
  isInactive: boolean;
  icon: ReactNode;
  onClick: () => void;
}

interface Props {
  cabinets: InventoryCabinetNode[];
  selectedCabinet: InventoryCabinetNode | null;
  selectedShelf: InventoryShelfNode | null;
  selectedBin: InventoryBinNode | null;
  onCabinetClick: (cabinet: InventoryCabinetNode) => void;
  onShelfClick: (shelf: InventoryShelfNode) => void;
  onBinClick: (bin: InventoryBinNode) => void;
  onBreadcrumb: (level: BreadcrumbLevel) => void;
}

// ── Explorer item row ─────────────────────────────────────────────────────────

function ExplorerItem({
  name,
  code,
  badge,
  isSelected,
  isInactive,
  icon,
  onClick,
}: ExplorerItemProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 border-b text-left transition-colors",
        "hover:bg-muted/50",
        isSelected && "bg-primary/10 border-l-2 border-l-primary",
        isInactive && "opacity-50"
      )}
    >
      <span className="text-muted-foreground flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-xs text-muted-foreground">{code}</p>
      </div>
      <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full flex-shrink-0">
        {badge}
      </span>
      <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
    </button>
  );
}

// ── Explorer ──────────────────────────────────────────────────────────────────

export function InventoryExplorer({
  cabinets,
  selectedCabinet,
  selectedShelf,
  selectedBin,
  onCabinetClick,
  onShelfClick,
  onBinClick,
  onBreadcrumb,
}: Props): JSX.Element {
  const { t } = useLanguage();

  const level: "warehouse" | "cabinet" | "shelf" = !selectedCabinet
    ? "warehouse"
    : !selectedShelf
      ? "cabinet"
      : "shelf";

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Breadcrumb strip */}
      <div className="px-3 py-2 border-b bg-muted/40 flex items-center gap-1 flex-wrap min-h-[36px]">
        <button
          onClick={() => onBreadcrumb("warehouse")}
          className={cn(
            "text-xs transition-colors hover:text-foreground",
            !selectedCabinet ? "text-foreground font-medium" : "text-muted-foreground"
          )}
        >
          {t.inventoryWarehouseLabel}
        </button>

        {selectedCabinet && (
          <>
            <ChevronRight size={12} className="text-muted-foreground flex-shrink-0" />
            <button
              onClick={() => onBreadcrumb("cabinet")}
              className={cn(
                "text-xs transition-colors hover:text-foreground max-w-[80px] truncate",
                !selectedShelf ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {selectedCabinet.name}
            </button>
          </>
        )}

        {selectedShelf && (
          <>
            <ChevronRight size={12} className="text-muted-foreground flex-shrink-0" />
            <button
              onClick={() => onBreadcrumb("shelf")}
              className={cn(
                "text-xs transition-colors hover:text-foreground max-w-[80px] truncate",
                !selectedBin ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {selectedShelf.name}
            </button>
          </>
        )}

        {selectedBin && (
          <>
            <ChevronRight size={12} className="text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-foreground font-medium max-w-[80px] truncate">
              {selectedBin.name}
            </span>
          </>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {level === "warehouse" &&
          (cabinets.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center p-4">
              {t.inventoryNoCabinets}
            </p>
          ) : (
            cabinets.map((cabinet) => (
              <ExplorerItem
                key={cabinet.uuid}
                name={cabinet.name}
                code={cabinet.code}
                badge={`${cabinet.shelves.length} ${t.inventoryShelvesLabel}`}
                isSelected={selectedCabinet?.uuid === cabinet.uuid}
                isInactive={cabinet.status === "INACTIVE"}
                icon={<Warehouse size={14} />}
                onClick={() => onCabinetClick(cabinet)}
              />
            ))
          ))}

        {level === "cabinet" &&
          selectedCabinet &&
          (selectedCabinet.shelves.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center p-4">
              {t.inventoryNoShelves}
            </p>
          ) : (
            selectedCabinet.shelves.map((shelf) => (
              <ExplorerItem
                key={shelf.uuid}
                name={shelf.name}
                code={shelf.code}
                badge={`${shelf.bins.length} ${t.inventoryBinsLabel}`}
                isSelected={selectedShelf?.uuid === shelf.uuid}
                isInactive={shelf.status === "INACTIVE"}
                icon={<Layers size={14} />}
                onClick={() => onShelfClick(shelf)}
              />
            ))
          ))}

        {level === "shelf" &&
          selectedShelf &&
          (selectedShelf.bins.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center p-4">
              {t.inventoryNoBins}
            </p>
          ) : (
            selectedShelf.bins.map((bin) => (
              <ExplorerItem
                key={bin.uuid}
                name={bin.name}
                code={bin.code}
                badge={`${bin.itemCount} ${t.inventoryItemCount}`}
                isSelected={selectedBin?.uuid === bin.uuid}
                isInactive={bin.status === "INACTIVE"}
                icon={<Box size={14} />}
                onClick={() => onBinClick(bin)}
              />
            ))
          ))}
      </div>
    </Card>
  );
}
