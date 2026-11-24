import type { JSX } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertCircle, ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import type { Translations } from "@/configs/i18n";
import { useLanguage } from "@/hooks/useLanguage";
import { CURRENT_SHIFT_KEY } from "@/hooks/useCurrentShift";
import { addShiftCashMovement } from "@/service/shiftService";
import { getApiErrorMessage } from "@/utils/apiError";
import { cn } from "@/utils/cn";
import type { ShiftCashMovementType } from "@/types/shift";
import { AmountInput } from "./AmountInput";

const makeSchema = (t: Translations) =>
  z.object({
    type: z.enum(["IN", "OUT"]),
    amount: z.number().positive(t.shiftAmountRequired),
    note: z.string().trim().min(1, t.shiftNoteRequired).max(500),
  });
type FormValues = z.infer<ReturnType<typeof makeSchema>>;

interface CashMovementModalProps {
  shiftUuid: string;
  onClose: () => void;
}

export function CashMovementModal({ shiftUuid, onClose }: CashMovementModalProps): JSX.Element {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const { control, register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(makeSchema(t)),
    defaultValues: { type: "OUT", amount: 0, note: "" },
  });
  const type = watch("type");

  const mutation = useMutation({
    mutationFn: (v: FormValues) => addShiftCashMovement(shiftUuid, v),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message[language]);
        return;
      }
      queryClient.invalidateQueries({ queryKey: [CURRENT_SHIFT_KEY] });
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({ queryKey: ["shift", shiftUuid] });
      toast.success(<LiveToastMessage getMessage={(tr) => tr.shiftCashMovementSuccess} />);
      onClose();
    },
    onError: (error: unknown) => toast.error(getApiErrorMessage(error, language, t.unexpectedError)),
  });
  const isPending = mutation.isPending;

  const options: { value: ShiftCashMovementType; label: string; Icon: typeof ArrowDownLeft }[] = [
    { value: "IN", label: t.shiftCashIn, Icon: ArrowDownLeft },
    { value: "OUT", label: t.shiftCashOut, Icon: ArrowUpRight },
  ];

  return (
    <Dialog open onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent className="max-w-sm p-0" onInteractOutside={(e) => isPending && e.preventDefault()}>
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-base">{t.shiftCashMovement}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))}>
          <div className="space-y-4 px-6 py-5">
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t.shiftCashMovement}>
                  {options.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={field.value === value}
                      onClick={() => field.onChange(value)}
                      disabled={isPending}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                        field.value === value ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            />
            <div className="space-y-1.5">
              <Label htmlFor="shift-movement-amount">{t.shiftAmount}</Label>
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <AmountInput id="shift-movement-amount" value={field.value} onChange={field.onChange} invalid={!!errors.amount} disabled={isPending} autoFocus />
                )}
              />
              {errors.amount && <FieldError message={errors.amount.message} />}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shift-movement-note">{t.shiftNote}</Label>
              <Textarea
                id="shift-movement-note"
                rows={2}
                placeholder={type === "IN" ? t.shiftCashInHint : t.shiftCashOutHint}
                {...register("note")}
                disabled={isPending}
                className="rounded-xl"
              />
              {errors.note && <FieldError message={errors.note.message} />}
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="rounded-xl">
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isPending} className="min-w-[8rem] rounded-xl">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldError({ message }: { message?: string }): JSX.Element {
  return (
    <p className="flex items-center gap-1 text-xs text-destructive">
      <AlertCircle className="h-3 w-3" />
      {message}
    </p>
  );
}
