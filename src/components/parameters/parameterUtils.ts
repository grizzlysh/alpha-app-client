export { formatDate } from "@/utils/dateHelpers";
import type { Translations } from "@/configs/i18n";
import { isNameCase, type NameCase } from "@/utils/nameFormat";
import { isMedicineNameFormat, type MedicineNameFormat } from "@/utils/medicineName";

export const nameCaseLabel = (mode: NameCase, t: Translations): string =>
  ({ UPPER: t.nameCaseUpper, TITLE: t.nameCaseTitle, LOWER: t.nameCaseLower, AS_TYPED: t.nameCaseAsTyped })[mode];

export const medicineNameFormatLabel = (format: MedicineNameFormat, t: Translations): string =>
  ({
    NAME_STRENGTH_SHAPE: t.medicineFormatNameStrengthShape,
    NAME_SHAPE_STRENGTH: t.medicineFormatNameShapeStrength,
    NAME_STRENGTH: t.medicineFormatNameStrength,
  })[format];

/** A parameter's value as shown in the list (choice parameters get their label). */
export function displayParamValue(key: string, value: string, t: Translations): string {
  if (key === "NAME_DISPLAY_CASE" && isNameCase(value)) return nameCaseLabel(value, t);
  if (key === "MEDICINE_NAME_FORMAT" && isMedicineNameFormat(value)) return medicineNameFormatLabel(value, t);
  return value;
}
