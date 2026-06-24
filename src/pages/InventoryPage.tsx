import type { JSX } from "react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Warehouse } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollAwareTitle } from "@/hooks/useScrollAwareTitle";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { InventoryCanvas, buildDefaultPositions } from "@/components/inventory/InventoryCanvas";
import { InventoryExplorer } from "@/components/inventory/InventoryExplorer";
import { InventoryBinItems } from "@/components/inventory/InventoryBinItems";
import { getInventoryTree, getBinItems, updateCabinetPosition } from "@/service/inventoryService";
import type {
  InventoryCabinetNode,
  InventoryShelfNode,
  InventoryBinNode,
  CanvasPosition,
  CabinetRotation,
} from "@/types/inventory";

export default function InventoryPage(): JSX.Element {
  const { t } = useLanguage();
  const pageTitleRef = useScrollAwareTitle();
  const queryClient = useQueryClient();

  // ── Tree data ───────────────────────────────────────────────────────────────
  const { data: treeData, isLoading: treeLoading } = useQuery({
    queryKey: ["inventory-tree"],
    queryFn: getInventoryTree,
  });
  const cabinets = treeData?.data ?? [];

  // ── Canvas positions — incremental: add any cabinet not yet placed ──────────
  const [localPositions, setLocalPositions] = useState<Record<string, CanvasPosition>>({});

  useEffect(() => {
    if (cabinets.length === 0) return;
    setLocalPositions((prev) => {
      const missing = cabinets.filter((c) => !(c.uuid in prev));
      if (missing.length === 0) return prev;
      return { ...prev, ...buildDefaultPositions(missing, t.inventoryShelvesLabel, prev) };
    });
  // t.inventoryShelvesLabel is stable per language — safe dep
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cabinets, t.inventoryShelvesLabel]);

  // ── Explorer selection ──────────────────────────────────────────────────────
  const [selectedCabinet, setSelectedCabinet] = useState<InventoryCabinetNode | null>(null);
  const [selectedShelf, setSelectedShelf] = useState<InventoryShelfNode | null>(null);
  const [selectedBin, setSelectedBin] = useState<InventoryBinNode | null>(null);

  // ── Bin items ───────────────────────────────────────────────────────────────
  const { data: binItemsData, isLoading: binItemsLoading } = useQuery({
    queryKey: ["inventory-bin-items", selectedBin?.uuid],
    queryFn: () => getBinItems(selectedBin!.uuid),
    enabled: !!selectedBin,
  });
  const binItems = binItemsData?.data ?? [];

  // ── Position mutation ───────────────────────────────────────────────────────
  const positionMutation = useMutation({
    mutationFn: ({
      cabinetUuid,
      payload,
    }: {
      cabinetUuid: string;
      payload: Parameters<typeof updateCabinetPosition>[1];
    }) => updateCabinetPosition(cabinetUuid, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-tree"] });
      toast.success(<LiveToastMessage getMessage={(t) => t.inventoryCanvasSaveSuccess} />);
    },
  });

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handleCabinetSelect(cabinet: InventoryCabinetNode): void {
    setSelectedCabinet(cabinet);
    setSelectedShelf(null);
    setSelectedBin(null);
  }

  function handleShelfSelect(shelf: InventoryShelfNode): void {
    setSelectedShelf(shelf);
    setSelectedBin(null);
  }

  function handleBinSelect(bin: InventoryBinNode): void {
    setSelectedBin(bin);
  }

  function handleBreadcrumb(level: "warehouse" | "cabinet" | "shelf"): void {
    if (level === "warehouse") {
      setSelectedCabinet(null);
      setSelectedShelf(null);
      setSelectedBin(null);
    } else if (level === "cabinet") {
      setSelectedShelf(null);
      setSelectedBin(null);
    } else {
      setSelectedBin(null);
    }
  }

  function handlePositionChange(
    cabinetUuid: string,
    pos: { posX: number; posY: number }
  ): void {
    setLocalPositions((prev) => ({
      ...prev,
      [cabinetUuid]: { ...prev[cabinetUuid], ...pos },
    }));
    positionMutation.mutate({
      cabinetUuid,
      payload: { posX: pos.posX, posY: pos.posY },
    });
  }

  function handleRotate(
    cabinetUuid: string,
    rotation: CabinetRotation,
    pos: { posX: number; posY: number }
  ): void {
    setLocalPositions((prev) => ({
      ...prev,
      [cabinetUuid]: { ...prev[cabinetUuid], rotation, posX: pos.posX, posY: pos.posY },
    }));
    positionMutation.mutate({
      cabinetUuid,
      payload: { posX: pos.posX, posY: pos.posY, rotation },
    });
  }

  function handleSizeChange(cabinetUuid: string, width: number, height: number): void {
    const pos = localPositions[cabinetUuid];
    if (!pos) return;
    setLocalPositions((prev) => ({
      ...prev,
      [cabinetUuid]: { ...prev[cabinetUuid], width, height },
    }));
    positionMutation.mutate({
      cabinetUuid,
      payload: { posX: pos.posX, posY: pos.posY, width, height },
    });
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 p-6 h-full">
      {/* Page title */}
      <div ref={pageTitleRef}>
        <h1 className="text-2xl font-semibold tracking-tight">{t.navInventory}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t.inventorySubtitle}</p>
      </div>

      {/* Canvas section */}
      <Card className="overflow-hidden flex-shrink-0">
        <div className="px-4 py-2.5 border-b flex items-center gap-2">
          <Warehouse className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{t.inventoryCanvasTitle}</span>
        </div>
        <InventoryCanvas
          cabinets={cabinets}
          localPositions={localPositions}
          selectedCabinetUuid={selectedCabinet?.uuid ?? null}
          isLoading={treeLoading}
          onCabinetClick={handleCabinetSelect}
          onPositionChange={handlePositionChange}
          onRotate={handleRotate}
          onSizeChange={handleSizeChange}
        />
      </Card>

      {/* Bottom split: explorer + bin items */}
      <div className="flex gap-4 flex-1 min-h-[380px]">
        {/* Left — hierarchical explorer */}
        <div className="w-[320px] flex-shrink-0">
          <InventoryExplorer
            cabinets={cabinets}
            selectedCabinet={selectedCabinet}
            selectedShelf={selectedShelf}
            selectedBin={selectedBin}
            onCabinetClick={handleCabinetSelect}
            onShelfClick={handleShelfSelect}
            onBinClick={handleBinSelect}
            onBreadcrumb={handleBreadcrumb}
          />
        </div>

        {/* Right — bin item cards */}
        <div className="flex-1 min-w-0">
          <InventoryBinItems
            binItems={binItems}
            isLoading={binItemsLoading}
            selectedBin={selectedBin}
          />
        </div>
      </div>
    </div>
  );
}
