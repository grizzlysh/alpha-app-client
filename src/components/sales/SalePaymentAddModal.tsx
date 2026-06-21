import type { JSX } from "react";
import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { Wallet, Loader2 } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DateInput } from "@/components/ui/date-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Translations } from "@/configs/i18n";
import type { Sale, PaymentMethod } from "@/types/sale";
import { addSalePayment } from "@/service/saleService";
import { formatCurrency } from "./salesUtils";

// ── Schema ────────────────────────────────────────────

function makeSchema(t: Translations, maxAmount: number) {
  return z.object({
    amount: z
      .number({ invalid_type_error: t.salePaymentAmountRequired })
      .positive(t.salePaymentAmountRequired)
      .max(maxAmount, `Max ${maxAmount.toLocaleString("id-ID")}`),
    paymentMethod: z.enum(["CASH", "TRANSFER", "CREDIT"] as const, {
      required_error: t.salePaymentMethodLabel,
    }),
    paymentDate: z.string().min(1, t.salePaymentDateRequired),
    description: z.string().trim().optional(),
  });
}

type FormValues = {
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  description?: string;
};

// ── Payment method option ─────────────────────────────

interface MethodButtonProps {
  value: PaymentMethod;
  label: string;
  selected: boolean;
  onClick: () => void;
}

function MethodButton({ label, selected, onClick }: MethodButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors",
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

// ── Modal ─────────────────────────────────────────────

export interface SalePaymentAddModalProps {
  sale: Sale;
  onClose: () => void;
  onSuccess: () => void;
}

export function SalePaymentAddModal({
  sale,
  onClose,
  onSuccess,
}: SalePaymentAddModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const remaining = sale.totalAmount - sale.paidAmount;

  const schema = makeSchema(t, remaining);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: remaining > 0 ? remaining : undefined,
      paymentMethod: "CASH",
      paymentDate: new Date().toISOString().slice(0, 10),
      description: "",
    },
  });

  const selectedMethod = watch("paymentMethod");
  const watchedAmount = watch("amount");
  const typedAmount = isNaN(watchedAmount) ? 0 : watchedAmount;
  const afterAmount = remaining - typedAmount;
  const isOverpaying = afterAmount < 0;

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      addSalePayment(sale.uuid, {
        paidAmount: values.amount,
        paymentMethod: values.paymentMethod,
        paymentDate: values.paymentDate,
        description: values.description || undefined,
      }),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["sales"] });
        queryClient.invalidateQueries({ queryKey: ["sale", sale.uuid] });
        toast.success(<LiveToastMessage getMessage={(t) => t.salePaymentAddSuccess} />);
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
  const { onChange: amountOnChange, ...amountRegistered } = register("amount", { valueAsNumber: true });

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
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Wallet className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">{t.salePaymentAdd}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((v) => mutation.mutate(v))}>
          <div className="space-y-4 px-6 py-5">
            {/* Sale reference */}
            <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
              {sale.saleNumber} · <span className="uppercase">{sale.customer.name}</span>
            </div>

            {/* Payment method */}
            <div className="space-y-1.5">
              <Label>{t.salePaymentMethodLabel}</Label>
              <div className="flex gap-2">
                {(["CASH", "TRANSFER", "CREDIT"] as PaymentMethod[]).map((m) => (
                  <MethodButton
                    key={m}
                    value={m}
                    selected={selectedMethod === m}
                    label={
                      m === "CASH"
                        ? t.salePaymentMethodCash
                        : m === "TRANSFER"
                        ? t.salePaymentMethodTransfer
                        : t.salePaymentMethodCredit
                    }
                    onClick={() => setValue("paymentMethod", m)}
                  />
                ))}
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="sale-pay-amount">{t.salePaymentAmountLabel}</Label>
                <button
                  type="button"
                  onClick={() => setValue("amount", remaining, { shouldValidate: true })}
                  className="text-xs text-primary hover:underline"
                >
                  {t.salePaymentPayFull}
                </button>
              </div>
              <Input
                id="sale-pay-amount"
                type="number"
                step="0.01"
                min={0}
                max={remaining}
                placeholder={t.salePaymentAmountPlaceholder}
                className={cn("rounded-xl", errors.amount && "border-destructive")}
                {...amountRegistered}
                onChange={(e) => {
                  const raw = parseFloat(e.target.value);
                  if (!isNaN(raw) && raw > remaining) {
                    e.target.value = String(remaining);
                  }
                  return amountOnChange(e);
                }}
              />
              {errors.amount && (
                <p className="text-xs text-destructive">{errors.amount.message}</p>
              )}
              <div className="rounded-lg bg-muted/40 px-3 py-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t.saleRemaining}</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(remaining)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t.salePaymentAfterLabel}</span>
                  <span className={cn("font-medium", isOverpaying ? "text-destructive" : "text-foreground")}>
                    {formatCurrency(Math.max(0, afterAmount))}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment date */}
            <div className="space-y-1.5">
              <Label htmlFor="sale-pay-date">{t.salePaymentDateLabel}</Label>
              <Controller
                control={control}
                name="paymentDate"
                render={({ field }) => (
                  <DateInput
                    id="sale-pay-date"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className={cn("rounded-xl", errors.paymentDate && "border-destructive")}
                  />
                )}
              />
              {errors.paymentDate && (
                <p className="text-xs text-destructive">{errors.paymentDate.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="sale-pay-desc">{t.salePaymentDescriptionLabel}</Label>
              <Textarea
                id="sale-pay-desc"
                placeholder={t.salePaymentDescriptionPlaceholder}
                className="rounded-xl resize-none"
                rows={3}
                {...register("description")}
              />
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
              className="min-w-[9rem] rounded-xl"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.salePaymentSaving}
                </>
              ) : (
                t.salePaymentSave
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
