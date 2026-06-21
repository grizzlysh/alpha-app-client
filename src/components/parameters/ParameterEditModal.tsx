import type { JSX } from "react";
import { useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import { SlidersHorizontal, Loader2, AlertCircle } from "lucide-react";
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
import type { ApiResponse } from "@/types/api";
import type { Parameter, UpdateParameterPayload } from "@/types/parameters";

// ── Schema ────────────────────────────────────────────────────────────────────

function makeSchema(t: Translations) {
  return z.object({
    value: z.string().min(1, t.paramValueRequired),
    description: z.string().optional(),
  });
}

interface FormValues {
  value: string;
  description: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface ParameterEditModalProps {
  parameter: Parameter;
  queryKey: string;
  icon: LucideIcon;
  updateFn: (uuid: string, payload: UpdateParameterPayload) => Promise<ApiResponse<Parameter>>;
  onClose: () => void;
  onSuccess: () => void;
}

export function ParameterEditModal({
  parameter,
  queryKey,
  icon: Icon,
  updateFn,
  onClose,
  onSuccess,
}: ParameterEditModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      value: parameter.value,
      description: parameter.description ?? "",
    },
  });

  function handleMutationError(error: unknown): void {
    toast.error(getApiErrorMessage(error, language, t.unexpectedError));
  }

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload: UpdateParameterPayload = {
        value: values.value,
        description: values.description || undefined,
      };
      return updateFn(parameter.uuid, payload);
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: handleMutationError,
  });

  const isPending = mutation.isPending;

  function onSubmit(values: FormValues): void {
    mutation.mutate(values);
  }

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
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base">{t.paramEdit}</DialogTitle>
            <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
              {parameter.key}
            </p>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 px-6 py-5">
            {/* Value */}
            <div className="space-y-1.5">
              <Label htmlFor="param-value">
                {t.paramValue}
                <span className="ml-0.5 text-destructive">*</span>
              </Label>
              <Controller
                name="value"
                control={form.control}
                render={({ field }) => (
                  <Input
                    id="param-value"
                    placeholder={t.paramValuePlaceholder}
                    {...field}
                    className={cn(
                      form.formState.errors.value &&
                        "border-destructive focus-visible:ring-destructive/30"
                    )}
                  />
                )}
              />
              {form.formState.errors.value && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {form.formState.errors.value.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="param-desc">{t.paramDescription}</Label>
              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <textarea
                    id="param-desc"
                    placeholder={t.paramDescriptionPlaceholder}
                    rows={3}
                    {...field}
                    className="flex w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
                  />
                )}
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
              className="min-w-[6rem] rounded-xl"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.paramSaving}
                </>
              ) : (
                t.paramSave
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
