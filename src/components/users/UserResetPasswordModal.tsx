import type { JSX } from "react";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { getApiErrorMessage } from "@/utils/apiError";
import type { UserListItem } from "@/types/user";
import { resetUserPassword } from "@/service/userService";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";

export interface UserResetPasswordModalProps {
  user: UserListItem;
  onClose: () => void;
}

export function UserResetPasswordModal({
  user,
  onClose,
}: UserResetPasswordModalProps): JSX.Element {
  const { t, language } = useLanguage();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const mutation = useMutation({
    mutationFn: () => resetUserPassword(user.uuid),
    onSuccess: () => {
      toast.success(
        <LiveToastMessage getMessage={(t) => t.userResetPasswordSuccess} />
      );
      onCloseRef.current();
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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <KeyRound className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">{t.userResetPasswordConfirmTitle}</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5">
          <p className="text-sm text-muted-foreground">
            {t.userResetPasswordConfirmDesc}{" "}
            <span className="font-semibold text-foreground">{user.name}</span>?
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
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="min-w-[6rem] rounded-xl"
          >
            {mutation.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> {t.userResettingPassword}</>
            ) : t.userResetPassword}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
