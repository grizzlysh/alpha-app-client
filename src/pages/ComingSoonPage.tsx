import type { JSX } from "react";
import { Construction } from "lucide-react";

import { useLanguage } from "@/hooks/useLanguage";
import type { Translations } from "@/configs/i18n";

export interface ComingSoonPageProps {
  titleKey: keyof Translations;
}

export default function ComingSoonPage({ titleKey }: ComingSoonPageProps): JSX.Element {
  const { t } = useLanguage();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <Construction className="h-10 w-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-foreground">{t[titleKey]}</p>
      <p className="text-sm text-muted-foreground">Coming soon</p>
    </div>
  );
}
