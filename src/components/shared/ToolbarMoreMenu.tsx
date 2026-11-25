import type { JSX } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, MoreVertical } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/useLanguage";
import { getApiErrorMessage } from "@/utils/apiError";

export interface ToolbarAction {
  key: string;
  label: string;
  /** One short line under the label: what the action does. */
  description?: string;
  icon: LucideIcon;
  /** Runs at once (export), or opens a modal (import). A thrown error shows as a toast. */
  onSelect: () => void | Promise<void>;
  /** Starts a new group with a line above it. */
  separated?: boolean;
}

export interface ToolbarMoreMenuProps {
  /** Actions the user may not do are left out (pass `false` / `undefined`). */
  actions: (ToolbarAction | false | null | undefined)[];
}

/**
 * The "⋮" button of a list page's toolbar, right before the main "Add" button.
 * It holds the page's secondary actions: export, import, templates, and the like.
 * Hidden when the user may do none of them.
 */
export function ToolbarMoreMenu({ actions }: ToolbarMoreMenuProps): JSX.Element | null {
  const { t, language } = useLanguage();
  const [running, setRunning] = useState<string | null>(null);
  const items = actions.filter((a): a is ToolbarAction => !!a);
  if (items.length === 0) return null;

  async function run(action: ToolbarAction): Promise<void> {
    setRunning(action.key);
    try {
      await action.onSelect();
    } catch (err) {
      toast.error(getApiErrorMessage(err, language, t.unexpectedError));
    } finally {
      setRunning(null);
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={running !== null}
          aria-label={t.toolbarMoreActions}
          title={t.toolbarMoreActions}
          className="h-10 w-10 shrink-0 rounded-xl"
        >
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-xl p-1.5">
        {items.map((action, i) => (
          <div key={action.key}>
            {action.separated && i > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem onSelect={() => void run(action)} className="items-start gap-3 rounded-lg px-2.5 py-2">
              <action.icon className="mt-0.5 text-muted-foreground" />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">{action.label}</span>
                {action.description && <span className="block text-xs text-muted-foreground">{action.description}</span>}
              </span>
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
