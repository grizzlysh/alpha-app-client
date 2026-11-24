import type { JSX } from "react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { useLanguage } from "@/hooks/useLanguage";
import { CURRENT_SHIFT_KEY } from "@/hooks/useCurrentShift";
import { openShift } from "@/service/shiftService";
import { getApiErrorMessage } from "@/utils/apiError";
import { AmountInput } from "./AmountInput";

const schema = z.object({ openingCash: z.number().min(0), note: z.string().trim().max(500) });
type FormValues = z.infer<typeof schema>;

interface OpenShiftModalProps {
  suggestedCash: number;
  onClose: () => void;
  onOpened?: () => void;
}

export function OpenShiftModal({ suggestedCash, onClose, onOpened }: OpenShiftModalProps): JSX.Element {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const onOpenedRef = useRef(onOpened);
  onOpenedRef.current = onOpened;

  const { control, register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { openingCash: suggestedCash, note: "" },
  });

  const mutation = useMutation({
    mutationFn: (v: FormValues) => openShift({ openingCash: v.openingCash, note: v.note || undefined }),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message[language]);
        return;
      }
      queryClient.invalidateQueries({ queryKey: [CURRENT_SHIFT_KEY] });
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      toast.success(<LiveToastMessage getMessage={(tr) => tr.shiftOpenSuccess} />);
      onOpenedRef.current?.();
      onClose();
    },
    onError: (error: unknown) => toast.error(getApiErrorMessage(error, language, t.unexpectedError)),
  });
  const isPending = mutation.isPending;

  return (
    <Dialog open onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent className="max-w-sm p-0" onInteractOutside={(e) => isPending && e.preventDefault()}>
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Wallet className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">{t.shiftOpen}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))}>
          <div className="space-y-4 px-6 py-5">
            <DialogDescription className="text-sm text-muted-foreground">{t.shiftOpeningCashHint}</DialogDescription>
            <div className="space-y-1.5">
              <Label htmlFor="shift-opening-cash">{t.shiftOpeningCash}</Label>
              <Controller
                control={control}
                name="openingCash"
                render={({ field }) => (
                  <AmountInput id="shift-opening-cash" value={field.value} onChange={field.onChange} disabled={isPending} autoFocus />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shift-opening-note">{t.shiftNoteOptional}</Label>
              <Textarea id="shift-opening-note" rows={2} {...register("note")} disabled={isPending} className="rounded-xl" />
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="rounded-xl">
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isPending} className="min-w-[8rem] rounded-xl">
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />{t.shiftOpening}</> : t.shiftOpen}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
