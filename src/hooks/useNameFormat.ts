import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { store, type RootState } from "@/store";
import { formatName, isNameCase, type NameCase } from "@/utils/nameFormat";

/** The selected pharmacy's name case; UPPER when none is selected. */
export function useNameCase(): NameCase {
  return useSelector((state: RootState) => {
    const v = state.auth.currentPharmacy?.nameCase;
    return isNameCase(v) ? v : "UPPER";
  });
}

/** `fmt(name)` formats a name per the pharmacy setting; `fmt(name, { doctor: true })` keeps "dr." lowercase in title case. */
export function useNameFormat(): (name: string | null | undefined, opts?: { doctor?: boolean }) => string {
  const mode = useNameCase();
  return useCallback((name, opts) => formatName(name, mode, opts), [mode]);
}

const CSS_CASE: Record<NameCase, string> = { UPPER: "uppercase", TITLE: "capitalize", LOWER: "lowercase", AS_TYPED: "none" };

/** Keeps the `.name-case` CSS class in step with the setting. Mount once at the app root. */
export function useApplyNameCase(): void {
  const mode = useNameCase();
  useEffect(() => {
    document.documentElement.style.setProperty("--name-case", CSS_CASE[mode]);
  }, [mode]);
}

/** For code outside React (print HTML): the current pharmacy's name case. */
export function currentNameCase(): NameCase {
  const v = store.getState().auth.currentPharmacy?.nameCase;
  return isNameCase(v) ? v : "UPPER";
}
