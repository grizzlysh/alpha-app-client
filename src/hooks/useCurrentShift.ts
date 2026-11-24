import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { useCan } from "@/hooks/usePermission";
import { getCurrentShift } from "@/service/shiftService";
import type { RootState } from "@/store";
import type { CurrentShift } from "@/types/shift";

export const CURRENT_SHIFT_KEY = "current-shift";

interface UseCurrentShiftResult {
  data: CurrentShift | undefined;
  isLoading: boolean;
  /** Shifts are on and this cashier has none open: payments will be refused. */
  mustOpen: boolean;
}

/** The signed-in cashier's open shift and the pharmacy's shift settings. */
export function useCurrentShift(): UseCurrentShiftResult {
  const can = useCan();
  const pharmacyUuid = useSelector((state: RootState) => state.auth.currentPharmacy?.uuid);
  const query = useQuery({
    queryKey: [CURRENT_SHIFT_KEY, pharmacyUuid],
    queryFn: getCurrentShift,
    enabled: !!pharmacyUuid && can("sales.create"),
    staleTime: 30_000,
    select: (res) => res.data ?? undefined,
  });
  const data = query.data;
  return { data, isLoading: query.isLoading, mustOpen: !!data?.settings.enabled && !data.shift };
}
