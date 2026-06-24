import type { RecordStatus } from "@/types/role";

// ── Cabinet ───────────────────────────────────────────────────────────────────

export interface StorageCabinet {
  uuid: string;
  name: string;
  code: string;
  description: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StorageCabinetDropdownItem {
  uuid: string;
  name: string;
  code: string;
}

export interface CabinetListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: RecordStatus;
  sortBy?: "name" | "code" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface CreateCabinetPayload {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateCabinetPayload {
  name?: string;
  code?: string;
  description?: string;
  status?: RecordStatus;
}

// ── Shelf ─────────────────────────────────────────────────────────────────────

export interface StorageShelf {
  uuid: string;
  name: string;
  code: string;
  level: number | null;
  description: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StorageShelfDropdownItem {
  uuid: string;
  name: string;
  code: string;
}

export interface ShelfListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: RecordStatus;
  sortBy?: "name" | "code" | "level" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface CreateShelfPayload {
  name: string;
  code: string;
  level?: number;
  description?: string;
}

export interface UpdateShelfPayload {
  name?: string;
  code?: string;
  level?: number;
  description?: string;
  status?: RecordStatus;
}

// ── Bin ───────────────────────────────────────────────────────────────────────

export interface StorageBin {
  uuid: string;
  name: string;
  code: string;
  description: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StorageBinDropdownItem {
  uuid: string;
  name: string;
  code: string;
}

export interface BinListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: RecordStatus;
  sortBy?: "name" | "code" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface CreateBinPayload {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateBinPayload {
  name?: string;
  code?: string;
  description?: string;
  status?: RecordStatus;
}

// ── Breadcrumb context ────────────────────────────────────────────────────────

export interface StorageCrumb {
  uuid: string;
  name: string;
  code: string;
}
