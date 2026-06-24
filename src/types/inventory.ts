export type ExpiryStatus = "OK" | "EXPIRING_SOON" | "EXPIRED";
export type CabinetRotation = 0 | 90 | 180 | 270;

// ── Tree nodes (from GET /inventory/tree) ─────────────────────────────────────

export interface InventoryBinNode {
  uuid: string;
  name: string;
  code: string;
  status: string;
  itemCount: number;
}

export interface InventoryShelfNode {
  uuid: string;
  name: string;
  code: string;
  level: number | null;
  status: string;
  bins: InventoryBinNode[];
}

export interface InventoryCabinetNode {
  uuid: string;
  name: string;
  code: string;
  status: string;
  posX: number | null;
  posY: number | null;
  width: number | null;
  height: number | null;
  rotation: CabinetRotation | null;
  shelves: InventoryShelfNode[];
}

// ── Bin items (from GET /inventory/bins/:uuid/items) ──────────────────────────

export interface InventoryBinItemMedicine {
  uuid: string;
  name: string;
  unit: string;
}

export interface InventoryBinItemDistributor {
  uuid: string;
  name: string;
}

export interface InventoryBinItem {
  uuid: string;
  batchNumber: string;
  barcode: string;
  expiryDate: string;
  expiryStatus: ExpiryStatus;
  quantityPieces: number;
  remainingPieces: number;
  quantityBox: number;
  quantityPerBox: number;
  medicine: InventoryBinItemMedicine;
  distributor: InventoryBinItemDistributor;
}

// ── Canvas local state ────────────────────────────────────────────────────────

export interface CanvasPosition {
  posX: number;
  posY: number;
  width: number;
  height: number;
  rotation: CabinetRotation;
}

// ── API payloads ──────────────────────────────────────────────────────────────

export interface UpdateCabinetPositionPayload {
  posX: number;
  posY: number;
  width?: number;
  height?: number;
  rotation?: CabinetRotation;
}
