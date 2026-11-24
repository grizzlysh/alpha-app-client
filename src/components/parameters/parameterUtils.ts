export { formatDate } from "@/utils/dateHelpers";
import type { Translations } from "@/configs/i18n";
import { isNameCase, type NameCase } from "@/utils/nameFormat";

export const nameCaseLabel = (mode: NameCase, t: Translations): string =>
  ({ UPPER: t.nameCaseUpper, TITLE: t.nameCaseTitle, LOWER: t.nameCaseLower, AS_TYPED: t.nameCaseAsTyped })[mode];

/** A parameter's value as shown in the list (choice parameters get their label). */
export function displayParamValue(key: string, value: string, t: Translations): string {
  if (key === "NAME_DISPLAY_CASE" && isNameCase(value)) return nameCaseLabel(value, t);
  return value;
}
