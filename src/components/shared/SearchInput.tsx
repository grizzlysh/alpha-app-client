import type { JSX } from "react";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isFetching?: boolean;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  isFetching = false,
  className,
}: SearchInputProps): JSX.Element {
  return (
    <div
      className={cn(
        "flex h-10 flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3",
        "transition-all duration-150",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        className
      )}
    >
      <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
      />
      {isFetching && (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
