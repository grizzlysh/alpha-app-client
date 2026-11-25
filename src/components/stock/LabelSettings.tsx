import type { JSX } from "react";

import { useLanguage } from "@/hooks/useLanguage";
import { type LabelSize, LABEL_SIZES } from "./barcodeLabels";
import type { PrintPrefs } from "./printPrefs";

export interface LabelSettingsProps {
  prefs: PrintPrefs;
  onChange: (prefs: PrintPrefs) => void;
}

/** Label size (paper). What a label shows is fixed by the print mode. */
export function LabelSettings({ prefs, onChange }: LabelSettingsProps): JSX.Element {
  const { t } = useLanguage();
  const sizeLabel: Record<LabelSize, string> = {
    "50x30": t.printSizeThermal5030,
    "38x25": t.printSizeThermal3825,
    "a4-64x34": t.printSizeA4,
  };

  return (
    <select
      value={prefs.size}
      aria-label={t.printSize}
      title={t.printSize}
      onChange={(e) => onChange({ ...prefs, size: e.target.value as LabelSize })}
      className="h-9 min-w-0 rounded-lg border border-input bg-card px-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      {LABEL_SIZES.map((s) => (
        <option key={s.value} value={s.value}>{sizeLabel[s.value]}</option>
      ))}
    </select>
  );
}
