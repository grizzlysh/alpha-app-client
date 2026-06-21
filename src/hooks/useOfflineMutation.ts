import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import type { AxiosError } from "axios";

import { db } from "@/utils/db";
import { setPendingMutationCount } from "@/store/networkSlice";
import type { AppDispatch } from "@/store";

interface OfflineMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  endpoint: string;
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  queryKeysToInvalidate?: string[][];
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: unknown, variables: TVariables) => void;
}

/**
 * Wraps useMutation with offline-queue support. When a write fails due to no
 * network connection, the request is saved to IndexedDB and replayed
 * automatically by useMutationQueue when the connection returns.
 *
 * Use this for mutations that must not be lost when the user is offline
 * (e.g. sales, stock adjustments). For deletes or admin operations that are
 * not safe to replay, use plain useMutation instead.
 */
export function useOfflineMutation<TData = unknown, TVariables = void>({
  mutationFn,
  endpoint,
  method,
  queryKeysToInvalidate = [],
  onSuccess,
  onError,
}: OfflineMutationOptions<TData, TVariables>): UseMutationResult<
  TData,
  unknown,
  TVariables
> {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();

  return useMutation<TData, unknown, TVariables>({
    mutationFn,
    onSuccess: (data, variables) => {
      for (const queryKey of queryKeysToInvalidate) {
        void queryClient.invalidateQueries({ queryKey });
      }
      onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      const axiosErr = error as AxiosError;
      const isNetworkError = !axiosErr.response && !navigator.onLine;

      if (isNetworkError) {
        void (async () => {
          await db.pendingMutations.add({
            id: crypto.randomUUID(),
            endpoint,
            method,
            payload: variables as unknown,
            queryKeysToInvalidate,
            createdAt: Date.now(),
            retries: 0,
            status: "pending",
          });
          const count = await db.pendingMutations
            .where("status")
            .equals("pending")
            .count();
          dispatch(setPendingMutationCount(count));
          toast.info("Saved offline — will sync when connection returns.");
        })();
        return;
      }

      onError?.(error, variables);
    },
  });
}
