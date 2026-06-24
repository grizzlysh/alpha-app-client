import type { JSX } from "react";
import { Box, PackageOpen, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import type { InventoryBinItem, InventoryBinNode, ExpiryStatus } from "@/types/inventory";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BinItemCardProps {
  item: InventoryBinItem;
}

interface Props {
  binItems: InventoryBinItem[];
  isLoading: boolean;
  selectedBin: InventoryBinNode | null;
}

// ── Expiry badge config ───────────────────────────────────────────────────────

const EXPIRY_STYLES: Record<ExpiryStatus, string> = {
  OK: "bg-green-500/10 text-green-600 dark:text-green-400",
  EXPIRING_SOON: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  EXPIRED: "bg-red-500/10 text-red-600 dark:text-red-400",
};

// ── Bin item card ─────────────────────────────────────────────────────────────

function BinItemCard({ item }: BinItemCardProps): JSX.Element {
  const { t } = useLanguage();

  const expiryLabel: Record<ExpiryStatus, string> = {
    OK: t.inventoryExpiryOk,
    EXPIRING_SOON: t.inventoryExpirySoon,
    EXPIRED: t.inventoryExpired,
  };

  return (
    <div className="rounded-lg border bg-card p-3 flex flex-col gap-2">
      {/* Header: name + expiry badge */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-tight">{item.medicine.name}</p>
        <span
          className={cn(
            "text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap",
            EXPIRY_STYLES[item.expiryStatus]
          )}
        >
          {expiryLabel[item.expiryStatus]}
        </span>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <span className="text-muted-foreground">{t.inventoryBatchLabel}</span>
        <span className="font-medium truncate">{item.batchNumber}</span>

        <span className="text-muted-foreground">{t.inventoryExpiryLabel}</span>
        <span>{format(new Date(item.expiryDate), "dd MMM yyyy")}</span>

        <span className="text-muted-foreground">{t.inventoryRemainingLabel}</span>
        <span className="font-medium">
          {item.remainingPieces} {item.medicine.unit}
        </span>

        <span className="text-muted-foreground">{t.inventoryDistributorLabel}</span>
        <span className="truncate">{item.distributor.name}</span>
      </div>
    </div>
  );
}

// ── Bin items panel ───────────────────────────────────────────────────────────

export function InventoryBinItems({
  binItems,
  isLoading,
  selectedBin,
}: Props): JSX.Element {
  const { t } = useLanguage();

  if (!selectedBin) {
    return (
      <Card className="h-full flex flex-col items-center justify-center gap-3 text-center p-8">
        <Box className="h-10 w-10 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground max-w-[220px]">
          {t.inventorySelectBinPrompt}
        </p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  if (binItems.length === 0) {
    return (
      <Card className="h-full flex flex-col items-center justify-center gap-3 text-center p-8">
        <PackageOpen className="h-10 w-10 text-muted-foreground/30" />
        <p className="text-sm font-medium">{t.inventoryBinEmpty}</p>
        <p className="text-xs text-muted-foreground">
          {selectedBin.name} · {selectedBin.code}
        </p>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Panel header */}
      <div className="px-4 py-2.5 border-b flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Box className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{selectedBin.name}</span>
          <span className="text-xs text-muted-foreground">· {selectedBin.code}</span>
        </div>
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
          {binItems.length} {t.inventoryItemCount}
        </span>
      </div>

      {/* Scrollable grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {binItems.map((item) => (
            <BinItemCard key={item.uuid} item={item} />
          ))}
        </div>
      </div>
    </Card>
  );
}
