import type { JSX } from "react";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { getApiErrorMessage } from "@/utils/apiError";
import type { ReferenceItem, ReferenceLabels } from "./referenceTypes";

export interface ReferenceDeleteModalProps {
  item: ReferenceItem;
  labels: ReferenceLabels;
  queryKey: string;
  onClose: () => void;
  onSuccess: () => void;
  deleteFn: (uuid: string) => Promise<ApiResponse<null>>;
}

export function ReferenceDeleteModal({
  item,
  labels,
  queryKey,
  onClose,
  onSuccess,
  deleteFn,
}: ReferenceDeleteModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { language } = useLanguage();

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const mutation = useMutation({
    mutationFn: () => deleteFn(item.uuid),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        onSuccessRef.current();
      } else {
        toast.error(res.message[language]);
      }
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, language, labels.unexpectedError));
    },
  });

  const isPending = mutation.isPending;

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
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <DialogTitle className="text-base">
            {labels.deleteConfirmTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5">
          <DialogDescription className="text-sm text-muted-foreground">
            {labels.deleteConfirmDesc}
          </DialogDescription>
          <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm font-medium text-foreground">
            {item.name}
          </p>
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
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={() => mutation.mutate()}
            className="min-w-[7rem] rounded-xl"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {labels.deleting}
              </>
            ) : (
              labels.deleteConfirm
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
