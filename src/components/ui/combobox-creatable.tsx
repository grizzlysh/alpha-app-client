import { useState } from "react";
import type { JSX } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface ComboboxCreatableOption {
  value: string;
  label: string;
}

interface ComboboxCreatableProps {
  value: string;
  onValueChange: (value: string) => void;
  options: ComboboxCreatableOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  creatableLabel?: (input: string) => string;
  disabled?: boolean;
  className?: string;
}

export function ComboboxCreatable({
  value,
  onValueChange,
  options,
  placeholder = "Select or type…",
  searchPlaceholder = "Search or type…",
  creatableLabel = (input) => `Use "${input}"`,
  disabled = false,
  className,
}: ComboboxCreatableProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const trimmed = search.trim();

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const exactMatch = options.some(
    (o) => o.label.toLowerCase() === trimmed.toLowerCase()
  );

  function handleSelect(val: string): void {
    onValueChange(val);
    setSearch("");
    setOpen(false);
  }

  function handleOpenChange(next: boolean): void {
    setOpen(next);
    if (!next) setSearch("");
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between bg-card font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandGroup>
              {filtered.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
              {trimmed && !exactMatch && (
                <CommandItem
                  value={`__create__${trimmed}`}
                  onSelect={() => handleSelect(trimmed)}
                >
                  <Plus className="mr-2 h-4 w-4 text-muted-foreground" />
                  {creatableLabel(trimmed)}
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
