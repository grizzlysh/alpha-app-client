import type { JSX } from "react";
import { useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { getApiErrorMessage } from "@/utils/apiError";
import type { ApiResponse } from "@/types/api";
import type { ReferencePayload } from "@/types/medicine";
import type { ReferenceItem, ReferenceLabels } from "./referenceTypes";

interface FormValues {
  name: string;
  status: "ACTIVE" | "INACTIVE";
  requiredPrescription: boolean;
}

export interface ReferenceFormModalProps {
  mode: "create" | "edit";
  item?: ReferenceItem;
  labels: ReferenceLabels;
  icon: JSX.Element;
  queryKey: string;
  onClose: () => void;
  onSuccess: () => void;
  createFn: (payload: ReferencePayload) => Promise<ApiResponse<ReferenceItem>>;
  updateFn: (
    uuid: string,
    payload: ReferencePayload
  ) => Promise<ApiResponse<ReferenceItem>>;
}

export function ReferenceFormModal({
  mode,
  item,
  labels,
  icon,
  queryKey,
  onClose,
  onSuccess,
  createFn,
  updateFn,
}: ReferenceFormModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { language } = useLanguage();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, labels.nameRequired),
        status: z.enum(["ACTIVE", "INACTIVE"]),
        requiredPrescription: z.boolean(),
      }),
    [labels.nameRequired]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: item?.name ?? "",
      status: item?.status ?? "ACTIVE",
      requiredPrescription: item?.requiredPrescription ?? false,
    },
  });

  function handleMutationError(error: unknown): void {
    toast.error(getApiErrorMessage(error, language, labels.unexpectedError));
  }

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload: ReferencePayload = {
        name: values.name,
        status: values.status,
        ...(labels.requiredPrescriptionLabel !== undefined && {
          requiredPrescription: values.requiredPrescription,
        }),
      };
      return mode === "create"
        ? createFn(payload)
        : updateFn(item!.uuid, payload);
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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            {icon}
          </div>
          <DialogTitle className="text-base">
            {mode === "create" ? labels.addTitle : labels.editTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 px-6 py-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="ref-name">
                {labels.nameLabel}
                <span className="ml-0.5 text-destructive">*</span>
              </Label>
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <Input
                    id="ref-name"
                    placeholder={labels.namePlaceholder}
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

            {/* Status */}
            <div className="space-y-1.5">
              <Label htmlFor="ref-status">{labels.statusColumn}</Label>
              <Controller
                name="status"
                control={form.control}
                render={({ field }) => (
                  <Combobox
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    options={[
                      { value: "ACTIVE", label: labels.statusActive },
                      { value: "INACTIVE", label: labels.statusInactive },
                    ]}
                    className="rounded-xl"
                  />
                )}
              />
            </div>

            {/* Required Prescription (medicine types only) */}
            {labels.requiredPrescriptionLabel !== undefined && (
              <div className="space-y-1.5">
                <Label htmlFor="ref-required-prescription">
                  {labels.requiredPrescriptionLabel}
                </Label>
                <Controller
                  name="requiredPrescription"
                  control={form.control}
                  render={({ field }) => (
                    <Combobox
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(v === "true")}
                      options={[
                        { value: "false", label: labels.requiredPrescriptionNo! },
                        { value: "true", label: labels.requiredPrescriptionYes! },
                      ]}
                      className="rounded-xl"
                    />
                  )}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl"
            >
              {labels.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="min-w-[6rem] rounded-xl"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {labels.saving}
                </>
              ) : (
                labels.save
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
