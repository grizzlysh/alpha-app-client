import type { JSX } from "react";
import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/utils/cn";

type SortDir = "asc" | "desc";

interface SortState {
  key: string;
  dir: SortDir;
}

export interface ReportTableColumn<T> {
  key: string;
  header: string;
  className?: string;
  sortValue?: (row: T) => string | number;
  render: (row: T, index: number) => JSX.Element | string | number | null;
}

interface ReportTableProps<T> {
  columns: ReportTableColumn<T>[];
  rows: T[];
  keyExtractor: (row: T, index: number) => string;
  emptyLabel?: string;
}

export function ReportTable<T>({
  columns,
  rows,
  keyExtractor,
  emptyLabel = "No data",
}: ReportTableProps<T>): JSX.Element {
  const [sort, setSort] = useState<SortState | null>(null);

  function handleHeaderClick(col: ReportTableColumn<T>): void {
    if (!col.sortValue) return;
    setSort((prev) => {
      if (!prev || prev.key !== col.key) return { key: col.key, dir: "asc" };
      if (prev.dir === "asc") return { key: col.key, dir: "desc" };
      return null;
    });
  }

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    return [...rows].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sort, columns]);

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columns.map((col) => {
              const isSortable = !!col.sortValue;
              const isActive = sort?.key === col.key;
              return (
                <th
                  key={col.key}
                  onClick={() => handleHeaderClick(col)}
                  className={cn(
                    "px-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap",
                    col.className,
                    isSortable && "cursor-pointer select-none hover:text-foreground transition-colors"
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {isSortable && (
                      <span className="shrink-0 text-muted-foreground/60">
                        {isActive && sort?.dir === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5 text-foreground" />
                        ) : isActive && sort?.dir === "desc" ? (
                          <ChevronDown className="h-3.5 w-3.5 text-foreground" />
                        ) : (
                          <ChevronsUpDown className="h-3.5 w-3.5" />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                {emptyLabel}
              </td>
            </tr>
          ) : (
            sortedRows.map((row, i) => (
              <tr
                key={keyExtractor(row, i)}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-4 py-2.5 text-foreground", col.className)}
                  >
                    {col.render(row, i)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
