import type { JSX } from "react";
import { useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListOrdered, Loader2, AlertCircle } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import type { Translations } from "@/configs/i18n";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Stock } from "@/types/stock";
import { updateStockReorderLevel } from "@/service/stockService";

// ── Schema ────────────────────────────────────────────────────────────────────

function makeSchema(t: Translations) {
  return z.object({
    reorderLevel: z
      .number({ invalid_type_error: t.stockReorderLevelRequired })
      .int()
      .min(0, t.stockReorderLevelRequired),
  });
}

interface FormValues {
  reorderLevel: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface StockUpdateReorderModalProps {
  stock: Stock;
  onClose: () => void;
  onSuccess: () => void;
}

export function StockUpdateReorderModal({
  stock,
  onClose,
  onSuccess,
}: StockUpdateReorderModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      reorderLevel: stock.reorderLevel,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      updateStockReorderLevel(stock.uuid, { reorderLevel: values.reorderLevel }),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["stocks"] });
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, language, t.unexpectedError));
    },
  });

  const isPending = mutation.isPending;

  function onSubmit(values: FormValues): void {
    mutation.mutate(values);
  }

  const fieldError = form.formState.errors.reorderLevel?.message;

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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <ListOrdered className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">{t.stockUpdateReorderTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="px-6 py-5">
            {/* Medicine context */}
            <div className="mb-5 rounded-xl bg-muted/50 px-4 py-3">
              <p className="text-sm font-medium uppercase text-foreground">
                {stock.medicine.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t.stockTotalPieces}: {stock.totalPieces.toLocaleString("id-ID")}{" "}
                {stock.medicine.unit}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reorder-input">
                {t.stockReorderLevelLabel}
                <span className="ml-0.5 text-destructive">*</span>
              </Label>
              <Input
                id="reorder-input"
                type="number"
                min={0}
                step={1}
                placeholder={t.stockReorderLevelPlaceholder}
                {...form.register("reorderLevel", { valueAsNumber: true })}
                className={cn(
                  fieldError && "border-destructive focus-visible:ring-destructive/30"
                )}
              />
              {fieldError && (
                <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError}</p>
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
              disabled={isPending}
              className="min-w-[6rem] rounded-xl"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.stockUpdateReorderSaving}
                </>
              ) : (
                t.stockUpdateReorderSave
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
