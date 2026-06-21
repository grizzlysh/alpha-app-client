import { useState } from "react";
import { useDebounce } from "use-debounce";

interface UseTablePageStateReturn {
  searchInput: string;
  debouncedSearch: string;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  handleLimitChange: (limit: number) => void;
  handleSearchChange: (value: string) => void;
}

export function useTablePageState(): UseTablePageStateReturn {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 400);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  function handleLimitChange(newLimit: number): void {
    setLimit(newLimit);
    setPage(1);
  }

  function handleSearchChange(value: string): void {
    setSearchInput(value);
    setPage(1);
  }

  return {
    searchInput,
    debouncedSearch,
    page,
    setPage,
    limit,
    handleLimitChange,
    handleSearchChange,
  };
}
