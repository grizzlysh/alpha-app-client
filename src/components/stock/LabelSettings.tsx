import type { JSX } from "react";

import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";
import { type LabelFields, type LabelSize, type PrintMode, LABEL_SIZES } from "./barcodeLabels";
import { LABEL_FIELDS, type PrintPrefs, toggleField } from "./printPrefs";

export interface LabelSettingsProps {
  prefs: PrintPrefs;
  onChange: (prefs: PrintPrefs) => void;
  /** Fields are remembered separately for each print mode. */
  mode: PrintMode;
}

/** Label size and which lines are printed. */
export function LabelSettings({ prefs, onChange, mode }: LabelSettingsProps): JSX.Element {
  const { t } = useLanguage();
  const sizeLabel: Record<LabelSize, string> = {
    "50x30": t.printSizeThermal5030,
    "38x25": t.printSizeThermal3825,
    "a4-64x34": t.printSizeA4,
  };
  const fieldLabel: Record<keyof LabelFields, string> = {
    showStock: t.printShowStock,
    showExpiry: t.printShowExpiry,
    showPrice: t.printShowPrice,
  };

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

      <fieldset className="space-y-2">
        <legend className="mb-1 text-sm font-medium text-foreground">{t.printFields}</legend>
        {LABEL_FIELDS.map((field) => (
          <label key={field} className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={prefs.fields[mode][field]}
              onChange={() => onChange(toggleField(prefs, mode, field))}
              className="h-4 w-4 accent-[hsl(var(--primary))]"
            />
            {fieldLabel[field]}
          </label>
        ))}
      </fieldset>
    </div>
  );
}
