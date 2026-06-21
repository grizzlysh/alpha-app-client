import type { JSX } from "react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Ban, Loader2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { getApiErrorMessage } from "@/utils/apiError";
import type { StockDisposal } from "@/types/stockDisposal";
import { cancelStockDisposal } from "@/service/stockDisposalService";

interface FormValues {
  description: string;
}

export interface StockDisposalCancelModalProps {
  disposal: StockDisposal;
  onClose: () => void;
  onSuccess: (updated: StockDisposal) => void;
}

export function StockDisposalCancelModal({
  disposal,
  onClose,
  onSuccess,
}: StockDisposalCancelModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const schema = z.object({
    description: z.string().trim().min(1, t.sdCancellationReasonRequired),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { description: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      cancelStockDisposal(disposal.uuid, { description: values.description }),
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.invalidateQueries({ queryKey: ["stock-disposals"] });
        queryClient.invalidateQueries({ queryKey: ["stock-disposal", disposal.uuid] });
        toast.success(t.sdCancelSuccess);
        onSuccessRef.current(res.data);
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, language, t.unexpectedError));
    },
  });

  const isPending = mutation.isPending;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent
        className="max-w-sm p-0"
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-destructive/10">
            <Ban className="h-4 w-4 text-destructive" />
          </div>
          <DialogTitle className="text-base">{t.sdCancelConfirmTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((v) => mutation.mutate(v))}>
          <div className="space-y-4 px-6 py-5">
            <DialogDescription className="text-sm text-muted-foreground">
              {t.sdCancelConfirmDesc}
            </DialogDescription>
            <p className="rounded-lg bg-muted px-3 py-2 text-sm font-medium text-foreground">
              {disposal.disposalNumber}
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="sd-cancel-reason">{t.sdCancellationReason}</Label>
              <Textarea
                id="sd-cancel-reason"
                {...register("description")}
                placeholder={t.sdCancellationReasonPlaceholder}
                rows={3}
                disabled={isPending}
                className="rounded-xl"
              />
              {errors.description && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl"
            >
              {t.cancel}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isPending}
              className="min-w-[8rem] rounded-xl"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.sdCancelling}
                </>
              ) : (
                t.sdCancel
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
