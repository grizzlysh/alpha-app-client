import type { JSX, ReactNode } from "react";
import { Search, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TableEmptyStateProps {
  isSearch: boolean;
  icon: ReactNode;
  title: string;
  description?: string;
  addLabel?: string;
  onAdd?: () => void;
}

export function TableEmptyState({
  isSearch,
  icon,
  title,
  description,
  addLabel,
  onAdd,
}: TableEmptyStateProps): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-4 px-8 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        {isSearch ? (
          <Search className="h-8 w-8 text-muted-foreground/40" />
        ) : (
          icon
        )}
      </div>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        {!isSearch && description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {!isSearch && onAdd && addLabel && (
        <Button onClick={onAdd} className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" />
          <span className="inline-block text-center">{addLabel}</span>
        </Button>
      )}
    </div>
  );
}
