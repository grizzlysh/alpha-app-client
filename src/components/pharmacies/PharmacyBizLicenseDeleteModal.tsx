import type { JSX } from "react";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { getApiErrorMessage } from "@/utils/apiError";
import type { BusinessLicense } from "@/types/businessLicense";
import { deleteBusinessLicense } from "@/service/businessLicenseService";

export interface PharmacyBizLicenseDeleteModalProps {
  pharmacyUuid: string;
  license: BusinessLicense;
  onClose: () => void;
  onSuccess: () => void;
}

export function PharmacyBizLicenseDeleteModal({
  pharmacyUuid,
  license,
  onClose,
  onSuccess,
}: PharmacyBizLicenseDeleteModalProps): JSX.Element {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const mutation = useMutation({
    mutationFn: () => deleteBusinessLicense(pharmacyUuid, license.uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pharmacy-biz-licenses", pharmacyUuid] });
      queryClient.invalidateQueries({ queryKey: ["pharmacies"] });
      toast.success(t.licenseDeleteSuccess);
      onSuccessRef.current();
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, language, t.unexpectedError));
    },
  });

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !mutation.isPending) onClose(); }}>
      <DialogContent
        className="max-w-sm p-0"
        onInteractOutside={(e) => { if (mutation.isPending) e.preventDefault(); }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10">
            <Trash2 className="h-4 w-4 text-destructive" />
          </div>
          <DialogTitle className="text-base">{t.licenseDeleteConfirmTitle}</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5">
          <p className="text-sm text-muted-foreground">
            {t.licenseDeleteConfirmDesc}{" "}
            <span className="font-semibold text-foreground">{license.licenseNumber}</span>?
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
            className="rounded-xl"
          >
            {t.cancel}
          </Button>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="min-w-[6rem] rounded-xl"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {t.licenseDeleting}
              </>
            ) : (
              t.deleteConfirm
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
