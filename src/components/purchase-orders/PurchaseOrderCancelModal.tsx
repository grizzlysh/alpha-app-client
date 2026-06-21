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
import type { PurchaseOrder } from "@/types/purchaseOrder";
import { cancelPurchaseOrder } from "@/service/purchaseOrderService";

interface FormValues {
  cancellationReason: string;
}

export interface PurchaseOrderCancelModalProps {
  order: PurchaseOrder;
  onClose: () => void;
  onSuccess: (updated: PurchaseOrder) => void;
}

export function PurchaseOrderCancelModal({
  order,
  onClose,
  onSuccess,
}: PurchaseOrderCancelModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const schema = z.object({
    cancellationReason: z.string().trim().min(1, t.poCancellationReasonRequired),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { cancellationReason: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      cancelPurchaseOrder(order.uuid, {
        cancellationReason: values.cancellationReason,
      }),
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
        toast.success(t.poCancelSuccess);
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
          <DialogTitle className="text-base">
            {t.poCancelConfirmTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((v) => mutation.mutate(v))}>
          <div className="px-6 py-5 space-y-4">
            <DialogDescription className="text-sm text-muted-foreground">
              {t.poCancelConfirmDesc}
            </DialogDescription>
            <p className="rounded-lg bg-muted px-3 py-2 text-sm font-medium text-foreground">
              {order.orderNumber} · <span className="uppercase">{order.distributor.name}</span>
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="cancellationReason">
                {t.poCancellationReason}
              </Label>
              <Textarea
                id="cancellationReason"
                {...register("cancellationReason")}
                placeholder={t.poCancellationReasonPlaceholder}
                rows={3}
                disabled={isPending}
                className="rounded-xl"
              />
              {errors.cancellationReason && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.cancellationReason.message}
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
                  {t.poCancelling}
                </>
              ) : (
                t.poCancel
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
