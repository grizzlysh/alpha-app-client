import type { QueryClient } from "@tanstack/react-query";
import { db } from "./db";

// Query key prefixes whose successful responses are persisted to IndexedDB.
// Keep this list to data that is safe and useful to serve offline.
// Deliberately excluded: dashboard KPIs, reports, invoices, paginated admin lists.
const PERSISTED_PREFIXES = new Set([
  "me",
  "medicines",
  "medicines-dropdown",
  "medicine-shapes-dropdown",
  "medicine-types-dropdown",
  "medicine-classes-dropdown",
  "customers",
  "customers-dropdown",
  "stocks",
  "stock-catalog",
  "stock-details-search",
  "distributors",
  "distributors-dropdown",
  "roles",
  "roles-ddl",
]);

function shouldPersist(queryKey: readonly unknown[]): boolean {
  const prefix = queryKey[0];
  return typeof prefix === "string" && PERSISTED_PREFIXES.has(prefix);
}

/**
 * Reads all persisted query entries from IndexedDB and populates the query
 * cache before the first render. Preserves the original updatedAt timestamp
 * so TanStack Query can correctly evaluate staleness.
 */
export async function hydrateQueryCache(queryClient: QueryClient): Promise<void> {
  const entries = await db.queryCache.toArray();
  for (const entry of entries) {
    try {
      const key = JSON.parse(entry.key) as unknown[];
      queryClient.setQueryData(key, entry.data, { updatedAt: entry.updatedAt });
    } catch {
      // malformed entry — skip silently
    }
  }
}

/**
 * Subscribes to the query cache and writes any successful fetch result to
 * IndexedDB for whitelisted query key prefixes. Returns the unsubscribe fn.
 */
export function subscribeQueryCache(queryClient: QueryClient): () => void {
  return queryClient.getQueryCache().subscribe((event) => {
    if (event.type !== "updated") return;
    if (event.action.type !== "success") return;

    const { queryKey, state } = event.query;
    if (!shouldPersist(queryKey) || state.data === undefined) return;

    void db.queryCache.put({
      key: JSON.stringify(queryKey),
      data: state.data,
      updatedAt: Date.now(),
    });
  });
}
