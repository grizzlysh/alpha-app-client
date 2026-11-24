import type { VitalsPayload } from "@/types/examination";

// ── Form state ────────────────────────────────────────────────────────────────

export interface VitalsForm {
  bloodPressure: string;
  temperatureCelsius: string;
  pulsePerMinute: string;
  oxygenSaturation: string;
  weightKg: string;
  heightCm: string;
}

export interface VitalValues {
  bloodPressure: string | null;
  temperatureCelsius: number | null;
  pulsePerMinute: number | null;
  oxygenSaturation: number | null;
  weightKg: number | null;
  heightCm: number | null;
}

const str = (v: number | string | null | undefined): string => (v == null ? "" : String(v));

export const vitalsFormOf = (v: VitalValues): VitalsForm => ({
  bloodPressure: str(v.bloodPressure),
  temperatureCelsius: str(v.temperatureCelsius),
  pulsePerMinute: str(v.pulsePerMinute),
  oxygenSaturation: str(v.oxygenSaturation),
  weightKg: str(v.weightKg),
  heightCm: str(v.heightCm),
});

export const numOrNull = (v: string): number | null => {
  const n = parseFloat(v.replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

const intOrNull = (v: string): number | null => {
  const n = numOrNull(v);
  return n == null ? null : Math.round(n);
};

export const vitalsPayloadOf = (f: VitalsForm): Omit<VitalsPayload, "chiefComplaint"> => ({
  bloodPressure: f.bloodPressure.trim(),
  temperatureCelsius: numOrNull(f.temperatureCelsius),
  pulsePerMinute: intOrNull(f.pulsePerMinute),
  oxygenSaturation: intOrNull(f.oxygenSaturation),
  weightKg: numOrNull(f.weightKg),
  heightCm: numOrNull(f.heightCm),
});

export const hasAnyVital = (v: VitalValues): boolean =>
  Boolean(v.bloodPressure) ||
  [v.temperatureCelsius, v.pulsePerMinute, v.oxygenSaturation, v.weightKg, v.heightCm].some((x) => x != null);

// ── Reference ranges (adult; a hint for the doctor, not a diagnosis) ─────────

export type Tone = "normal" | "warn" | "danger";

export function bpTone(bp: string | null): Tone {
  const m = bp?.match(/^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/);
  if (!m) return "normal";
  const sys = Number(m[1]);
  const dia = Number(m[2]);
  if (sys >= 180 || dia >= 120 || sys < 90 || dia < 60) return "danger";
  if (sys >= 140 || dia >= 90) return "warn";
  return "normal";
}

export const tempTone = (t: number | null): Tone => (t == null ? "normal" : t >= 38 || t < 35 ? "danger" : t >= 37.5 ? "warn" : "normal");
export const pulseTone = (p: number | null): Tone => (p == null ? "normal" : p > 120 || p < 50 ? "danger" : p > 100 || p < 60 ? "warn" : "normal");
export const spo2Tone = (s: number | null): Tone => (s == null ? "normal" : s < 92 ? "danger" : s < 95 ? "warn" : "normal");

export function bmiOf(weightKg: number | null, heightCm: number | null): number | null {
  if (!weightKg || !heightCm) return null;
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

export const TONE_TILE: Record<Tone, string> = {
  normal: "border-border bg-card",
  warn: "border-amber-300 bg-amber-50 dark:border-amber-700/60 dark:bg-amber-950/30",
  danger: "border-destructive/40 bg-destructive/5",
};
export const TONE_VALUE: Record<Tone, string> = {
  normal: "text-foreground",
  warn: "text-amber-800 dark:text-amber-300",
  danger: "text-destructive",
};

/** One-line vitals for the queue list, e.g. "120/80 · 38.2°C · SpO₂ 97%". */
export function vitalsInline(v: VitalValues): string {
  return [
    v.bloodPressure,
    v.temperatureCelsius != null && `${v.temperatureCelsius}°C`,
    v.pulsePerMinute != null && `${v.pulsePerMinute} bpm`,
    v.oxygenSaturation != null && `SpO₂ ${v.oxygenSaturation}%`,
  ]
    .filter(Boolean)
    .join(" · ");
}

/** True when any vital is outside the adult reference range above. */
export function hasAbnormalVital(v: VitalValues): boolean {
  return [bpTone(v.bloodPressure), tempTone(v.temperatureCelsius), pulseTone(v.pulsePerMinute), spo2Tone(v.oxygenSaturation)].some((x) => x !== "normal");
}
