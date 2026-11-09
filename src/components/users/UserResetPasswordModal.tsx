import type { JSX } from "react";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Copy, Loader2, KeyRound } from "lucide-react";
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

  // The server returns a one-time password; it is shown here once and never again.
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: () => resetUserPassword(user.uuid),
    onSuccess: (res) => {
      toast.success(
        <LiveToastMessage getMessage={(t) => t.userResetPasswordSuccess} />
      );
      const password = res.data?.temporaryPassword;
      if (password) setTemporaryPassword(password);
      else onCloseRef.current();
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, language, t.unexpectedError));
    },
  });

  async function handleCopy(): Promise<void> {
    if (!temporaryPassword) return;
    try {
      await navigator.clipboard.writeText(temporaryPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable (non-secure origin); the password stays visible to copy by hand.
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !mutation.isPending) onClose(); }}>
      <DialogContent
        className="max-w-sm p-0"
        onInteractOutside={(e) => {
          // Don't let a stray click discard the only copy of the temporary password.
          if (mutation.isPending || temporaryPassword) e.preventDefault();
        }}
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <KeyRound className="h-4 w-4 text-primary" />
          </div>
          <DialogTitle className="text-base">
            {temporaryPassword ? t.userTempPasswordTitle : t.userResetPasswordConfirmTitle}
          </DialogTitle>
        </DialogHeader>

        {temporaryPassword ? (
          <div className="space-y-3 px-6 py-5">
            <p className="text-sm text-muted-foreground">{t.userTempPasswordDesc}</p>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2">
              <code className="flex-1 select-all font-mono text-base tracking-wider text-foreground">
                {temporaryPassword}
              </code>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 gap-1.5 rounded-lg"
                aria-label={t.copy}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? t.copied : t.copy}
              </Button>
            </div>
          </div>
        ) : (
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground">
              {t.userResetPasswordConfirmDesc}{" "}
              <span className="font-semibold uppercase text-foreground">{user.name}</span>?
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          {temporaryPassword ? (
            <Button onClick={onClose} className="min-w-[6rem] rounded-xl">
              {t.done}
            </Button>
          ) : (
            <>
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
