import type { JSX } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface TableSortIconProps {
  isSorted: false | "asc" | "desc";
}

export function TableSortIcon({ isSorted }: TableSortIconProps): JSX.Element {
  if (isSorted === "asc") return <ArrowUp className="h-3 w-3 text-primary" />;
  if (isSorted === "desc") return <ArrowDown className="h-3 w-3 text-primary" />;
  return (
    <ArrowUpDown className="h-3 w-3 opacity-40 transition-opacity group-hover:opacity-70" />
  );
}
