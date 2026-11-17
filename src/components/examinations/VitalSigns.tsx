import type { JSX } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import { TONE_TILE, TONE_VALUE, bmiOf, bpTone, numOrNull, pulseTone, spo2Tone, tempTone, type Tone, type VitalValues, type VitalsForm } from "./vitals";

// ── Inputs ────────────────────────────────────────────────────────────────────

export function VitalsInputs({
  value,
  onChange,
  disabled,
  t,
}: {
  value: VitalsForm;
  onChange: (key: keyof VitalsForm, v: string) => void;
  disabled?: boolean;
  t: Translations;
}): JSX.Element {
  const bmi = bmiOf(numOrNull(value.weightKg), numOrNull(value.heightCm));
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <VitalInput id="bp" label={t.medicalRecordVisitBloodPressure} unit="mmHg" value={value.bloodPressure} onChange={(v) => onChange("bloodPressure", v)} disabled={disabled} placeholder="120/80" inputMode="text" />
        <VitalInput id="temp" label={t.medicalRecordVisitTemperature} unit="°C" value={value.temperatureCelsius} onChange={(v) => onChange("temperatureCelsius", v)} disabled={disabled} placeholder="36.5" />
        <VitalInput id="pulse" label={t.medicalRecordVisitPulse} unit="bpm" value={value.pulsePerMinute} onChange={(v) => onChange("pulsePerMinute", v)} disabled={disabled} placeholder="80" inputMode="numeric" />
        <VitalInput id="spo2" label={t.examSpo2} unit="%" value={value.oxygenSaturation} onChange={(v) => onChange("oxygenSaturation", v)} disabled={disabled} placeholder="98" inputMode="numeric" />
        <VitalInput id="weight" label={t.medicalRecordVisitWeight} unit="kg" value={value.weightKg} onChange={(v) => onChange("weightKg", v)} disabled={disabled} placeholder="60" />
        <VitalInput id="height" label={t.medicalRecordVisitHeight} unit="cm" value={value.heightCm} onChange={(v) => onChange("heightCm", v)} disabled={disabled} placeholder="165" />
      </div>
      {bmi != null && (
        <p className="text-xs text-muted-foreground">
          {t.examBmi}: <span className="font-semibold tabular-nums text-foreground">{bmi}</span>
        </p>
      )}
    </div>
  );
}

function VitalInput({
  id,
  label,
  unit,
  value,
  onChange,
  disabled,
  placeholder,
  inputMode = "decimal",
}: {
  id: string;
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder: string;
  inputMode?: "decimal" | "numeric" | "text";
}): JSX.Element {
  const inputId = `vital-${id}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={inputId} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          inputMode={inputMode}
          className="h-10 rounded-xl pr-12 tabular-nums"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

// ── Read-only summary ─────────────────────────────────────────────────────────

export function VitalsSummary({ values, t, compact }: { values: VitalValues; t: Translations; compact?: boolean }): JSX.Element {
  const bmi = bmiOf(values.weightKg, values.heightCm);
  const tiles: { label: string; value: string | null; unit: string; tone: Tone }[] = [
    { label: t.examVitalBp, value: values.bloodPressure, unit: "mmHg", tone: bpTone(values.bloodPressure) },
    { label: t.examVitalTemp, value: values.temperatureCelsius != null ? String(values.temperatureCelsius) : null, unit: "°C", tone: tempTone(values.temperatureCelsius) },
    { label: t.examVitalPulse, value: values.pulsePerMinute != null ? String(values.pulsePerMinute) : null, unit: "bpm", tone: pulseTone(values.pulsePerMinute) },
    { label: t.examSpo2, value: values.oxygenSaturation != null ? String(values.oxygenSaturation) : null, unit: "%", tone: spo2Tone(values.oxygenSaturation) },
    { label: t.examVitalWeight, value: values.weightKg != null ? String(values.weightKg) : null, unit: "kg", tone: "normal" },
    { label: t.examVitalHeight, value: values.heightCm != null ? String(values.heightCm) : null, unit: "cm", tone: "normal" },
    { label: t.examBmi, value: bmi != null ? String(bmi) : null, unit: "", tone: "normal" },
  ];
  const shown = tiles.filter((x) => x.value);

  if (shown.length === 0) {
    return <p className="text-sm text-muted-foreground">{t.examNoVitals}</p>;
  }

  return (
    <dl className={cn("grid gap-2", compact ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-4 xl:grid-cols-7")}>
      {shown.map((x) => (
        <div key={x.label} className={cn("rounded-xl border px-3 py-2", TONE_TILE[x.tone])}>
          <dt className="truncate text-[11px] font-medium text-muted-foreground">{x.label}</dt>
          <dd className={cn("mt-0.5 flex items-baseline gap-1", TONE_VALUE[x.tone])}>
            <span className="text-base font-semibold tabular-nums leading-tight">{x.value}</span>
            {x.unit && <span className="text-[11px] text-muted-foreground">{x.unit}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

