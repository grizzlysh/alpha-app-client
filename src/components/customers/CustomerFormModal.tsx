import type { JSX } from "react";
import { useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { UserRound, Loader2, AlertCircle } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import type { Translations } from "@/configs/i18n";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Customer } from "@/types/customer";
import { createCustomer, updateCustomer } from "@/service/customerService";

// ── Schema ────────────────────────────────────────────────────────────────────

function makeSchema(t: Translations) {
  return z.object({
    name: z.string().min(1, t.customerNameRequired),
    phone: z.string(),
    address: z.string(),
    description: z.string(),
    status: z.enum(["ACTIVE", "INACTIVE"]),
  });
}

interface FormValues {
  name: string;
  phone: string;
  address: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
}

// ── Status toggle button ──────────────────────────────────────────────────────

interface StatusButtonProps {
  value: "ACTIVE" | "INACTIVE";
  label: string;
  selected: boolean;
  onClick: () => void;
}

function StatusButton({ label, selected, onClick }: StatusButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-xl border py-2 text-sm font-medium transition-colors",
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface CustomerFormModalProps {
  mode: "create" | "edit";
  customer?: Customer;
  onClose: () => void;
  onSuccess: () => void;
}

export function CustomerFormModal({
  mode,
  customer,
  onClose,
  onSuccess,
}: CustomerFormModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: customer?.name ?? "",
      phone: customer?.phone ?? "",
      address: customer?.address ?? "",
      description: customer?.description ?? "",
      status: customer?.status ?? "ACTIVE",
    },
  });

  const selectedStatus = form.watch("status");

  function handleMutationError(error: unknown): void {
    toast.error(getApiErrorMessage(error, language, t.unexpectedError));
  }

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: handleMutationError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: FormValues }) =>
      updateCustomer(uuid, {
        name: payload.name,
        phone: payload.phone || undefined,
        address: payload.address || undefined,
        description: payload.description || undefined,
        status: payload.status,
      }),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["customers"] });
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
      createMutation.mutate({
        name: values.name,
        phone: values.phone || undefined,
        address: values.address || undefined,
        description: values.description || undefined,
      });
    } else if (customer) {
      updateMutation.mutate({ uuid: customer.uuid, payload: values });
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent
        className="max-w-lg p-0"
        onInteractOutside={(e) => {
          if (isPending) e.preventDefault();
        }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <UserRound className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">
            {mode === "create" ? t.customerAdd : t.customerEdit}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="cust-name">
                  {t.customerName}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="cust-name"
                      placeholder={t.customerNamePlaceholder}
                      {...field}
                      className={cn(
                        form.formState.errors.name &&
                          "border-destructive focus-visible:ring-destructive/30"
                      )}
                    />
                  )}
                />
                {form.formState.errors.name && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className={cn("space-y-1.5", mode === "create" && "sm:col-span-2")}>
                <Label htmlFor="cust-phone">{t.customerPhone}</Label>
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="cust-phone"
                      inputMode="tel"
                      placeholder={t.customerPhonePlaceholder}
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/[^\d+\-\s()]/g, ""))
                      }
                    />
                  )}
                />
              </div>

              {/* Status — edit mode only */}
              {mode === "edit" && (
                <div className="space-y-1.5">
                  <Label>{t.customerStatusLabel}</Label>
                  <div className="flex gap-2">
                    <StatusButton
                      value="ACTIVE"
                      label={t.customerStatusActive}
                      selected={selectedStatus === "ACTIVE"}
                      onClick={() => form.setValue("status", "ACTIVE")}
                    />
                    <StatusButton
                      value="INACTIVE"
                      label={t.customerStatusInactive}
                      selected={selectedStatus === "INACTIVE"}
                      onClick={() => form.setValue("status", "INACTIVE")}
                    />
                  </div>
                </div>
              )}

              {/* Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="cust-address">{t.customerAddress}</Label>
                <Input
                  id="cust-address"
                  placeholder={t.customerAddressPlaceholder}
                  {...form.register("address")}
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="cust-notes">{t.customerDescription}</Label>
                <Textarea
                  id="cust-notes"
                  rows={3}
                  placeholder={t.customerDescriptionPlaceholder}
                  className="resize-none"
                  {...form.register("description")}
                />
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
                  {t.customerSaving}
                </>
              ) : (
                t.customerSave
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
