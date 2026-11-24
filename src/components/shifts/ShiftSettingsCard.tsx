import type { JSX } from "react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LiveToastMessage } from "@/components/shared/LiveToastMessage";
import { useLanguage } from "@/hooks/useLanguage";
import { CURRENT_SHIFT_KEY } from "@/hooks/useCurrentShift";
import { getBusinessParameters, updateBusinessParameter } from "@/service/businessParameterService";
import { getApiErrorMessage } from "@/utils/apiError";
import { cn } from "@/utils/cn";
import { SHIFT_PARAM_KEYS, type ShiftSettings } from "@/types/shift";
import type { Parameter } from "@/types/parameters";
import { AmountInput } from "./AmountInput";

type SettingKey = keyof ShiftSettings;
const KEYS = Object.entries(SHIFT_PARAM_KEYS) as [SettingKey, string][];

const toValue = (v: ShiftSettings[SettingKey]): string => String(v);

function fromParams(params: Parameter[]): ShiftSettings | null {
  const get = (key: string) => params.find((p) => p.key === key)?.value;
  if (KEYS.some(([, key]) => get(key) === undefined)) return null;
  return {
    enabled: get(SHIFT_PARAM_KEYS.enabled) === "true",
    openingCash: Number(get(SHIFT_PARAM_KEYS.openingCash) ?? 0),
    blindClose: get(SHIFT_PARAM_KEYS.blindClose) === "true",
    differenceTolerance: Number(get(SHIFT_PARAM_KEYS.differenceTolerance) ?? 0),
  };
}

/** The four shift business parameters as a form (for whoever may edit parameters). */
export function ShiftSettingsCard(): JSX.Element {
  const { t } = useLanguage();
  const { data: params, isLoading } = useQuery({
    queryKey: ["business-parameters", "cashier-shift"],
    queryFn: () => getBusinessParameters({ search: "CASHIER_SHIFT", limit: 20 }),
    select: (res) => res.data ?? [],
  });
  const saved = params ? fromParams(params) : null;

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Settings2 className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{t.shiftSettings}</h3>
          <p className="text-sm text-muted-foreground">{t.shiftSettingsDesc}</p>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : !saved || !params ? (
        <p className="text-sm text-muted-foreground">{t.shiftSettingsMissing}</p>
      ) : (
        <ShiftSettingsForm params={params} saved={saved} />
      )}
    </Card>
  );
}

function ShiftSettingsForm({ params, saved }: { params: Parameter[]; saved: ShiftSettings }): JSX.Element {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ShiftSettings>(saved);

  const mutation = useMutation({
    mutationFn: async (next: ShiftSettings) => {
      for (const [field, key] of KEYS) {
        if (toValue(saved[field]) === toValue(next[field])) continue;
        const param = params.find((p) => p.key === key);
        if (!param) continue;
        const res = await updateBusinessParameter(param.uuid, { value: toValue(next[field]) });
        if (!res.success) throw new Error(res.message[language]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-parameters"] });
      queryClient.invalidateQueries({ queryKey: [CURRENT_SHIFT_KEY] });
      toast.success(<LiveToastMessage getMessage={(tr) => tr.shiftSettingsSaved} />);
    },
    onError: (error: unknown) => toast.error(getApiErrorMessage(error, language, t.unexpectedError)),
  });

  const dirty = KEYS.some(([f]) => toValue(form[f]) !== toValue(saved[f]));
  const set = <K extends SettingKey>(field: K, value: ShiftSettings[K]): void => setForm((f) => ({ ...f, [field]: value }));

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(form);
      }}
    >
      <Toggle id="shift-enabled" label={t.shiftSettingEnabled} description={t.shiftSettingEnabledDesc} checked={form.enabled} onChange={(v) => set("enabled", v)} />
      <fieldset disabled={!form.enabled} className={cn("space-y-4", !form.enabled && "opacity-50")}>
        <Toggle id="shift-blind" label={t.shiftSettingBlindClose} description={t.shiftSettingBlindCloseDesc} checked={form.blindClose} onChange={(v) => set("blindClose", v)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <AmountField id="shift-opening" label={t.shiftSettingOpeningCash} description={t.shiftSettingOpeningCashDesc} value={form.openingCash} onChange={(v) => set("openingCash", v)} />
          <AmountField id="shift-tolerance" label={t.shiftSettingTolerance} description={t.shiftSettingToleranceDesc} value={form.differenceTolerance} onChange={(v) => set("differenceTolerance", v)} />
        </div>
      </fieldset>
      <div className="flex justify-end">
        <Button type="submit" disabled={!dirty || mutation.isPending} className="rounded-xl">
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {t.shiftSettingsSave}
        </Button>
      </div>
    </form>
  );
}

interface ToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Toggle({ id, label, description, checked, onChange }: ToggleProps): JSX.Element {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 flex-shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed",
          checked ? "bg-primary" : "bg-muted-foreground/30"
        )}
      >
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform", checked ? "translate-x-[1.375rem]" : "translate-x-0.5")} />
      </button>
    </div>
  );
}

interface AmountFieldProps {
  id: string;
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}

function AmountField({ id, label, description, value, onChange }: AmountFieldProps): JSX.Element {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
      <AmountInput id={id} value={value} onChange={onChange} />
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
