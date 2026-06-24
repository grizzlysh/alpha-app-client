import type { JSX } from "react";
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
import { useDeleteMutation } from "@/hooks/useDeleteMutation";
import type { StorageShelf } from "@/types/storage";
import { deleteShelf } from "@/service/storageService";

export interface ShelfDeleteModalProps {
  shelf: StorageShelf;
  cabinetUuid: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ShelfDeleteModal({
  shelf,
  cabinetUuid,
  onClose,
  onSuccess,
}: ShelfDeleteModalProps): JSX.Element {
  const { t } = useLanguage();

  const { mutate, isPending } = useDeleteMutation({
    mutationFn: () => deleteShelf(shelf.uuid),
    queryKey: ["storage-shelves", cabinetUuid],
    onSuccess,
  });

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !isPending) onClose(); }}>
      <DialogContent
        className="max-w-sm p-0"
        onInteractOutside={(e) => { if (isPending) e.preventDefault(); }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <DialogTitle className="text-base">{t.shelfDeleteConfirmTitle}</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5">
          <DialogDescription className="text-sm text-muted-foreground">
            {t.shelfDeleteConfirmDesc}
          </DialogDescription>
          <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm font-medium uppercase text-foreground">
            {shelf.name}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {shelf.code}
            </span>
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="rounded-xl">
            {t.cancel}
          </Button>
          <Button type="button" variant="destructive" disabled={isPending} onClick={mutate} className="min-w-[7rem] rounded-xl">
            {isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" />{t.shelfDeleting}</>
            ) : (
              t.deleteConfirm
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
