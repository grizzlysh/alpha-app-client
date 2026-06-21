import type { JSX } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import type { Translations } from "@/configs/i18n";

interface LiveToastMessageProps {
  getMessage: (t: Translations) => string;
}

export function LiveToastMessage({ getMessage }: LiveToastMessageProps): JSX.Element {
  const { t } = useLanguage();
  return <>{getMessage(t)}</>;
}
