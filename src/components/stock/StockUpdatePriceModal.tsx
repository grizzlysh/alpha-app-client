import type { JSX } from "react";
import { useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Tag, Loader2 } from "lucide-react";

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
import { updateStockPrice } from "@/service/stockService";
import { formatRupiah } from "./stockUtils";

// ── Schema ────────────────────────────────────────────────────────────────────

function makeSchema(_t: Translations) {
  return z.object({
    sellingPrice: z.string(),
  });
}

interface FormValues {
  sellingPrice: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface StockUpdatePriceModalProps {
  stock: Stock;
  onClose: () => void;
  onSuccess: () => void;
}

export function StockUpdatePriceModal({
  stock,
  onClose,
  onSuccess,
}: StockUpdatePriceModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      sellingPrice: stock.sellingPrice != null ? String(stock.sellingPrice) : "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const raw = values.sellingPrice.trim();
      const parsed = raw === "" ? null : Number(raw);
      return updateStockPrice(stock.uuid, { sellingPrice: parsed });
    },
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

  const sellingPriceField = form.register("sellingPrice");

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
            <Tag className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">{t.stockUpdatePriceTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="px-6 py-5">
            {/* Medicine context */}
            <div className="mb-5 rounded-xl bg-muted/50 px-4 py-3">
              <p className="text-sm font-medium uppercase text-foreground">
                {stock.medicine.name}
              </p>
              <div className="mt-1.5 flex gap-3 text-xs text-muted-foreground">
                <span>{t.stockBasePrice}: {formatRupiah(stock.basePrice)}</span>
                <span>·</span>
                <span>{t.stockCalculatedPrice}: {formatRupiah(stock.calculatedPrice)}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="price-input">{t.stockSellingPriceLabel}</Label>
              <Input
                id="price-input"
                type="number"
                min={0}
                step={1}
                placeholder={t.stockSellingPricePlaceholder}
                {...sellingPriceField}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/^0+(?=\d)/, "");
                  sellingPriceField.onChange(e);
                }}
                className={cn(
                  form.formState.errors.sellingPrice &&
                    "border-destructive focus-visible:ring-destructive/30"
                )}
              />
              <p className="text-xs text-muted-foreground">{t.stockClearPriceHint}</p>
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
                  {t.stockUpdatePriceSaving}
                </>
              ) : (
                t.stockUpdatePriceSave
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
