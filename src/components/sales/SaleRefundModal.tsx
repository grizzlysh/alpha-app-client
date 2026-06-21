import type { JSX } from "react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { Undo2, Loader2, AlertCircle } from "lucide-react";

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
import type { Sale } from "@/types/sale";
import { refundSale } from "@/service/saleService";

interface FormValues {
  description: string;
}

export interface SaleRefundModalProps {
  sale: Sale;
  onClose: () => void;
  onSuccess: (updated: Sale) => void;
}

export function SaleRefundModal({
  sale,
  onClose,
  onSuccess,
}: SaleRefundModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const schema = z.object({
    description: z.string().trim().min(1, t.saleRefundReasonRequired),
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
      refundSale(sale.uuid, { description: values.description }),
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.invalidateQueries({ queryKey: ["sales"] });
        queryClient.invalidateQueries({ queryKey: ["sale", sale.uuid] });
        toast.success(<LiveToastMessage getMessage={(t) => t.saleRefundSuccess} />);
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
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
            <Undo2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-base">{t.saleRefundConfirmTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((v) => mutation.mutate(v))}>
          <div className="space-y-4 px-6 py-5">
            <DialogDescription className="text-sm text-muted-foreground">
              {t.saleRefundConfirmDesc}
            </DialogDescription>
            <p className="rounded-lg bg-muted px-3 py-2 text-sm font-medium text-foreground">
              {sale.saleNumber}
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="sale-refund-reason">{t.saleRefundReason}</Label>
              <Textarea
                id="sale-refund-reason"
                {...register("description")}
                placeholder={t.saleRefundReasonPlaceholder}
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
                  {t.saleRefunding}
                </>
              ) : (
                t.saleRefund
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
