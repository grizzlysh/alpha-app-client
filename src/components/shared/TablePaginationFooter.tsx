import type { JSX } from "react";
import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LIMIT_OPTIONS = [10, 25, 50] as const;

interface PaginationLabels {
  showing: string;
  of: string;
  rowsPerPage: string;
}

interface TablePaginationFooterProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  labels: PaginationLabels;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function TablePaginationFooter({
  page,
  limit,
  total,
  totalPages,
  labels,
  onPageChange,
  onLimitChange,
}: TablePaginationFooterProps): JSX.Element {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [page - 2, page - 1, page, page + 1, page + 2];
  }, [page, totalPages]);

  return (
    <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm text-muted-foreground">
          {labels.showing}{" "}
          <span className="font-medium text-foreground">
            {start}–{end}
          </span>{" "}
          {labels.of}{" "}
          <span className="font-medium text-foreground">{total}</span>
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{labels.rowsPerPage}</span>
          <Select
            value={String(limit)}
            onValueChange={(val) => onLimitChange(Number(val))}
          >
            <SelectTrigger className="h-8 w-[70px] rounded-lg text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LIMIT_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 rounded-lg p-0"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {pageNumbers.map((n) => (
            <Button
              key={n}
              variant={n === page ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 rounded-lg p-0 text-sm"
              onClick={() => onPageChange(n)}
            >
              {n}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 rounded-lg p-0"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
