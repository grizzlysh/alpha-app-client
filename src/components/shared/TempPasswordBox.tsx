import type { JSX } from "react";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

/** A one-time password with a copy button. The server never shows it again. */
export function TempPasswordBox({ password }: { password: string }): JSX.Element {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure origin) — the text stays selectable.
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2">
      <code className="flex-1 select-all font-mono text-base tracking-wider text-foreground">{password}</code>
      <Button type="button" variant="ghost" size="sm" onClick={copy} className="h-8 gap-1.5 rounded-lg" aria-label={t.copy}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? t.copied : t.copy}
      </Button>
    </div>
  );
}
