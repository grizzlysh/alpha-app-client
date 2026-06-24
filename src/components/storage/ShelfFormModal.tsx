import type { JSX } from "react";
import { useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { LayoutList, Loader2, AlertCircle } from "lucide-react";

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
import type { StorageShelf, CreateShelfPayload, UpdateShelfPayload } from "@/types/storage";
import { createShelf, updateShelf } from "@/service/storageService";

// ── Schema ────────────────────────────────────────────────────────────────────

function makeSchema(t: Translations) {
  return z.object({
    name: z.string().min(1, t.shelfNameRequired),
    code: z.string().min(1, t.shelfCodeRequired),
    level: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
  });
}

interface FormValues {
  name: string;
  code: string;
  level: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface ShelfFormModalProps {
  mode: "create" | "edit";
  cabinetUuid: string;
  shelf?: StorageShelf;
  onClose: () => void;
  onSuccess: () => void;
}

export function ShelfFormModal({
  mode,
  cabinetUuid,
  shelf,
  onClose,
  onSuccess,
}: ShelfFormModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: shelf?.name ?? "",
      code: shelf?.code ?? "",
      level: shelf?.level != null ? String(shelf.level) : "",
      description: shelf?.description ?? "",
      status: shelf?.status ?? "ACTIVE",
    },
  });

  function handleMutationError(error: unknown): void {
    toast.error(getApiErrorMessage(error, language, t.unexpectedError));
  }

  const createMutation = useMutation({
    mutationFn: (payload: CreateShelfPayload) => createShelf(cabinetUuid, payload),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["storage-shelves", cabinetUuid] });
        toast.success(<LiveToastMessage getMessage={(t) => t.shelfCreateSuccess} />);
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: handleMutationError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: UpdateShelfPayload }) =>
      updateShelf(uuid, payload),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["storage-shelves", cabinetUuid] });
        toast.success(<LiveToastMessage getMessage={(t) => t.shelfUpdateSuccess} />);
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: handleMutationError,
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  function onSubmit(values: FormValues): void {
    const levelNum = values.level ? parseInt(values.level, 10) : undefined;

    if (mode === "create") {
      const payload: CreateShelfPayload = {
        name: values.name,
        code: values.code,
        level: levelNum,
        description: values.description || undefined,
      };
      createMutation.mutate(payload);
    } else if (shelf) {
      const payload: UpdateShelfPayload = {
        name: values.name,
        code: values.code,
        level: levelNum,
        description: values.description || undefined,
        status: values.status,
      };
      updateMutation.mutate({ uuid: shelf.uuid, payload });
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
            <LayoutList className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">
            {mode === "create" ? t.shelfAdd : t.shelfEdit}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="px-6 py-5">
            <div className="grid gap-4 sm:grid-cols-2">

              {/* Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="shelf-name">
                  {t.shelfName}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Input
                  id="shelf-name"
                  placeholder={t.shelfNamePlaceholder}
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
              <div className="space-y-1.5">
                <Label htmlFor="shelf-code">
                  {t.shelfCode}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Input
                  id="shelf-code"
                  placeholder={t.shelfCodePlaceholder}
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

              {/* Level */}
              <div className="space-y-1.5">
                <Label htmlFor="shelf-level">{t.shelfLevel}</Label>
                <Input
                  id="shelf-level"
                  type="number"
                  min={1}
                  placeholder={t.shelfLevelPlaceholder}
                  {...form.register("level")}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="shelf-desc">{t.shelfDescription}</Label>
                <textarea
                  id="shelf-desc"
                  rows={2}
                  placeholder={t.shelfDescriptionPlaceholder}
                  {...form.register("description")}
                  className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50"
                />
              </div>

              {/* Status — edit only */}
              {mode === "edit" && (
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>{t.shelfStatus}</Label>
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
                <><Loader2 className="h-4 w-4 animate-spin" />{t.shelfSaving}</>
              ) : (
                t.shelfSave
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
