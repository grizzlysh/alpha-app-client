import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { liveQuery } from "dexie";

import { axiosInstance } from "@/configs/axiosInstance";
import { db, type PendingMutation } from "@/utils/db";
import { setPendingMutationCount } from "@/store/networkSlice";
import type { AppDispatch } from "@/store";

const MAX_RETRIES = 3;

interface MutationQueueReturn {
  pendingCount: number;
  failedMutations: PendingMutation[];
  syncNow: () => Promise<void>;
  retryMutation: (id: string) => Promise<void>;
  retryAllMutations: () => Promise<void>;
  discardMutation: (id: string) => Promise<void>;
}

export function useMutationQueue(): MutationQueueReturn {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  const [mutations, setMutations] = useState<PendingMutation[]>([]);

  // Reactively watch Dexie — updates whenever any row is added, updated, or deleted
  useEffect(() => {
    const subscription = liveQuery(() =>
      db.pendingMutations.orderBy("createdAt").toArray()
    ).subscribe({
      next: (rows) => {
        setMutations(rows);
        const count = rows.filter((m) => m.status === "pending").length;
        dispatch(setPendingMutationCount(count));
      },
    });
    return () => subscription.unsubscribe();
  }, [dispatch]);

  const syncNow = useCallback(async (): Promise<void> => {
    const pending = await db.pendingMutations
      .where("status")
      .equals("pending")
      .sortBy("createdAt");

    for (const mutation of pending) {
      try {
        await axiosInstance({
          method: mutation.method,
          url: mutation.endpoint,
          data: mutation.payload,
          headers: { "Idempotency-Key": mutation.id },
        });

        await db.pendingMutations.delete(mutation.id);

        for (const queryKey of mutation.queryKeysToInvalidate) {
          void queryClient.invalidateQueries({ queryKey });
        }
      } catch {
        const retries = mutation.retries + 1;
        if (retries >= MAX_RETRIES) {
          await db.pendingMutations.update(mutation.id, {
            status: "failed",
            retries,
          });
        } else {
          await db.pendingMutations.update(mutation.id, { retries });
        }
      }
    }
  }, [queryClient]);

  // Auto-drain when browser comes back online
  useEffect(() => {
    const handleOnline = (): void => {
      void syncNow();
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [syncNow]);

  const retryMutation = useCallback(
    async (id: string): Promise<void> => {
      await db.pendingMutations.update(id, { status: "pending", retries: 0 });
      if (navigator.onLine) await syncNow();
    },
    [syncNow]
  );

  const retryAllMutations = useCallback(async (): Promise<void> => {
    const failed = await db.pendingMutations
      .where("status")
      .equals("failed")
      .toArray();
    for (const m of failed) {
      await db.pendingMutations.update(m.id, { status: "pending", retries: 0 });
    }
    if (navigator.onLine) await syncNow();
  }, [syncNow]);

  const discardMutation = useCallback(async (id: string): Promise<void> => {
    await db.pendingMutations.delete(id);
  }, []);

  return {
    pendingCount: mutations.filter((m) => m.status === "pending").length,
    failedMutations: mutations.filter((m) => m.status === "failed"),
    syncNow,
    retryMutation,
    retryAllMutations,
    discardMutation,
  };
}
