import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { useLanguage } from "@/hooks/useLanguage";
import type { ApiResponse } from "@/types/api";

interface UseDeleteMutationOptions {
  mutationFn: () => Promise<ApiResponse<unknown> | void>;
  queryKey: string[];
  onSuccess: () => void;
}

interface UseDeleteMutationReturn {
  mutate: () => void;
  isPending: boolean;
}

export function useDeleteMutation({
  mutationFn,
  queryKey,
  onSuccess,
}: UseDeleteMutationOptions): UseDeleteMutationReturn {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const mutation = useMutation({
    mutationFn,
    onSuccess: (res) => {
      const apiRes = res as ApiResponse<unknown> | undefined;
      if (apiRes && apiRes.success === false) {
        toast.error(apiRes.message[language]);
        return;
      }
      queryClient.invalidateQueries({ queryKey });
      onSuccessRef.current();
    },
    onError: (error: unknown) => {
      const axiosErr = error as AxiosError<ApiResponse<unknown>>;
      const msg = axiosErr.response?.data?.message;
      toast.error(msg ? msg[language] : t.unexpectedError);
    },
  });

  return { mutate: () => mutation.mutate(), isPending: mutation.isPending };
}
