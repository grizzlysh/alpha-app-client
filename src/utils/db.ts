import Dexie, { type Table } from "dexie";

interface QueryCacheEntry {
  key: string;
  data: unknown;
  updatedAt: number;
}

export interface PendingMutation {
  id: string;
  endpoint: string;
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  payload: unknown;
  queryKeysToInvalidate: string[][];
  createdAt: number;
  retries: number;
  status: "pending" | "failed";
}

class PharmacyDB extends Dexie {
  queryCache!: Table<QueryCacheEntry, string>;
  pendingMutations!: Table<PendingMutation, string>;

  constructor() {
    super("pharmacare-offline");
    this.version(1).stores({
      queryCache: "key, updatedAt",
      pendingMutations: "id, createdAt, status",
    });
  }
}

export const db = new PharmacyDB();
