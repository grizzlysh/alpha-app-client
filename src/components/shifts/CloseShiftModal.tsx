import type { JSX } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, EyeOff, Loader2, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { useLanguage } from "@/hooks/useLanguage";
import { CURRENT_SHIFT_KEY } from "@/hooks/useCurrentShift";
import { closeShift } from "@/service/shiftService";
import { getApiErrorMessage } from "@/utils/apiError";
import { cn } from "@/utils/cn";
import type { Shift, ShiftDetail } from "@/types/shift";
import { AmountInput } from "./AmountInput";
import { ShiftSummaryGrid } from "./ShiftSummaryGrid";
import { differenceLabel, differenceTone, formatCurrency } from "./shiftUtils";

const schema = z.object({ countedCash: z.number().min(0), note: z.string().trim().max(500) });
type FormValues = z.infer<typeof schema>;

interface CloseShiftModalProps {
  shift: Shift;
  /** Difference above this (Rp) needs a note. */
  tolerance: number;
  onClose: () => void;
  onClosed?: (shift: ShiftDetail) => void;
}

export function CloseShiftModal({ shift, tolerance, onClose, onClosed }: CloseShiftModalProps): JSX.Element {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const { control, register, handleSubmit, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { countedCash: 0, note: "" },
  });
  const counted = watch("countedCash");
  const note = watch("note");
  // With a blind close the summary is withheld: no live difference is shown.
  const summary = shift.summary;
  const difference = summary ? counted - summary.expectedCash : null;
  const needsNote = difference !== null && Math.abs(difference) > tolerance && !note.trim();

  const mutation = useMutation({
    mutationFn: (v: FormValues) => closeShift(shift.uuid, { countedCash: v.countedCash, note: v.note || undefined }),
    onSuccess: (res) => {
      if (!res.success || !res.data) {
        toast.error(res.message[language]);
        return;
      }
      queryClient.invalidateQueries({ queryKey: [CURRENT_SHIFT_KEY] });
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({ queryKey: ["shift", shift.uuid] });
      toast.success(<LiveToastMessage getMessage={(tr) => tr.shiftCloseSuccess} />);
      onClosed?.(res.data);
      onClose();
    },
    onError: (error: unknown) => toast.error(getApiErrorMessage(error, language, t.unexpectedError)),
  });
  const isPending = mutation.isPending;

  return (
    <Dialog open onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-md overflow-y-auto p-0" onInteractOutside={(e) => isPending && e.preventDefault()}>
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <LockKeyhole className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <DialogTitle className="text-base">{t.shiftClose}</DialogTitle>
            <p className="truncate font-mono text-xs text-muted-foreground">{shift.shiftNumber}</p>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))}>
          <div className="space-y-4 px-6 py-5">
            {summary ? (
              <ShiftSummaryGrid t={t} openingCash={shift.openingCash} summary={summary} />
            ) : (
              <p className="flex items-start gap-2 rounded-xl bg-muted px-3 py-2.5 text-sm text-muted-foreground">
                <EyeOff className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden />
                {t.shiftBlindCloseNote}
              </p>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="shift-counted-cash">{t.shiftCountedCash}</Label>
              <Controller
                control={control}
                name="countedCash"
                render={({ field }) => (
                  <AmountInput id="shift-counted-cash" value={field.value} onChange={field.onChange} disabled={isPending} autoFocus />
                )}
              />
              <p className="text-xs text-muted-foreground">{t.shiftCountedCashHint}</p>
            </div>
            {difference !== null && (
              <div className="flex items-center justify-between rounded-xl border border-border px-4 py-2.5 text-sm">
                <span className="text-muted-foreground">{t.shiftDifference}</span>
                <span className={cn("font-semibold tabular-nums", differenceTone(difference))}>
                  {differenceLabel(difference, t)} {Math.abs(difference) >= 0.005 && formatCurrency(Math.abs(difference))}
                </span>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="shift-closing-note">{t.shiftNoteOptional}</Label>
              <Textarea id="shift-closing-note" rows={2} {...register("note")} disabled={isPending} className="rounded-xl" />
              {needsNote && (
                <p className="flex items-center gap-1 text-xs text-warning">
                  <AlertTriangle className="h-3 w-3" />
                  {t.shiftDifferenceNoteNeeded}
                </p>
              )}
            </div>
            <DialogDescription className="text-xs text-muted-foreground">{t.shiftCloseConfirm}</DialogDescription>
          </div>
          <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="rounded-xl">
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isPending || needsNote} className="min-w-[8rem] rounded-xl">
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />{t.shiftClosing}</> : t.shiftClose}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
