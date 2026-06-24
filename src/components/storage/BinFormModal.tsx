import type { JSX } from "react";
import { useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Box, Loader2, AlertCircle } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import type { StorageBin, CreateBinPayload, UpdateBinPayload } from "@/types/storage";
import { createBin, updateBin } from "@/service/storageService";

// ── Schema ────────────────────────────────────────────────────────────────────

function makeSchema(t: Translations) {
  return z.object({
    name: z.string().min(1, t.binNameRequired),
    code: z.string().min(1, t.binCodeRequired),
    description: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
  });
}

interface FormValues {
  name: string;
  code: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface BinFormModalProps {
  mode: "create" | "edit";
  cabinetUuid: string;
  shelfUuid: string;
  bin?: StorageBin;
  onClose: () => void;
  onSuccess: () => void;
}

export function BinFormModal({
  mode,
  cabinetUuid,
  shelfUuid,
  bin,
  onClose,
  onSuccess,
}: BinFormModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: bin?.name ?? "",
      code: bin?.code ?? "",
      description: bin?.description ?? "",
      status: (bin?.status === "INACTIVE" ? "INACTIVE" : "ACTIVE"),
    },
  });

  function handleMutationError(error: unknown): void {
    toast.error(getApiErrorMessage(error, language, t.unexpectedError));
  }

  const createMutation = useMutation({
    mutationFn: (payload: CreateBinPayload) =>
      createBin(cabinetUuid, shelfUuid, payload),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["storage-bins", shelfUuid] });
        toast.success(<LiveToastMessage getMessage={(t) => t.binCreateSuccess} />);
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: handleMutationError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: UpdateBinPayload }) =>
      updateBin(cabinetUuid, shelfUuid, uuid, payload),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["storage-bins", shelfUuid] });
        toast.success(<LiveToastMessage getMessage={(t) => t.binUpdateSuccess} />);
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: handleMutationError,
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  function onSubmit(values: FormValues): void {
    if (mode === "create") {
      const payload: CreateBinPayload = {
        name: values.name,
        code: values.code,
        description: values.description || undefined,
      };
      createMutation.mutate(payload);
    } else if (bin) {
      const payload: UpdateBinPayload = {
        name: values.name,
        code: values.code,
        description: values.description || undefined,
        status: values.status,
      };
      updateMutation.mutate({ uuid: bin.uuid, payload });
    }
  }

  const fieldError = (key: keyof FormValues) =>
    form.formState.errors[key]?.message;

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !isPending) onClose(); }}>
      <DialogContent
        className="max-w-md p-0"
        onInteractOutside={(e) => { if (isPending) e.preventDefault(); }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Box className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">
            {mode === "create" ? t.binAdd : t.binEdit}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FormValues>)}>
          <div className="px-6 py-5">
            <div className="grid gap-4 sm:grid-cols-2">

              {/* Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="bin-name">
                  {t.binName}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Input
                  id="bin-name"
                  placeholder={t.binNamePlaceholder}
                  {...form.register("name")}
                  className={cn(fieldError("name") && "border-destructive focus-visible:ring-destructive/30")}
                />
                {fieldError("name") && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />{fieldError("name")}
                  </p>
                )}
              </div>

              {/* Code */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="bin-code">
                  {t.binCode}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Input
                  id="bin-code"
                  placeholder={t.binCodePlaceholder}
                  {...form.register("code", {
                    onChange: (e) => { e.target.value = e.target.value.toUpperCase(); },
                  })}
                  className={cn(fieldError("code") && "border-destructive focus-visible:ring-destructive/30")}
                />
                {fieldError("code") && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />{fieldError("code")}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="bin-desc">{t.binDescription}</Label>
                <textarea
                  id="bin-desc"
                  rows={2}
                  placeholder={t.binDescriptionPlaceholder}
                  {...form.register("description")}
                  className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50"
                />
              </div>

              {/* Status — edit only */}
              {mode === "edit" && (
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>{t.binStatus}</Label>
                  <Controller
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                      <Combobox
                        value={field.value}
                        onValueChange={field.onChange}
                        options={[
                          { value: "ACTIVE", label: t.storageStatusActive },
                          { value: "INACTIVE", label: t.storageStatusInactive },
                        ]}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="rounded-xl">
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isPending} className="min-w-[7rem] rounded-xl">
              {isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" />{t.binSaving}</>
              ) : (
                t.binSave
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
