import type { JSX } from "react";
import { useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PencilRuler, Loader2, AlertCircle } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import type { Translations } from "@/configs/i18n";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Stock, StockDetail } from "@/types/stock";
import { adjustStock } from "@/service/stockService";
import { getUsers } from "@/service/userService";

// ── Schema ────────────────────────────────────────────────────────────────────

function makeSchema(t: Translations) {
  return z.object({
    quantity: z
      .number({ invalid_type_error: t.stockAdjustNewQtyRequired })
      .int()
      .min(0, t.stockAdjustNewQtyRequired),
    signedByUuid: z.string().min(1, t.stockAdjustSignedByRequired),
    description: z.string().min(1, t.stockAdjustDescriptionRequired),
  });
}

interface FormValues {
  quantity: number;
  signedByUuid: string;
  description: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface StockAdjustModalProps {
  stock: Stock;
  stockDetail: StockDetail;
  onClose: () => void;
  onSuccess: () => void;
}

export function StockAdjustModal({
  stock,
  stockDetail,
  onClose,
  onSuccess,
}: StockAdjustModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      quantity: stockDetail.quantityPieces,
      signedByUuid: "",
      description: "",
    },
  });

  const { data: usersData } = useQuery({
    queryKey: ["users-dropdown"],
    queryFn: () => getUsers({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const userOptions = (usersData?.data ?? []).map((u) => ({
    value: u.uuid,
    label: u.name,
  }));

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      adjustStock(stockDetail.uuid, {
        quantity: values.quantity,
        signedByUuid: values.signedByUuid,
        description: values.description,
      }),
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

  const fieldError = (key: keyof FormValues) =>
    form.formState.errors[key]?.message;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent
        className="max-w-md p-0"
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <PencilRuler className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">{t.stockAdjustTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="px-6 py-5">
            {/* Medicine + batch context */}
            <div className="mb-5 rounded-xl bg-muted/50 px-4 py-3">
              <p className="text-sm font-medium uppercase text-foreground">
                {stock.medicine.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t.stockBatchNumber}: <span className="uppercase">{stockDetail.batchNumber}</span> · {t.stockAdjustCurrentQty}:{" "}
                {stockDetail.quantityPieces.toLocaleString("id-ID")} {stock.medicine.unit}
              </p>
            </div>

            <div className="grid gap-4">
              {/* New quantity */}
              <div className="space-y-1.5">
                <Label htmlFor="adj-qty">
                  {t.stockAdjustNewQty}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Input
                  id="adj-qty"
                  type="number"
                  min={0}
                  step={1}
                  placeholder={t.stockAdjustNewQtyPlaceholder}
                  {...form.register("quantity", { valueAsNumber: true })}
                  className={cn(
                    fieldError("quantity") &&
                      "border-destructive focus-visible:ring-destructive/30"
                  )}
                />
                {fieldError("quantity") && (
                  <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3 shrink-0" />{fieldError("quantity")}</p>
                )}
              </div>

              {/* Signed by */}
              <div className="space-y-1.5">
                <Label htmlFor="adj-signed">
                  {t.stockAdjustSignedBy}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="signedByUuid"
                  control={form.control}
                  render={({ field }) => (
                    <Combobox
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      options={userOptions}
                      placeholder={t.stockAdjustSelectSignedBy}
                      className={cn(
                        fieldError("signedByUuid") &&
                          "border-destructive focus:ring-destructive/30"
                      )}
                    />
                  )}
                />
                {fieldError("signedByUuid") && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {fieldError("signedByUuid")}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="adj-desc">
                  {t.stockAdjustDescription}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Textarea
                  id="adj-desc"
                  rows={3}
                  placeholder={t.stockAdjustDescriptionPlaceholder}
                  {...form.register("description")}
                  className={cn(
                    "resize-none",
                    fieldError("description") &&
                      "border-destructive focus-visible:ring-destructive/30"
                  )}
                />
                {fieldError("description") && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {fieldError("description")}
                  </p>
                )}
              </div>
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
                  {t.stockAdjustSaving}
                </>
              ) : (
                t.stockAdjustSave
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
