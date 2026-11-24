import type { JSX } from "react";

import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";
import { type LabelFields, type LabelKind, type LabelSize, LABEL_SIZES } from "./barcodeLabels";
import { FIELDS_BY_KIND, type PrintPrefs, toggleField } from "./printPrefs";

export interface LabelSettingsProps {
  prefs: PrintPrefs;
  onChange: (prefs: PrintPrefs) => void;
  /** Kinds whose fields are shown; with several, each gets a heading. */
  kinds: LabelKind[];
}

/** Label size and, per label kind, which lines are printed. */
export function LabelSettings({ prefs, onChange, kinds }: LabelSettingsProps): JSX.Element {
  const { t } = useLanguage();
  const sizeLabel: Record<LabelSize, string> = {
    "50x30": t.printSizeThermal5030,
    "38x25": t.printSizeThermal3825,
    "a4-64x34": t.printSizeA4,
  };
  const kindLabel: Record<LabelKind, string> = {
    "batch-label": t.printBatchLabel,
    "item-label": t.printItemLabel,
    "medicine-label": t.printMedicineLabel,
  };
  const fieldLabel = (kind: LabelKind, field: keyof LabelFields): string =>
    ({
      showStock: kind === "medicine-label" ? t.printShowTotalStock : t.printShowStock,
      showExpiry: t.printShowExpiry,
      showContents: t.printShowContents,
      showPrice: t.printShowPrice,
    })[field];

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="print-size">{t.printSize}</Label>
        <select
          id="print-size"
          value={prefs.size}
          onChange={(e) => onChange({ ...prefs, size: e.target.value as LabelSize })}
          className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {LABEL_SIZES.map((s) => (
            <option key={s.value} value={s.value}>{sizeLabel[s.value]}</option>
          ))}
        </select>
      </div>

      {kinds.map((kind) => (
        <fieldset key={kind} className="space-y-2">
          <legend className="mb-1 text-sm font-medium text-foreground">
            {kinds.length > 1 ? kindLabel[kind] : t.printFields}
          </legend>
          {FIELDS_BY_KIND[kind].map((field) => (
            <label key={field} className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={prefs.fields[kind][field]}
                onChange={() => onChange(toggleField(prefs, kind, field))}
                className="h-4 w-4 accent-[hsl(var(--primary))]"
              />
              {fieldLabel(kind, field)}
            </label>
          ))}
        </fieldset>
      ))}
    </div>
  );
}
